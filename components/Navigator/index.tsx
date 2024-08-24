"use client";

import clsx from "clsx";
import Link from "next/link";
import { Suspense, useState } from "react";
import { FaCaretDown, FaCaretUp, FaClockRotateLeft, FaRegCalendarCheck, FaRegCircleUser, FaRegCompass, FaXmark } from "react-icons/fa6";
import SetMonth from "../SetMonth";

const Navigator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [othersIsOpen, setOthersIsOpen] = useState(false);
  return (
    <>
      <div className={clsx({
        "fixed top-0 left-0 w-full p-2 flex items-center justify-between shadow-md shadow-slate-900/75 bg-slate-900/75 backdrop-blur-sm": !isOpen
      })}>
        <button type="button" onClick={() => setIsOpen(!isOpen)} className={clsx("text-slate-200", {
          "fixed inset-0 bg-slate-950/75 backdrop-blur-sm": isOpen
        })}>
          {isOpen ?
          <div className="flex items-center justify-center text-4xl"><FaXmark /></div> :
          <div className="text-3xl"><FaRegCompass /></div>}
        </button>
        {!isOpen &&
        <Suspense fallback={
          <div></div>
        }>
          <SetMonth />
        </Suspense>}
      </div>
      
      <nav className={clsx("fixed left-0 bottom-0 w-full transition-transform delay-150 duration-300 ease-in-out rounded-t-3xl border-slate-200 bg-slate-800", {
        "translate-y-full": !isOpen
      })}>
        <div className="p-4 grid grid-cols-3 justify-items-center text-slate-200">
          <div className="p-2 rounded-xl transition ease-in-out bg-slate-900 hover:-translate-y-1 hover:shadow-md hover:shadow-slate-900 text-4xl">
            <Link href="/internal" replace scroll={false}><FaRegCalendarCheck /></Link>
          </div>
          <div className="p-2 rounded-xl transition ease-in-out bg-slate-900 hover:-translate-y-1 hover:shadow-md hover:shadow-slate-900 text-4xl">
            <Link href="/internal/upcoming" replace scroll={false}><FaClockRotateLeft /></Link>
          </div>
          <div className="p-2 rounded-xl transition ease-in-out bg-slate-900 hover:-translate-y-1 hover:shadow-md hover:shadow-slate-900 text-4xl">
            <Link href="/internal/users" replace scroll={false}><FaRegCircleUser /></Link>
          </div>
          <div className="p-2 col-span-3 justify-self-stretch flex flex-col">
            {othersIsOpen &&
            <ul className="divide-y divide-dashed divide-slate-700 text-slate-400 tex-sm">
              <li className="p-1 flex transition-colors duration-300 ease-in-out hover:text-teal-100"><Link className="w-full" href="/" replace>ホーム</Link></li>
              <li className="p-1 flex transition-colors duration-300 ease-in-out hover:text-teal-100"><Link className="w-full" href="/settings" replace>設定</Link></li>
              <li className="p-1 flex transition-colors duration-300 ease-in-out hover:text-teal-100"><Link className="w-full" href="/privacy" replace>プライバシーポリシー</Link></li>
              <li className="p-1 flex transition-colors duration-300 ease-in-out hover:text-teal-100"><Link className="w-full" href="/terms" replace>利用規約</Link></li>
              <li className="p-1 flex transition-colors duration-300 ease-in-out hover:text-teal-100"><Link className="w-full" href="/internal/admin" replace>管理</Link></li>
            </ul>}
            <button type="button" className="flex justify-center text-xl" onClick={() => setOthersIsOpen(!othersIsOpen)}>
              {othersIsOpen ? <FaCaretUp /> : <FaCaretDown />}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navigator;
