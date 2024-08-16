"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

export default async function deleteOverallSchedule(prevState: { ok?: string, error?: string}, formData: FormData) {
  const date = z.string().date().safeParse(formData.get("date"));
  const ISODate = z.coerce.date().safeParse(date.data);
  if (!ISODate.success) return { error: "Error!" };
  else {
    const schedule = await prisma.schedule.findMany({
      where: {
        date: ISODate.data
      },
      select: {
        id: true
      }
    });
    if (!schedule) return { error: "No such data." };
    await prisma.attendance.deleteMany({
      where: {
        scheduleId: {
          in: schedule.map(item => item.id)
        }
      }
    });
    await prisma.schedule.deleteMany({
      where: {
        id: {
          in: schedule.map(item => item.id)
        }
      }
    });
    return { ok: `Success! -> DELETED ${schedule}` };
  }
}