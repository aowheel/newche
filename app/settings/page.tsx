import { auth } from "@/auth";
import SetUserDetails from "@/components/SetUserDetails";
import SignIn from "@/components/SignIn";
import SignOut from "@/components/SignOut";
import { FaCheck } from "react-icons/fa6";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdLogin } from "react-icons/md";

const Page = async () => {
  const session = await auth();
  if (!session) {
    return (
      <>
        <MdLogin className="text-5xl text-white" />
        <div className="p-4 flex items-center justify-center gap-x-4 text-yellow-300">
          <IoInformationCircleOutline className="text-3xl" />
          <span>Googleアカウントのプロフィール画像を使用します。</span>
        </div>
        <SignIn />
      </>
    );
  }
  if (!session.user.displayName) {
    return (
      <>
        <MdLogin className="text-5xl text-white" />
        <SetUserDetails />
      </>
    );
  }
  return (
    <>
      <FaCheck className="text-yellow-200 text-4xl" />
      <p className="text-white">サインイン済みです。</p>
      <SetUserDetails displayName={session.user.displayName} period={session.user.period || 0} />
      <SignOut />
    </>
  );
}

export default Page;
