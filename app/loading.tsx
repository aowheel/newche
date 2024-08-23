import { LoadingDots } from "@/components/Common";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center text-slate-200">
        <LoadingDots text="Loading" />
      </div>
  );
}