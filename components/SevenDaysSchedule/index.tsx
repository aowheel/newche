"use server";

import { auth } from "@/auth";
import { getAttendees, getSevenDaysSchedule, findLacks, getComments } from "@/utils/schedule-data";
import Image from "next/image";
import { Suspense } from "react";
import { FaCaretRight, FaLightbulb } from "react-icons/fa6";
import SetMode from "../SetMode";
import prisma from "@/lib/prisma";
import SetComments from "../SetComments";
import { LoadingDots } from "../Common";
import clsx from "clsx";

const Attendees = async ({ scheduleId }: { scheduleId: number }) => {
  const attendees = await getAttendees(scheduleId);

  let initialValue: {
    period: number | null,
    others: {
      displayName: string | null,
      image: string | null
    }[]
  }[] = [];

  const attendeesGroup = attendees?.reduce((accumulator, { period, displayName, image }) => {
    const lastEntry = accumulator[accumulator.length - 1];
    if (!!lastEntry && lastEntry.period === period) {
      lastEntry.others.push({displayName, image});
    } else {
      accumulator.push({ period, others: [{displayName, image}] });
    }
    return accumulator;
  }, initialValue);

  return (
    <div className="flex flex-col gap-y-4">
      {attendeesGroup?.map((item, index) => (
        <div key={index} className="flex-none flex gap-x-4 items-center">
          {!!item.period &&
          <span className="flex-none">{item.period}期</span>}
          <div className="flex flex-wrap gap-2">
            {item.others?.map((item, index) => (
              <div key={index} className="flex-none flex gap-x-1">
                <Image
                  src={item.image || ""}
                  alt="icon"
                  width={28}
                  height={28}
                  className="rounded-full w-7 h-7"
                />
                <span>{item.displayName}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const Comments = async ({ scheduleId }: { scheduleId: number }) => {
  const comments = await getComments(scheduleId);

  if (!comments.length) return null;

  return (
    <div className="flex-none flex flex-col gap-y-2">
      {comments.map(async (item, index) => {
        const user = await prisma.user.findUnique({
          where: {
            id: item.userId
          },
          select: {
            displayName: true,
            image: true
          }
        }) || { displayName: null, image: null };
        return (
          <div key={index} className="flex-none flex items-center gap-x-2">
            <div className="flex-none flex flex-col items-center gap-y-1">
              <Image
                src={user.image || ""}
                alt="icon"
                width={28}
                height={28}
                className="rounded-full w-7 h-7"
              />
              <span className="text-xs">{user.displayName || ""}</span>
            </div>
            <span className="fle-none px-2 py-1 rounded-xl bg-slate-700 break-all">{item.comment}</span>
          </div>
        );
      })}
    </div>
  );
}

const SevenDaysSchedule = async () => {
  const session = await auth();
  const userId = session?.user?.id || "";
  const schedule = await getSevenDaysSchedule();
  const hasLacks = await findLacks(userId, schedule.map(item => item.id));

  if (hasLacks) {
    return (
      <div className="pt-8 flex flex-col items-center">
        <div className="flex items-center gap-x-4 m-8 p-4 rounded-lg bg-slate-800">
          <FaLightbulb className="text-5xl text-yellow-300" />
          <span className="text-white">直近の日程を見るには個人の日程を入力してください。</span>
        </div>
        <SetMode />
      </div>
    );
  }

  return (
    <div className="py-16 flex flex-col gap-y-8">
      {schedule?.map((item, index) => (
        <div key={index} className={clsx("flex-none mx-4 p-4 border-2 flex flex-col gap-y-4 text-slate-200", {
          "border-slate-200": item.type === "default",
          "border-teal-200": item.type === "event",
          "border-yellow-200": item.type === "chsmpionship"
        })}>
          <div className="flex-none flex items-center text-xl">
            <span className="mr-4">{item.date}</span>
            <span>{item.start}</span>
            <FaCaretRight />
            <span>{item.end}</span>
          </div>
          {!!item.description &&
          <span>{item.description}</span>}
          <Suspense fallback={
            <div className="flex-none h-[160px] bg-slate-700/50 animate-pulse"></div>
          }>
            <Attendees scheduleId={item.id} />
          </Suspense>
          <Suspense fallback={
            <div className="text-slate-700">
              <LoadingDots text="Loading comments" />
            </div>
          }>
            <Comments scheduleId={item.id} />
          </Suspense>
          <SetComments userId={userId} scheduleId={item.id} />
        </div>
      ))}
    </div>
  );
}

export default SevenDaysSchedule;
