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
  const { next, error } = z
    .looseObject({
      next: z.string().optional(),
      error: z.string().optional(),
    })
    .parse(searchParams);

  return (
    <LineConnectForm
      isConnected={isConnected}
      nextPath={next}
      queryError={error}
    />
  );
}
