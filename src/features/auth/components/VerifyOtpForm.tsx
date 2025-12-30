"use client";

import {
  Button,
  FieldError,
  Input,
  InputOTP,
  Label,
  Spinner,
  TextField,
} from "@heroui/react";
import { type FC, useActionState } from "react";
import { type VerifyOtpState, verifyOtp } from "../actions";

type VerifyOtpFormProps = {
  next?: string;
  email?: string;
};

export const VerifyOtpForm: FC<VerifyOtpFormProps> = (props) => {
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
      {state.message && <p className="text-sm text-danger">{state.message}</p>}
      <input name="next" type="hidden" value={props.next ?? "/"} />
      <TextField
        defaultValue={state.email.value}
        fullWidth
        isInvalid={!!state.email.errors?.length}
        isReadOnly={!state.email.editable}
        name="email"
        type="email"
      >
        <Label>Email</Label>
        <Input placeholder="you@example.com" />
        {state.email.errors?.map((error) => (
          <FieldError key={error}>{error}</FieldError>
        ))}
      </TextField>
      <div className="flex flex-col gap-2">
        <Label>Verification code</Label>
        <InputOTP
          autoFocus
          isDisabled={isPending}
          isInvalid={!!state.code.errors?.length}
          maxLength={6}
          name="code"
        >
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
          </InputOTP.Group>
          <InputOTP.Separator />
          <InputOTP.Group>
            <InputOTP.Slot index={3} />
            <InputOTP.Slot index={4} />
            <InputOTP.Slot index={5} />
          </InputOTP.Group>
        </InputOTP>
        {state.code.errors?.map((error) => (
          <p className="text-sm text-danger" key={error}>
            {error}
          </p>
        ))}
      </div>
      <Button
        type="submit"
        isPending={isPending}
        isDisabled={isPending}
        fullWidth
      >
        {({ isPending: isSubmitting }) => (
          <>
            {isSubmitting ? <Spinner color="current" size="sm" /> : null}
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </>
        )}
      </Button>
    </form>
  );
};
