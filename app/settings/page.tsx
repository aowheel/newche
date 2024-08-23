import { auth } from "@/auth";
import SetUserDetails from "@/components/SetUserDetails";
import SignIn from "@/components/SignIn";
import SignOut from "@/components/SignOut";
import prisma from "@/lib/prisma";
import { FaCheck } from "react-icons/fa6";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdLogin } from "react-icons/md";

const Page = async () => {
  const session = await auth();
  if (!session) {
    return (
      <div className="pt-16 flex flex-col items-center gap-y-8">
        <MdLogin className="text-5xl text-white" />
        <div className="px-16 flex items-center justify-center gap-x-4 text-yellow-300">
          <IoInformationCircleOutline className="text-3xl" />
          <span>Googleアカウントのプロフィール画像を使用します。</span>
        </div>
        <SignIn />
      </div>
    );
  }
  const { displayName, period } = await prisma.user.findUnique({
    where: {
      id: session.user?.id
    },
    select: {
      displayName: true,
      period: true
    }
  }) || { displayName: null, period: null };
  if (!displayName) {
    return (
      <div className="pt-16 flex flex-col items-center gap-y-8">
        <MdLogin className="text-5xl text-white" />
        <SetUserDetails />
      </div>
    );
  }
  return (
    <div className="pt-16 flex flex-col items-center gap-y-8">
      <FaCheck className="text-yellow-200 text-4xl" />
      <p className="text-white">サインイン済みです。</p>
      <SetUserDetails displayName={displayName} period={period || 0} />
      <SignOut />
    </div>
  );
}

export default Page;
