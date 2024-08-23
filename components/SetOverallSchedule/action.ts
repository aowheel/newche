"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  type: z.string(),
  date: z.coerce.date(),
  start: z.coerce.date().optional(),
  end: z.coerce.date().optional(),
  description: z.string().optional()
});

export default async function handleOverallSchedule(prevState: { ok?: string, error?: string }, formData: FormData) {
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
    type: z.string().safeParse(formData.get("type")).data,
    date: castedDate,
    start: castedStart,
    end: castedEnd,
    description: !!formData.get("description") ? z.string().optional().safeParse(formData.get("description")).data : undefined
  };
  const validatedForm = schema.safeParse(form);
  if (!validatedForm.success) {
    return { error: "Error!" };
  } else {
    try {
      let message;
      const schedule = await prisma.schedule.findFirst({
        where: {
          date: validatedForm.data.date,
          start: validatedForm.data.start,
          end: validatedForm.data.end
        },
        select: {
          id: true
        }
      });
      if (!!schedule) {
        await prisma.schedule.update({
          data: {
            ...validatedForm.data
          },
          where: {
            id: schedule.id
          }
        });
        message = `UPDATED ${schedule.id}`;
      } else {
        const newSchedule = await prisma.schedule.create({
          data: {
            ...validatedForm.data
          },
          select: {
            id: true
          }
        });
        message = `NEW ${newSchedule.id}`;
      }
      return { ok: `Success! -> ${message}` };
    } catch (error) {
      throw error;
    }
  }
}