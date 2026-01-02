import z from "zod";
import { LineConnectForm } from "@/features/auth/components/LineConnectForm";
import { createClient } from "@/lib/supabase/server";

export default async function LineConnectPage(props: {
  searchParams: Promise<Record<string, unknown>>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isConnected = !!user?.user_metadata?.line_connected;

  const searchParams = await props.searchParams;
  const { error, next } = z
    .looseObject({
      error: z.string().optional(),
      next: z.string().optional(),
    })
    .parse(searchParams);

  const nextPath =
    typeof next === "string" && next.startsWith("/dashboard")
      ? next
      : undefined;

  return (
    <LineConnectForm
      isConnected={isConnected}
      nextPath={nextPath}
      queryError={error}
    />
  );
}
