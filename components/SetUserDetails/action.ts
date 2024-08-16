"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

export default async function handleUserDetails(prevState: {
  ok?: string;
  error?: string;
}, formData: FormData) {
  const displayName = z.string().min(2).max(5).safeParse(formData.get("displayName"));
  const period = z.coerce.number().int().safeParse(formData.get("period"));
  if (!displayName.success) {
    return { error: "表示名は2字以上5字以内です。" };
  } else if (!period.success) {
    return { error: "期は整数で入力してください。" };
  } else {
    try {
      const session = await auth();
      const user = await prisma.user.findFirst({
        where: {
          displayName: displayName.data,
          id: {
            not: session?.user?.id,
          }
        },
        select: {
          id: true,
        },
      });
      if (!!user) return { error: "この表示名は使用できません。" }
      await prisma.user.update({
        data: {
          displayName: displayName.data,
          period: period.data,
        },
        where: { id: session?.user.id }
      });
      return { ok: "変更を反映しました。" };
    } catch(error) {
      throw error;
    }
  }
}
