import { clientSchema } from "./schemas";

const runtimeEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID:
    process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID,
  NEXT_PUBLIC_LINE_GROUP_INVITE_URL:
    process.env.NEXT_PUBLIC_LINE_GROUP_INVITE_URL,
};

export const env = clientSchema.parse(runtimeEnv);
