"use client";

import { Alert, Button, Spinner } from "@heroui/react";
import Image from "next/image";
import type { FC } from "react";
import { useFormStatus } from "react-dom";
import { env } from "@/lib/env/client";
import { connectWithLine, disconnectFromLine } from "../actions";

type LineConnectFormProps = {
  isConnected: boolean;
  nextPath?: string;
  queryError?: string;
};

export const LineConnectForm: FC<LineConnectFormProps> = (props) => {
  const formError =
    props.queryError === "line_connect_failed"
      ? "Connect with LINE failed"
      : props.queryError === "line_disconnect_failed"
        ? "Disconnect from LINE failed"
        : "";

  return (
    <div className="space-y-4">
      {formError && (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Something went wrong</Alert.Title>
            <Alert.Description>{formError}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}
      {props.isConnected ? (
        <form action={disconnectFromLine}>
          <ActionButton
            label="Disconnect from LINE"
            pendingLabel="Disconnecting..."
          />
        </form>
      ) : (
        <form action={connectWithLine}>
          {props.nextPath && (
            <input type="hidden" name="next" value={props.nextPath} />
          )}
          <ActionButton label="Connect with LINE" pendingLabel="Connecting..." />
        </form>
      )}
      <div>
        <a
          href={env.NEXT_PUBLIC_LINE_OFFICIAL_ACCOUNT_URL}
          rel="noreferrer"
          target="_blank"
        >
          Open invite link
        </a>
      </div>
    </div>
  );
};

const LineIcon: FC = () => {
  return (
    <span className="relative block h-6 w-6">
      <Image
        alt=""
        className="absolute inset-0 h-6 w-6 opacity-100 transition-opacity group-hover:opacity-0 group-active:opacity-0"
        aria-hidden="true"
        src="/line/btn_base.png"
        width={24}
        height={24}
      />
      <Image
        alt=""
        className="absolute inset-0 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-0"
        aria-hidden="true"
        src="/line/btn_hover.png"
        width={24}
        height={24}
      />
      <Image
        alt=""
        className="absolute inset-0 h-6 w-6 opacity-0 transition-opacity group-active:opacity-100"
        aria-hidden="true"
        src="/line/btn_press.png"
        width={24}
        height={24}
      />
    </span>
  );
};

type ActionButtonProps = {
  label: string;
  pendingLabel: string;
};

const ActionButton: FC<ActionButtonProps> = ({ label, pendingLabel }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      className="group gap-2"
      type="submit"
      isPending={pending}
      isDisabled={pending}
    >
      {({ isPending: isSubmitting }) => (
        <>
          {isSubmitting ? <Spinner color="current" size="sm" /> : <LineIcon />}
          {isSubmitting ? pendingLabel : label}
        </>
      )}
    </Button>
  );
};
