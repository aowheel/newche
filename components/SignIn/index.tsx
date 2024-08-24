"use client";

import { inter } from "@/lib/fonts";
import { FcGoogle } from "react-icons/fc";
import handleSignIn from "./action";
import { useActionState } from "react";
import clsx from "clsx";
import { LoadingCircle } from "../Common";

const SignIn = () => {
  const [_, formAction, isPending] = useActionState(handleSignIn, undefined);
  return (
    <>
      <form action={formAction}>
        <button type="submit" disabled={isPending} className={clsx(`flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-200 ${inter.className}`, {
          "bg-opacity-75 text-opacity-75": isPending
        })}>
          {
            !isPending &&
            <FcGoogle className="text-xl" />
          }
          {
            isPending &&
            <LoadingCircle />
          }
          <span>Sign in with Google</span>
        </button>
      </form>
    </>
  );
}

export default SignIn;
