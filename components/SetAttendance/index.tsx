"use client";

import { useState, useTransition } from "react";
import clsx from "clsx";
import { FiCheckCircle, FiMinusCircle, FiXCircle } from "react-icons/fi";
import handleAttendance from "./action";

const SetAttendance = ({ userId, scheduleId, attendance }: { userId: string; scheduleId: number; attendance: string }) => {
  const [attendanceState, setAttendanceState] = useState(attendance);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <div className={clsx("flex-none flex justify-center gap-x-2 text-4xl")}>
        <input
          type="radio"
          id={`yes-${scheduleId}`}
          name={`${scheduleId}`}
          checked={attendanceState === "yes"} 
          onChange={() => {
            setAttendanceState("yes");
            startTransition(() => {handleAttendance(userId, scheduleId, "yes")});
          }}
          className="hidden"
          disabled={isPending}
        />
        <label
          htmlFor={`yes-${scheduleId}`}
          className={clsx("transition-colors duration-300", {
            "text-slate-200": attendanceState === "yes",
            "text-slate-500/75": attendanceState !== "yes",
            "text-teal-200": attendanceState === "yes" && isPending
          })}
        >
          <FiCheckCircle />
        </label>

        <input
          type="radio"
          id={`no-${scheduleId}`}
          name={`${scheduleId}`}
          checked={attendanceState === "no"}
          onChange={() => {
            setAttendanceState("no");
            startTransition(() => {handleAttendance(userId, scheduleId, "no")});
          }}
          className="hidden"
          disabled={isPending}
        />
        <label
          htmlFor={`no-${scheduleId}`}
          className={clsx("transition-colors duration-300", {
            "text-slate-200": attendanceState === "no",
            "text-slate-500/75": attendanceState !== "no",
            "text-teal-200": attendanceState === "no" && isPending
          })}
        >
          <FiXCircle />
        </label>

        <input
          type="radio"
          id={`undecided-${scheduleId}`}
          name={`${scheduleId}`}
          checked={attendanceState === "undecided"}
          onChange={() => {
            setAttendanceState("undecided");
            startTransition(() => {handleAttendance(userId, scheduleId, "undecided")});
          }}
          className="hidden"
          disabled={isPending} />
        <label
          htmlFor={`undecided-${scheduleId}`}
          className={clsx("transition-colors duration-300", {
            "text-slate-200": attendanceState === "undecided",
            "text-slate-500/75": attendanceState !== "undecided",
            "text-teal-200": attendanceState === "undecided" && isPending
          })}
        >
          <FiMinusCircle />
        </label>
      </div>
    </>
  );
}

export default SetAttendance;
