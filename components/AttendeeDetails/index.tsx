"use client";

import Image from "next/image";
import { useState } from "react";

const AttendeeDetails = ({image, displayName, period}: {
  image: string;
  displayName: string;
  period: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Image
        src={image}
        alt="icon"
        width={28}
        height={28}
        className="rounded-full w-7 h-7"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      />
      <div className="relative">
        {isOpen &&
        <>
          <div className="absolute top-full left-0 translate-x-2 translate-y-1 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-slate-300"></div>
          <div className="absolute top-full left-0 px-2 translate-y-2 rounded flex flex-col bg-slate-300 font-medium text-sm text-slate-800">
            {!!period &&
            <div className="whitespace-nowrap">{period}期</div>}
            <div className="whitespace-nowrap">{displayName}</div>
          </div>
        </>}
      </div>
    </div>
    
  );
}

export default AttendeeDetails;
