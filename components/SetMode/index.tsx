"use client";

import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

const SetMode = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const isEditMode = params.get("mode") === "edit";
  const { push } = useRouter();

  const handleSearch = () => {
    if (isEditMode) {
      params.delete("mode");
    } else {
      params.set("mode", "edit");
    }
    push(`/internal?${params.toString()}`, { scroll: false });
  }

  return (
    <button
      type="button"
      onClick={handleSearch}
      className={clsx("rounded px-2 outline outline-offset-2 outline-2 bg-slate-200 font-medium text-lg text-slate-800", {
        "outline-white": !isEditMode,
        "outline-teal-300": isEditMode
      })}
    >
      {isEditMode ? <span>終了</span> : <span>入力</span>}
    </button>
  );
}

export default SetMode;
