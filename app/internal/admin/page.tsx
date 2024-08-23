import { auth } from "@/auth";
import DeleteOverallSchedule from "@/components/DeleteOverallSchedule";
import SetOverallSchedule from "@/components/SetOverallSchedule";
import { FaUserSlash } from "react-icons/fa6";

const Page = async () => {
  const session = await auth();
  const isAdmin = process.env.ADMIN_EMAIL?.split(",")?.includes(session?.user?.email || "");

  if (!isAdmin) return (
    <div className="pt-16 flex flex-col items-center gap-y-4">
      <FaUserSlash className="text-5xl text-slate-500" />
      <span className="font-medium text-slate-500">権限がありません</span>
    </div>
  );
  return (
    <div className="px-8 py-16 flex flex-col items-center gap-y-8">
      <SetOverallSchedule />
      <DeleteOverallSchedule />
    </div>
  );
}

export default Page;
