"use client";

import { Button, Spinner } from "@heroui/react";
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
    <Button type="submit" isPending={pending} isDisabled={pending}>
      {({ isPending }) => (
        <>
          {isPending ? <Spinner color="current" size="sm" /> : null}
          {isPending ? "Signing Out..." : "Sign Out"}
        </>
      )}
    </Button>
  );
};
