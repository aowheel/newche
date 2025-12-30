"use client";

import {
  Button,
  FieldError,
  Input,
  Label,
  Spinner,
  TextField,
} from "@heroui/react";
import { type FC, useActionState } from "react";
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

  return (
    <form action={formAction}>
      {state.message && <p className="text-sm text-danger">{state.message}</p>}
      <input name="next" type="hidden" value={props.next ?? "/"} />
      <TextField
        defaultValue={state.email.value}
        fullWidth
        isInvalid={!!state.email.errors?.length}
        name="email"
        type="email"
      >
        <Label>Email</Label>
        <Input placeholder="you@example.com" />
        {state.email.errors?.map((error) => (
          <FieldError key={error}>{error}</FieldError>
        ))}
      </TextField>
      <Button
        type="submit"
        isPending={isPending}
        isDisabled={isPending}
        fullWidth
      >
        {({ isPending: isSubmitting }) => (
          <>
            {isSubmitting ? <Spinner color="current" size="sm" /> : null}
            {isSubmitting ? "Sending..." : "Send OTP"}
          </>
        )}
      </Button>
    </form>
  );
};
