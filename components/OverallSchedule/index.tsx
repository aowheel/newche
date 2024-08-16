"use server";

import clsx from "clsx";
import { Fragment, Suspense } from "react";
import { FaLightbulb } from "react-icons/fa6";
import { MdArrowRight, MdSubdirectoryArrowRight } from "react-icons/md";
import { getAttendance, getAttendees, getSchedule, hasLacks } from "@/utils/schedule-data";
import Image from "next/image";
import SetAttendance from "../SetAttendance";
import { FaArrowCircleDown } from "react-icons/fa";

const AttendeesList = async ({ scheduleId }: { scheduleId: number }) => {
  const attendees = await getAttendees(scheduleId);

  return (
    <>
      <td>
        {attendees?.length}
      </td>

      <td className="overflow-x-auto flex gap-x-2 items-center">
      {attendees?.map((item, index) => (
        <span key={index} className="flex flex-shrink-0 gap-x-1">
          <Image
            src={item.image || ""}
            alt="icon"
            width={28}
            height={28}
            className="rounded-full w-7 h-7"
          />
          <span>{item.displayName}</span>
        </span>
      ))}
      </td>
    </>     
  );
}

const Attendance = async ({ userId, scheduleId }: { userId: string; scheduleId: number }) => {
  const { attendance } = await getAttendance(userId, scheduleId) || { attendance: "" };

  return (
    <SetAttendance userId={userId} scheduleId={scheduleId} attendance={attendance} />
  );
}

const OverallSchedule = async ({ withAttendees, userId, month, mode }: {
  withAttendees: boolean;
  userId?: string;
  month?: string;
  mode?: string;
}) => {
  const { caption, schedule } = await getSchedule(month);
  
  if (withAttendees && mode !== "edit" && !!await hasLacks(userId || "", schedule.map(item => item.id))) {
    return (
      <>
        <div className="flex items-center gap-x-4 p-4 rounded-lg bg-slate-800">
          <FaLightbulb className="text-8xl text-yellow-300" />
          <p className="text-white">全体の日程を見るには個人の日程を入力するか、入力済みの月を選択してください。</p>
        </div>
        <FaArrowCircleDown className="animate-bounce text-white text-2xl" />
      </>
    );
  }

  return (
    <div className="w-full overflow-x-auto p-2 rounded bg-white">
      <table className="w-full text-slate-700 text-lg">
        <caption className="p-2 bg-slate-50 text-xl">{caption}</caption>

        <thead>
          <tr className="text-sm">
            <th>DATE</th>
            <th>TIMESPAN</th>
            {withAttendees && mode !== "edit" &&
            <>
              <th>NUMBER</th>
              <th>ATTENDEES</th>
            </>}
            {withAttendees && mode === "edit" && <th>ATTENDANCE</th>}
            {!withAttendees && <th>DESCRIPTION</th>}
          </tr>
        </thead>

        <tbody>
          {schedule?.map((item, index) => 
          <Fragment key={index}>
            <tr className={clsx({
              "odd:bg-slate-50 even:bg-white": item.type === "default",
              "bg-yellow-50": item.type === "championship",
              "bg-teal-50": item.type === "event"
            })}>
              <th>{item.date}</th>

              <th>
              {!!item.start && !!item.end &&
              <span className="flex items-center justify-center">
                <span>{item.start}</span>
                <MdArrowRight />
                <span>{item.end}</span>
              </span>}
              </th>

              {withAttendees && mode !== "edit" &&
              <Suspense fallback={
                <>
                  <td></td>
                  <td></td>
                </>
              }>
                <AttendeesList scheduleId={item.id} />
              </Suspense>}

              {withAttendees && mode === "edit" &&
              <Suspense fallback={
                <td></td>
              }>
                <Attendance userId={userId || ""} scheduleId={item.id} />
              </Suspense>}

              {!withAttendees &&
              <td>{item.description}</td>}
            </tr>

            {withAttendees && !!item.description && 
            <tr className={clsx({
              "odd:bg-slate-50 even:bg-white": item.type === "default",
              "bg-yellow-50": item.type === "championship",
              "bg-teal-50": item.type === "event"
            })}>
              <td className="h-auto px-8 py-0" colSpan={4}>
                <span className="flex items-center gap-x-2">
                  <MdSubdirectoryArrowRight />
                  <span>{item.description}</span>
                </span>
              </td>
            </tr>}
          </Fragment>)}
        </tbody>
      </table>
    </div>
  );
}

export default OverallSchedule;
