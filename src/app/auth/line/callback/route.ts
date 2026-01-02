import crypto from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { env } from "@/lib/env/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state");
  let next: string | undefined;
  if (state) {
    const [payloadBase64, signature] = state.split(".");
    if (payloadBase64 && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", env.LINE_OAUTH_STATE_SECRET)
        .update(payloadBase64)
        .digest("base64url");
      if (
        signature.length === expectedSignature.length &&
        crypto.timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(expectedSignature),
        )
      ) {
        next = Buffer.from(payloadBase64, "base64url").toString("utf8");
      }
    }
  }
  const safeNext = next?.startsWith("/dashboard/line")
    ? next
    : "/dashboard/line";
  const errorRedirectUrl = new URL("/connect", request.url);
  errorRedirectUrl.searchParams.set("next", safeNext);
  errorRedirectUrl.searchParams.set("error", "line_connect_failed");
  const redirectWithError = (error?: unknown) => {
    if (error) console.error(error);
    return NextResponse.redirect(errorRedirectUrl);
  };

  const code = request.nextUrl.searchParams.get("code");
  const codeVerifier = request.cookies.get("line_oauth_code_verifier")?.value;
  if (!code || !codeVerifier) {
    return redirectWithError();
  }

  let tokenResponse: Response;
  try {
    tokenResponse = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/auth/line/callback`,
        client_id: env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID,
        client_secret: env.LINE_LOGIN_CHANNEL_SECRET,
        code_verifier: codeVerifier,
      }),
    });
  } catch (error) {
    return redirectWithError(error);
  }

  let tokenBody: unknown;
  try {
    tokenBody = await tokenResponse.json();
  } catch (error) {
    return redirectWithError(error);
  }
  if (!tokenResponse.ok) {
    return redirectWithError(tokenBody);
  }

  const { data: tokenData, error: tokenError } = z
    .looseObject({
      id_token: z.string(),
      access_token: z.string(),
      refresh_token: z.string(),
    })
    .safeParse(tokenBody);
  if (tokenError) {
    return redirectWithError(tokenError.message);
  }

  let verifyResponse: Response;
  try {
    verifyResponse = await fetch("https://api.line.me/oauth2/v2.1/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        id_token: tokenData.id_token,
        client_id: env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID,
      }),
    });
  } catch (error) {
    return redirectWithError(error);
  }

  let verifyBody: unknown;
  try {
    verifyBody = await verifyResponse.json();
  } catch (error) {
    return redirectWithError(error);
  }
  if (!verifyResponse.ok) {
    return redirectWithError(verifyBody);
  }

  const { data: verifyData, error: verifyError } = z
    .looseObject({
      sub: z.string(),
      name: z.string().optional(),
      picture: z.url().optional(),
    })
    .safeParse(verifyBody);
  if (verifyError) {
    return redirectWithError(verifyError.message);
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirectWithError();
  }

  const { error: updateUserError } = await supabase.auth.updateUser({
    data: {
      line_connected: true,
    },
  });
  if (updateUserError) {
    return redirectWithError(updateUserError.message);
  }

  const { error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) {
    return redirectWithError(refreshError.message);
  }

  const supabaseAdmin = createAdminClient();

  const { error: upsertProfileError } = await supabaseAdmin
    .from("profiles")
    .upsert(
      {
        id: user.id,
        display_name: verifyData.name,
        avatar_url: verifyData.picture,
      },
      { ignoreDuplicates: true },
    );
  if (upsertProfileError) {
    return redirectWithError(upsertProfileError.message);
  }

  const { error: upsertTokenError } = await supabaseAdmin
    .from("line_accounts")
    .upsert({
      id: verifyData.sub,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      profile_id: user.id,
    });
  if (upsertTokenError) {
    return redirectWithError(upsertTokenError.message);
  }

  const redirectUrl = new URL(safeNext, request.url);
  return NextResponse.redirect(redirectUrl);
}
