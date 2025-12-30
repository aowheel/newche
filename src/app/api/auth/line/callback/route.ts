import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { env } from "@/lib/env/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next");
  const safeNext = next?.startsWith("/dashboard") ? next : "/dashboard";

  const redirectWithError = (error?: unknown) => {
    if (error) {
      console.error(error);
    }
    const errorRedirectUrl = new URL("/dashboard/integration", request.url);
    errorRedirectUrl.searchParams.set("next", safeNext);
    errorRedirectUrl.searchParams.set("error", "integration_failed");
    return NextResponse.redirect(errorRedirectUrl);
  };

  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get("line_oauth_state")?.value;
  if (!state || !storedState || state !== storedState) {
    return redirectWithError();
  }

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
        redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/auth/line/callback`,
        client_id: env.NEXT_PUBLIC_LINE_CHANNEL_ID,
        client_secret: env.LINE_CHANNEL_SECRET,
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
        client_id: env.NEXT_PUBLIC_LINE_CHANNEL_ID,
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
  const supabaseAdmin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirectWithError();
  }

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
      sub: verifyData.sub,
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
