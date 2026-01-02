"server-only";
import z from "zod";
import { clientSchema, serverSchema } from "./schemas";

const mergedSchema = z.object({
  ...clientSchema.shape,
  ...serverSchema.shape,
});

const runtimeEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID:
    process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID,
  NEXT_PUBLIC_LINE_GROUP_INVITE_URL:
    process.env.NEXT_PUBLIC_LINE_GROUP_INVITE_URL,
  LINE_LOGIN_CHANNEL_SECRET: process.env.LINE_LOGIN_CHANNEL_SECRET,
  LINE_OAUTH_STATE_SECRET: process.env.LINE_OAUTH_STATE_SECRET,
  LINE_MESSAGING_CHANNEL_SECRET: process.env.LINE_MESSAGING_CHANNEL_SECRET,
  LINE_MESSAGING_CHANNEL_ACCESS_TOKEN:
    process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN,
};

export const env = mergedSchema.parse(runtimeEnv);
