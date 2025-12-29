"use client";

import type { FC } from "react";
import { useFormStatus } from "react-dom";
import { signOut } from "../actions";

export const SignOutButton: FC = () => {
  return (
    <form action={signOut}>
      <SubmitButton />
    </form>
  );
};

const SubmitButton: FC = () => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Signing out..." : "Sign Out"}
    </button>
  );
};
