import z from "zod";

export const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_LINE_CHANNEL_ID: z.string().min(1),
});

export const serverSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1),
  LINE_CHANNEL_SECRET: z.string().min(1),
});
