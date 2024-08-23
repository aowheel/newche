import { LoadingDots } from "@/components/Common";
import SevenDaysSchedule from "@/components/SevenDaysSchedule";
import { Suspense } from "react";

const Page = async () => {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center text-slate-200">
        <LoadingDots text="Loading upcoming schedule" />
      </div>
    }>
      <SevenDaysSchedule />
    </Suspense>
  );
}

export default Page;
