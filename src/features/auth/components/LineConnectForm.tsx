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
  const errorMessage =
    props.queryError === "line_connect_failed"
      ? "Connect with LINE failed"
      : props.queryError === "line_disconnect_failed"
        ? "Disconnect from LINE failed"
        : "";
  const inviteUrl = env.NEXT_PUBLIC_LINE_GROUP_INVITE_URL;

  return (
    <div className="space-y-4">
      {props.queryError ? (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Something went wrong</Alert.Title>
            <Alert.Description>{errorMessage}</Alert.Description>
          </Alert.Content>
        </Alert>
      ) : null}
      {props.isConnected ? (
        <form action={disconnectFromLine}>
          <SubmitButton mode="disconnect" />
        </form>
      ) : (
        <form action={connectWithLine}>
          {props.nextPath ? (
            <input type="hidden" name="next" value={props.nextPath} />
          ) : null}
          <SubmitButton mode="connect" />
        </form>
      )}
      <div className="rounded-md border border-default-200 p-4 text-sm text-default-600">
        <p className="text-sm font-medium text-default-900">
          Add the LINE Official Account to your group
        </p>
        <p className="mt-1">
          Open the invite link and add the bot to the group where you want to
          use this app.
        </p>
        <a
          className="mt-3 inline-flex items-center justify-center rounded-md border border-default-200 px-3 py-2 text-sm font-medium text-default-900 transition hover:bg-default-100"
          href={inviteUrl}
          rel="noreferrer"
          target="_blank"
        >
          Open invite link
        </a>
      </div>
    </div>
  );
};

type SubmitButtonProps = {
  mode: "connect" | "disconnect";
};

const SubmitButton: FC<SubmitButtonProps> = ({ mode }) => {
  const { pending } = useFormStatus();
  const label =
    mode === "connect" ? "Connect with LINE" : "Disconnect from LINE";
  const pendingLabel =
    mode === "connect" ? "Connecting..." : "Disconnecting...";

  return (
    <Button
      className="group gap-2"
      type="submit"
      isPending={pending}
      isDisabled={pending}
    >
      {({ isPending }) => (
        <>
          {isPending ? <Spinner color="current" size="sm" /> : <LineIcon />}
          {isPending ? pendingLabel : label}
        </>
      )}
    </Button>
  );
};

const LineIcon: FC = () => {
  return (
    <span className="relative block h-6 w-6">
      <Image
        alt=""
        className="absolute inset-0 h-6 w-6 opacity-100 transition-opacity group-hover:opacity-0 group-active:opacity-0"
        aria-hidden="true"
        height={24}
        src="/line/btn_base.png"
        width={24}
      />
      <Image
        alt=""
        className="absolute inset-0 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-0"
        aria-hidden="true"
        height={24}
        src="/line/btn_hover.png"
        width={24}
      />
      <Image
        alt=""
        className="absolute inset-0 h-6 w-6 opacity-0 transition-opacity group-active:opacity-100"
        aria-hidden="true"
        height={24}
        src="/line/btn_press.png"
        width={24}
      />
    </span>
  );
};
