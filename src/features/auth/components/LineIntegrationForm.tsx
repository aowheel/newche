"use client";

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
    <button type="submit" disabled={pending}>
      {pending ? "Connecting..." : "Connect with LINE"}
    </button>
  );
};
