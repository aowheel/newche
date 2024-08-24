"use server";

import { auth } from "@/auth";
import { getSchedule, findLacks, getAttendees, getAttendance } from "@/utils/schedule-data";
import { FaCaretRight, FaLightbulb } from "react-icons/fa6";
import AttendeeDetails from "../AttendeeDetails";
import SetAttendance from "../SetAttendance";
import clsx from "clsx";
import SetMode from "../SetMode";
import { Suspense } from "react";

const Attendees = async ({ scheduleId }: { scheduleId: number }) => {
  const attendees = await getAttendees(scheduleId);
  return (
    <div className="flex-none grid grid-cols-5 gap-4">
      {attendees?.map((item, index) => (
        <AttendeeDetails key={index} image={item.image || ""} displayName={item.displayName || ""} period={item.period || 0} />
      ))}
    </div>
  );
}

const Attendance = async ({ userId, scheduleId }: { userId: string; scheduleId: number }) => {
  const { attendance } = await getAttendance(userId, scheduleId) || { attendance: "" };

  return (
    <SetAttendance userId={userId} scheduleId={scheduleId} attendance={attendance} />
  );
}

const OverallSchedule = async ({ month, mode }: {
  month?: string;
  mode?: string 
}) => {
  const session = await auth();
  const userId = session?.user?.id || "";
  const { caption, schedule } = await getSchedule(month);
  const hasLacks = await findLacks(userId, schedule.map(item => item.id));

  if (hasLacks && mode !== "edit") {
    return (
      <div className="pt-8 flex flex-col items-center">
        <div className="flex items-center gap-x-4 m-8 p-4 rounded-lg bg-slate-800">
          <FaLightbulb className="text-5xl text-yellow-300" />
          <span className="text-white">全体の日程を見るには個人の日程を入力するか、入力済みの月を選択してください。</span>
        </div>
        <SetMode />
      </div>
    );
  }
  
  return (
    <>
      <div className="pointer-events-none fixed bottom-0 left-0 w-full h-1/5 bg-gradient-to-t from-slate-900"></div>

      <div className="h-full overflow-y-auto snap-y snap-mandatory scroll-py-16 flex flex-col items-center gap-y-8 text-slate-200">
        <div className="flex-none h-8"></div>
        <div className="flex-none snap-start w-full flex items-center justify-around">
          <div className="text-3xl">{caption}</div>
          <SetMode />
        </div>
        {schedule?.map((item, index) => (
          <div key={index} className={clsx("flex-none snap-start w-96 flex flex-col gap-y-4 p-8 rounded-2xl bg-slate-600", {
            "bg-yellow-600": item.type === "championship",
            "bg-teal-600": item.type === "event"
          })}>
            <div className="flex-none flex items-center">
              <div className="grow flex flex-col gap-y-2">
                <div>{item.date}</div>
                {(!!item.start || !!item.end) &&
                <div className="flex items-center">
                  <span>{item.start}</span>
                  <FaCaretRight />
                  <span>{item.end}</span>
                </div>}
              </div>
              {mode === "edit" ?
              <Suspense fallback={
                <div className="w-[124px] h-[36px] rounded bg-slate-600/50 animate-pulse"></div>
              }>
                <Attendance userId={userId} scheduleId={item.id} />
              </Suspense> :
              <Suspense fallback={
                <div className="w-[204px] h-[72px] rounded bg-slate-600/50 animate-pulse"></div>
              }>
                <Attendees scheduleId={item.id} />
              </Suspense>}
            </div>
            {!!item.description && <div className="text-sm">{item.description}</div>}
          </div>
        ))}
        <div className="flex-none h-full"></div>
      </div>
    </>
  );
}

export default OverallSchedule;
