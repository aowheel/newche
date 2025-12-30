"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardErrorPage(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(props.error);
  }, [props.error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-xl font-semibold">Dashboard error</h1>
        <p className="text-sm text-default-500">
          Something went wrong while loading your dashboard. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="primary" onPress={props.reset}>
            Retry
          </Button>
          <Button
            variant="secondary"
            onPress={() => router.replace("/dashboard")}
          >
            Back to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
