"use client";

import { useEffect, useState } from "react";

export const LoadingCircle = () => {
  return (
    <svg className="animate-spin h-6 w-6 fill-none" viewBox="0 0 24 24">
      <path d="M 12,2 A 10,10 0 0,1 22,12" strokeWidth={3} className="stroke-slate-400" />
      <path d="M 22,12 A 10,10 0 0,1 12,22 A 10,10 0 0,1 2,12 A 10,10 0 0,1 12,2" strokeWidth={3} className="stroke-slate-200" />
    </svg>
  );
}

export const LoadingDots = ({ text }: { text: string }) => {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(prevCount => (prevCount+1)%4);
    }, 200);
    return () => clearInterval(interval)
  }, []);

  return (
    <span className="flex justify-center gap-x-1">
      <span>{text}</span>
      {Array(dotCount).fill(<span>.</span>).map((item, index) => (<span key={index}>{item}</span>))}
    </span>
  );
}
