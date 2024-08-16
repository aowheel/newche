import DeleteOverallSchedule from "@/components/DeleteOverallSchedule";
import SetOverallSchedule from "@/components/SetOverallSchedule";

const Page = async () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  const defaultDate = date.toISOString().split('T')[0];
  return (
    <>
      <SetOverallSchedule date={defaultDate} />
      <DeleteOverallSchedule date={defaultDate} />
    </>
  );
}

export default Page;
