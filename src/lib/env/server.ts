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
  NEXT_PUBLIC_LINE_CHANNEL_ID: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID,
  LINE_CHANNEL_SECRET: process.env.LINE_CHANNEL_SECRET,
};

export const env = mergedSchema.parse(runtimeEnv);
