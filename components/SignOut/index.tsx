"use server";

import { signOut } from "@/auth";
import { inter } from "@/lib/fonts";
import { MdLogout } from "react-icons/md";

const SignOut = async () => {
  return (
    <form
      action={async () => {
        "use server";
        try {
          await signOut();
        } catch(error) {
          throw error;
        }
      }}
    >
      <div className={`flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg bg-red-500 text-white ${inter.className}`}>
        <MdLogout className="text-xl" />
        <button type="submit" className="">Sign out</button>
      </div>
    </form>
  );
}

export default SignOut;