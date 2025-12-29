"use client";

import { useRouter } from "next/navigation";
import { type FC, useActionState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { type SignInState, signIn } from "../actions";

type SignInFormProps = {
  next?: string;
};

export const SignInForm: FC<SignInFormProps> = (props) => {
  const initialState: SignInState = {
    email: {
      value: "",
    },
  };
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => router.refresh());
    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <form action={formAction}>
      {state.message && <p>{state.message}</p>}
      <input name="next" type="hidden" value={props.next ?? "/"} />
      <input name="email" type="email" defaultValue={state.email.value} />
      {state.email.errors?.map((e) => (
        <p key={e}>{e}</p>
      ))}
      <button type="submit" disabled={isPending}>
        Send OTP
      </button>
    </form>
  );
};
