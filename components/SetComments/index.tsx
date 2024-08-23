"use client";

import { useState, useTransition } from "react";
import { FaPaperPlane } from "react-icons/fa6";
import handleComment from "./action";
import clsx from "clsx";

const SetComments = ({ userId, scheduleId }: {
  userId: string;
  scheduleId: number;
}) => {
  const [comment, setComment] = useState("");
  const [sentComment, setSentComment] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  return (
    <div className="flex-none p-2 border-t border-dashed border-slate-700 flex flex-col items-end gap-y-2">
      {!!sentComment.length &&
      sentComment.map((item, index) => (
        <div key={index} className="flex-none px-2 py-1 rounded-xl bg-teal-100 font-medium text-slate-800 break-all">{item}</div>
      ))}
      <div className="flex-none w-full flex items-center gap-x-2">
        <textarea
          className="grow resize-none px-2 rounded bg-slate-200 text-slate-800"
          placeholder="コメントを入力"
          name="comment"
          value={comment}
          rows={2}
          onChange={(event) => setComment(event.target.value)}
          required
        />
        {comment !== "" &&
        <button
          type="submit"
          className={clsx("flex-none transition-colors duration-300 text-lg", {
            "text-sky-800": isPending,
            "text-sky-400": !isPending
          })}
          onClick={() => startTransition(async () => {
            await handleComment(userId, scheduleId, comment);
            setComment("");
            setSentComment(() => {
              sentComment.push(comment);
              return sentComment;
            })
          })}
          disabled={isPending}
        >
          <FaPaperPlane />
        </button>}
      </div>
    </div>
  );
}

export default SetComments;
