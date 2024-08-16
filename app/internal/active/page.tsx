import Loading from "@/app/loading";
import { auth } from "@/auth";
import OverallSchedule from "@/components/OverallSchedule";
import { ChangeMode, FinishEditMode } from "@/components/SetMode";
import SetMonth from "@/components/SetMonth";
import SevenDaysSchedule from "@/components/SevenDaysSchedule";
import { Suspense } from "react";
import { FaEarlybirds, FaRegCalendar, FaRegCalendarCheck } from "react-icons/fa6";
import { FiCheckCircle, FiMinusCircle, FiXCircle } from "react-icons/fi";

const Page = async ({ searchParams }: {
  searchParams?: {
    month?: string;
    mode?: string;
  };
}) => {
  const session = await auth();
  const id = session?.user?.id || "";

  const month = searchParams?.month;

  const mode = searchParams?.mode;

  return (
    <>
      <div className="w-full flex gap-x-8 snap-x snap-mandatory overflow-x-auto">
        <div className="w-full flex flex-shrink-0 flex-col items-center gap-y-4 snap-always snap-center">
          <div className="flex items-center justify-center rounded-lg bg-white">
            <FaEarlybirds className="text-slate-900 text-4xl" />
          </div>
          <Suspense fallback={<Loading />}>
            <SevenDaysSchedule userId={id} />
          </Suspense>
        </div>

        <div className="w-full flex flex-shrink-0 flex-col items-center gap-y-4 snap-always snap-center">
          {mode !== "edit" ?
          <FaRegCalendar className="text-4xl text-white" /> :
          <FaRegCalendarCheck className="text-4xl text-white" />}

          {mode === "edit" &&
          <div className="flex gap-x-6">
            <div className="flex items-center text-white"><FiCheckCircle className="mr-2 text-xl" />参加</div>
            <div className="flex items-center text-white"><FiXCircle className="mr-2 text-xl" />不参加</div>
            <div className="flex items-center text-white"><FiMinusCircle className="mr-2 text-xl" />未定</div>
          </div>}

          <Suspense fallback={<Loading />}>
            <OverallSchedule withAttendees={true} userId={id} month={month} mode={mode} />
          </Suspense>

          <ChangeMode />
        </div>
      </div>

      {mode === "edit" && <FinishEditMode />}

      <SetMonth />
    </>
  );
}

export default Page;
