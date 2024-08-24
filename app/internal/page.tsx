import { LoadingDots } from "@/components/Common";
import OverallSchedule from "@/components/OverallSchedule";
import Tutorial from "@/components/Tutorial";
import { Suspense } from "react";
const Page = async ({ searchParams }: {
  searchParams?: {
    month?: string;
    mode?: string;
  };
}) => {
  const month = searchParams?.month;
  const mode = searchParams?.mode;

  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center text-slate-200">
        <LoadingDots text="Loading overall schedule" />
      </div>
    }>
      <OverallSchedule month={month} mode={mode} />
      <Tutorial />
    </Suspense>
  );
}

export default Page;
