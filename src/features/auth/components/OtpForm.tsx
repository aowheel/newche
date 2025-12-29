"use client";

import { type FC, useActionState } from "react";
import { type VerifyOtpState, verifyOtp } from "../actions";

type OtpFormProps = {
  next?: string;
  email?: string;
};

export const OtpForm: FC<OtpFormProps> = (props) => {
  const initialState: VerifyOtpState = {
    email: {
      value: props.email ?? "",
      editable: !props.email,
    },
    code: {
      value: "",
    },
  };
  const [state, formAction, isPending] = useActionState(
    verifyOtp,
    initialState,
  );

  return (
    <form action={formAction}>
      {state.message && <p>{state.message}</p>}
      <input name="next" type="hidden" value={props.next ?? "/"} />
      <input
        name="email"
        type="email"
        defaultValue={state.email.value}
        readOnly={!state.email.editable}
      />
      {state.email.errors?.map((e) => (
        <p key={e}>{e}</p>
      ))}
      <input
        name="code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        defaultValue={state.code.value}
      />
      {state.code.errors?.map((e) => (
        <p key={e}>{e}</p>
      ))}
      <button type="submit" disabled={isPending}>
        Verify OTP
      </button>
    </form>
  );
};
