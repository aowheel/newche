"use client";

import { useActionState } from "react";
import deleteOverallSchedule from "./action";
import { inter } from "@/lib/fonts";

const DeleteOverallSchedule = () => {
  const initialState: {
    ok?: string, error?: string
  } = {};
  const [message, formAction, isPending] = useActionState(deleteOverallSchedule, initialState);
  return (
    <form action={formAction} className={`${inter.className} flex-none w-full p-8 flex flex-col items-center gap-y-4 rounded-lg bg-red-200 text-slate-700`}>
      <p className="text-2xl">Delete</p>

      <input type="date" name="date" required />

      <div className="flex gap-x-2">
        <label htmlFor="start">Start</label>
        <input type="time" id="start" name="start" />
      </div>

      <div className="flex gap-x-2">
        <label htmlFor="end">End</label>
        <input type="time" id="end" name="end" />
      </div>

      {!!message.ok && <p>{message.ok}</p>}
      {!!message.error && <p>{message.error}</p>}

      <button type="submit" className="px-2 rounded bg-red-500 text-white disabled:bg-opacity-50" disabled={isPending}>Delete</button>
    </form>
  );
}

export default DeleteOverallSchedule;
