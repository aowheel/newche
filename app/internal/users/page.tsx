import { FaHammer } from "react-icons/fa6";

const Page = () => {
  return (
    <div className="pt-16 flex flex-col items-center gap-y-4">
      <FaHammer className="text-5xl text-slate-500" />
      <span className="font-medium text-slate-500">作成中です</span>
    </div>
  );
}

export default Page;
