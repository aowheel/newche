import Loading from "@/app/loading";
import OverallSchedule from "@/components/OverallSchedule";
import SetMonth from "@/components/SetMonth";
import { Suspense } from "react";

const Page = async ({
  searchParams,
}: {
  searchParams?: {
    month?: string;
  };
}) => {
  const month = searchParams?.month;
  const monthKey = month || "";

  return (
    <>
      <Suspense key={monthKey} fallback={<Loading />}>
        <OverallSchedule withAttendees={false} month={month} />
      </Suspense>
      <SetMonth />
    </>
  );
}

export default Page;
