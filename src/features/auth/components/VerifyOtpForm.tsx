"use client";

import {
  Alert,
  Button,
  ErrorMessage,
  Form,
  Input,
  InputOTP,
  Label,
  Spinner,
  TextField,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { type FC, useActionState } from "react";
import { type VerifyOtpState, verifyOtp } from "../actions";

type VerifyOtpFormProps = {
  nextPath: string;
  email: string;
};

export const VerifyOtpForm: FC<VerifyOtpFormProps> = (props) => {
  const router = useRouter();

  const initialState: VerifyOtpState = {
    formError: "",
    email: {
      value: props.email,
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
    <div className="flex justify-center px-6 py-8">
      <Form action={formAction} className="w-full max-w-md space-y-6">
        {state.formError && (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Something went wrong</Alert.Title>
              <Alert.Description>{state.formError}</Alert.Description>
            </Alert.Content>
          </Alert>
        )}
        <input name="next" type="hidden" value={props.nextPath} />
        <TextField
          defaultValue={state.email.value}
          fullWidth
          isInvalid={!!state.email.errors?.length}
          isReadOnly={!state.email.editable}
          name="email"
          type="email"
        >
          <Label className="text-sm font-medium">Email</Label>
          <Input placeholder="you@example.com" />
          {state.email.errors?.length && (
            <div className="mt-1 space-y-1">
              {state.email.errors.map((error) => (
                <ErrorMessage key={error} className="block">
                  {error}
                </ErrorMessage>
              ))}
            </div>
          )}
        </TextField>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Verification code</Label>
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
          {state.code.errors?.length ? (
            <div className="mt-1 space-y-1">
              {state.code.errors.map((error) => (
                <ErrorMessage key={error} className="block">
                  {error}
                </ErrorMessage>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" isPending={isPending} isDisabled={isPending}>
            {({ isPending: isSubmitting }) => (
              <>
                {isSubmitting ? <Spinner color="current" size="sm" /> : null}
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onPress={() => router.replace(props.nextPath)}
            isDisabled={isPending}
          >
            Retry
          </Button>
        </div>
      </Form>
    </div>
  );
};
