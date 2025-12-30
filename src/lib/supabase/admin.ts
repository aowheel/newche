import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "../env/server";
import type { Database } from "./types";

export function createAdminClient() {
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SECRET_KEY,
  );
}
