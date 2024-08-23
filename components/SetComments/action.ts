"use server";

import prisma from "@/lib/prisma";

const handleComment = async (userId: string, scheduleId: number, comment: string) => {
  try {
    await prisma.comment.create({
      data: {
        userId: userId,
        scheduleId: scheduleId,
        comment: comment
      }
    });
  } catch(error) {
    throw error;
  }
}

export default handleComment;
