import { clientSchema } from "./schemas";

const runtimeEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_LINE_CHANNEL_ID: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID,
};

export const env = clientSchema.parse(runtimeEnv);
