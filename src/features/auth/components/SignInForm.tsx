"use client";

import {
  Alert,
  Button,
  ErrorMessage,
  Form,
  Input,
  Label,
  Spinner,
  TextField,
} from "@heroui/react";
import { type FC, useActionState } from "react";
import { type SignInState, signIn } from "../actions";

type SignInFormProps = {
  nextPath?: string;
  queryError?: string;
};

export const SignInForm: FC<SignInFormProps> = (props) => {
  const initialState: SignInState = {
    formError:
      props.queryError === "auth_failed" ? "Authentication failed" : "",
    email: {
      value: "",
    },
  };
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <div className="flex justify-center px-6 py-8">
      <Form action={formAction} className="w-full max-w-md space-y-6">
        {state.formError ? (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Something went wrong</Alert.Title>
              <Alert.Description>{state.formError}</Alert.Description>
            </Alert.Content>
          </Alert>
        ) : null}
        <input name="next" type="hidden" value={props.nextPath} />
        <TextField
          defaultValue={state.email.value}
          fullWidth
          isInvalid={!!state.email.errors?.length}
          name="email"
          type="email"
        >
          <Label className="text-sm font-medium">Email</Label>
          <Input placeholder="you@example.com" />
          {state.email.errors?.length ? (
            <div className="mt-1 space-y-1">
              {state.email.errors.map((error) => (
                <ErrorMessage key={error} className="block">
                  {error}
                </ErrorMessage>
              ))}
            </div>
          ) : null}
        </TextField>
        <Button type="submit" isPending={isPending} isDisabled={isPending}>
          {({ isPending: isSubmitting }) => (
            <>
              {isSubmitting ? <Spinner color="current" size="sm" /> : null}
              {isSubmitting ? "Sending..." : "Send OTP"}
            </>
          )}
        </Button>
      </Form>
    </div>
  );
};
