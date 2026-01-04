import z from "zod";

export const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID: z.string().min(1),
  NEXT_PUBLIC_LINE_OFFICIAL_ACCOUNT_URL: z.url(),
});

export const serverSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1),
  LINE_LOGIN_CHANNEL_SECRET: z.string().min(1),
  LINE_OAUTH_STATE_SECRET: z.string().min(1),
  LINE_MESSAGING_CHANNEL_SECRET: z.string().min(1),
  LINE_MESSAGING_CHANNEL_ACCESS_TOKEN: z.string().min(1),
});
