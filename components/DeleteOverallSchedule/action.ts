"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  date: z.coerce.date(),
  start: z.coerce.date().optional(),
  end: z.coerce.date().optional()
});

export default async function deleteOverallSchedule(prevState: { ok?: string, error?: string}, formData: FormData) {
  let castedDate = z.string().date().safeParse(formData.get("date")).data;
  let castedStart = z.string().optional().safeParse(formData.get("start")).data;
  let castedEnd = z.string().optional().safeParse(formData.get("end")).data;
  if (!!castedStart) {
    castedStart = `${castedDate}T${z.string().time().optional().safeParse(`${castedStart}:00`).data}+09:00`;
  } else { castedStart = undefined }
  if (!!castedEnd) {
    castedEnd = `${castedDate}T${z.string().time().optional().safeParse(`${castedEnd}:00`).data}+09:00`;
  } else { castedEnd = undefined }
  const form = {
    date: castedDate,
    start: castedStart,
    end: castedEnd
  };
  const validatedForm = schema.safeParse(form);
  if (!validatedForm.success) return { error: "Error!" };
  const { id } = await prisma.schedule.findFirst({
    where: validatedForm.data,
    select: {
      id: true
    }
  }) || { id: null };
  if (!id) return { error: "No such data." };
  try {
    await prisma.attendance.deleteMany({
      where: {
        scheduleId: id
      }
    });
    await prisma.schedule.deleteMany({
      where: {
        id: id
      }
    });
  } catch(error) {
    throw error;
  }
  return { ok: `Success! -> DELETED ${id}` };
}