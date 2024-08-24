"use client";

import { orbitron } from "@/lib/fonts";
import Image from "next/image";
import { ReactNode, useEffect, useRef, useState, useTransition } from "react";
import { Fa1, Fa2, Fa3, FaArrowRight, FaCaretDown, FaCaretLeft, FaClockRotateLeft, FaRegCalendarCheck, FaRegCompass } from "react-icons/fa6";
import { checkCookies, setCookies } from "./action";
import clsx from "clsx";

const ModalDialog = ({ show, children }: {
  show: boolean;
  children: ReactNode
}) => {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!show) return;
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
    }
  }, [show]);

  return <dialog ref={ref} className="rounded-2xl bg-gradient-to-br from-teal-500 to-sky-500">{children}</dialog>
}

const Tutorial = () => {
  const [checked, setChecked] = useState(true);
  const [show, setShow] = useState(false);
  const [number, setNumber] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    checkCookies().then(value => setChecked(value));
  }, []);

  if (checked) return null;

  return (
    <>
      {!show &&
      <button
        type="button"
        onClick={() => setShow(true)}
        className={`fixed bottom-4 left-4 animate-pulse px-4 py-2 rounded-3xl bg-gradient-to-br from-teal-500 to-sky-500 font-medium text-2xl text-white ${orbitron.className}`}>
        New !
      </button>}
      <ModalDialog show={show}>
        {number === 1 &&
        <div className="p-8 flex flex-col items-center gap-y-4 text-white">
          <Fa1 className="text-3xl" />
          <span className="w-full align-middle">
            ページ左上
            <FaRegCompass className="inline mx-1 text-xl" />
            から各ページに遷移することができます。
          </span>
          <span className="w-full align-middle">
            <FaCaretDown className="inline mr-1 text-xl" />
            を押下で他のページを選ぶことができます。
          </span>
          <span className="w-full">
            チュートリアル中はボタンが押せません。次に進んでください。
          </span>
          <button type="button" onClick={() => setNumber(2)} className="px-2 py-1 rounded-2xl bg-gradient-to-br from-yellow-500 to-red-500 flex gap-x-2 items-center">
            <span className={`${orbitron.className} font-medium`}>Next</span>
            <FaArrowRight />
          </button>
        </div>}
        {number === 2 &&
        <div className="p-8 flex flex-col items-center gap-y-4 text-white">
          <Fa2 className="text-3xl" />
          <span className="w-full align-middle">
            <FaRegCalendarCheck className="inline mr-1 text-2xl" />
            のページでは参加可否の選択ができます。
          </span>
          <span className="w-full align-middle">
            ページ右上
            <input type="month" id="input-example" className="mx-1 rounded bg-slate-200 text-slate-800" disabled />
            を押下で月を選んでスケジュールを絞り込めます。未選択の場合は未来の予定がすべて表示されます。
          </span>
          <div className="w-full flex items-center gap-x-4">
            <span className="flex-none">
              <Image
                src="/icons/icon-example.png"
                alt="icon"
                width={28}
                height={28}
                className="rounded-full w-7 h-7 bg-slate-200"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
              />
              <div className="relative">
                {isOpen &&
                <>
                  <div className="absolute top-full left-0 translate-x-2 translate-y-1 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-slate-300"></div>
                  <div className="absolute top-full left-0 px-2 translate-y-2 rounded flex flex-col bg-slate-300 font-medium text-sm text-slate-800">
                    <div className="whitespace-nowrap">x期</div>
                    <div className="whitespace-nowrap">Alien</div>
                  </div>
                </>}
              </div>
            </span>
            <FaCaretLeft />
            <span className="grow">
              アイコンをタップで期と名前を確認できます。
            </span>
          </div>
          <span className="w-full align-middle">
            選んだ月のすべての欄にチェックを付けることで参加者を見ることができます。
          </span>
          <button type="button" onClick={() => setNumber(3)} className="px-2 py-1 rounded-2xl bg-gradient-to-br from-yellow-500 to-red-500 flex gap-x-2 items-center">
            <span className={`${orbitron.className} font-medium`}>Next</span>
            <FaArrowRight />
          </button>
        </div>}
        {number === 3 &&
        <div className="p-8 flex flex-col items-center gap-y-4 text-white">
          <Fa3 className="text-3xl" />
          <span className="w-full align-middle">
            <FaClockRotateLeft className="inline mr-1 text-2xl" />
            のページでは直近7日のスケジュールが表示されます。
          </span>
          <span className="w-full align-middle">
            各日にコメントをすることができます。
          </span>
          <button
            type="button"
            onClick={() => startTransition(async () => {
              await setCookies();
              setShow(false);
              setNumber(1);
            })}
            className={clsx("px-2 py-1 rounded-2xl bg-gradient-to-br from-yellow-500 to-red-500", {"opacity-75": isPending})}
            disabled={isPending}
          >
            <span className={`${orbitron.className} font-medium`}>Complete</span>
          </button>
        </div>}
      </ModalDialog>
    </>
  );
}

export default Tutorial;
