"use server";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import z from "zod";
import { env } from "@/lib/env/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type SignInState = {
  formError: string;
  email: {
    value: string;
    errors?: string[];
  };
};

export const signIn = async (
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> => {
  const next = z
    .string()
    .refine((path) => path.startsWith("/dashboard"))
    .catch("/dashboard")
    .parse(formData.get("next"));
  const searchParams = new URLSearchParams();
  searchParams.set("next", next);

  const { data: email, error: emailError } = z
    .email({ error: "Valid email is required" })
    .safeParse(formData.get("email"));
  if (emailError) {
    return {
      formError: "Validation failed",
      email: {
        value: "",
        errors: emailError.issues.map((i) => i.message),
      },
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next);

  const { error: signInError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/email/callback?${searchParams}`,
    },
  });
  if (signInError) {
    console.error(signInError.message);
    return {
      formError: "Sending OTP failed",
      email: {
        value: "",
      },
    };
  }

  searchParams.set("email", email);
  redirect(`/login/verify?${searchParams}`, RedirectType.replace);
};

export type VerifyOtpState = {
  formError: string;
  first?: boolean;
  email: {
    value: string;
    editable: boolean;
    errors?: string[];
  };
  code: {
    value: string;
    errors?: string[];
  };
};

export const verifyOtp = async (
  prevState: VerifyOtpState,
  formData: FormData,
): Promise<VerifyOtpState> => {
  const next = z
    .string()
    .refine((path) => path.startsWith("/dashboard"))
    .catch("/dashboard")
    .parse(formData.get("next"));

  const { data: email, error: emailError } = z
    .email({ message: "Valid email is required" })
    .safeParse(formData.get("email"));
  if (emailError) {
    return {
      formError: "Validation failed",
      email: {
        value: "",
        editable: true,
        errors: emailError.issues.map((i) => i.message),
      },
      code: {
        value: prevState.code.value,
      },
    };
  }

  const { data: code, error: codeError } = z
    .string()
    .regex(/^\d+$/, { error: "OTP must be numeric" })
    .min(6, { error: "OTP must be at least 6 characters" })
    .max(6, { error: "OTP must be at most 6 characters" })
    .safeParse(formData.get("code"));
  if (codeError) {
    return {
      formError: "Validation failed",
      email: {
        value: email,
        editable: false,
      },
      code: {
        value: "",
        errors: codeError.issues.map((i) => i.message),
      },
    };
  }

  const supabase = await createClient();
  const { error: verifyOtpError } = await supabase.auth.verifyOtp({
    type: "email",
    email,
    token: code,
  });
  if (verifyOtpError) {
    console.error(verifyOtpError.message);
    return {
      formError: "OTP verification failed",
      email: {
        value: email,
        editable: true,
      },
      code: {
        value: "",
      },
    };
  }

  redirect(next, RedirectType.replace);
};

export const signOut = async () => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (user) await supabase.auth.signOut();
  redirect("/");
};

export const connectWithLine = async (formData: FormData) => {
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  };
  cookieStore.set("line_oauth_code_verifier", codeVerifier, cookieOptions);

  const next = formData.get("next");
  const safeNext = z
    .string()
    .refine((path) => path.startsWith("/dashboard/line"))
    .catch("/dashboard/line")
    .parse(next);
  const statePayloadBase64 = Buffer.from(safeNext).toString("base64url");
  const stateSignature = crypto
    .createHmac("sha256", env.LINE_OAUTH_STATE_SECRET)
    .update(statePayloadBase64)
    .digest("base64url");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID,
    redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/auth/line/callback`,
    state: `${statePayloadBase64}.${stateSignature}`,
    scope: "profile openid",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  redirect(`https://access.line.me/oauth2/v2.1/authorize?${params}`);
};

export const disconnectFromLine = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const supabaseAdmin = createAdminClient();

  const { error: deleteTokenError } = await supabaseAdmin
    .from("line_accounts")
    .delete()
    .eq("profile_id", user.id);
  if (deleteTokenError) {
    console.error(deleteTokenError.message);
    redirect("/connect?error=line_disconnect_failed");
  }

  const { error: updateUserError } =
    await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        line_connected: false,
      },
    });
  if (updateUserError) {
    console.error(updateUserError.message);
    redirect("/connect?error=line_disconnect_failed");
  }

  redirect("/dashboard");
};
