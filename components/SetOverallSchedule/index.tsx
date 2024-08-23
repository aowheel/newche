"use client";

import { useActionState } from "react";
import handleOverallSchedule from "./action";
import { inter } from "@/lib/fonts";

const SetOverallSchedule = () => {
  const initialState: {
    ok?: string, error?: string
  } = {};
  const [message, formAction, isPending] = useActionState(handleOverallSchedule, initialState);

  return (
    <form action={formAction} className={`${inter.className} flex-none w-full p-8 flex flex-col items-center gap-y-4 rounded-lg bg-slate-200 text-slate-700`}>
      <p className="text-2xl">Create or Update</p>

      <input type="date" name="date" required />

      <select name="type">
        <option>default</option>
        <option>championship</option>
        <option>event</option>
      </select>

      <div className="flex gap-x-2">
        <label htmlFor="start">Start</label>
        <input type="time" id="start" name="start" />
      </div>
      
      <div className="flex gap-x-2">
        <label htmlFor="end">End</label>
        <input type="time" id="end" name="end" />
      </div>
      
      <input type="text" name="description" className="px-1" />

      {!!message.ok && <p>{message.ok}</p>}
      {!!message.error && <p>{message.error}</p>}

      <button type="submit" className="px-2 rounded bg-slate-500 text-white disabled:bg-opacity-50" disabled={isPending}>Send</button>
    </form>
  );
}

export default SetOverallSchedule;
