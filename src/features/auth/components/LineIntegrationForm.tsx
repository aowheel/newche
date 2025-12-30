"use client";

import { Button, Spinner } from "@heroui/react";
import type { FC } from "react";
import { useFormStatus } from "react-dom";
import { connectWithLine } from "../actions";

export const LineIntegrationForm: FC = () => {
  return (
    <form action={connectWithLine}>
      <SubmitButton />
    </form>
  );
};

const SubmitButton: FC = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isPending={pending} isDisabled={pending} fullWidth>
      {({ isPending }) => (
        <>
          {isPending ? <Spinner color="current" size="sm" /> : null}
          {isPending ? "Connecting..." : "Connect with LINE"}
        </>
      )}
    </Button>
  );
};
