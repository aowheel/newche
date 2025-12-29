import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { env } from "@/lib/env/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next");
  const safeNext = next?.startsWith("/dashboard") ? next : "/dashboard";

  const errorRedirectUrl = new URL("/dashboard/integrations/line", request.url);
  errorRedirectUrl.searchParams.set("next", safeNext);

  const state = request.nextUrl.searchParams.get("state");
  if (!state || state !== request.cookies.get("line_oauth_state")?.value) {
    errorRedirectUrl.searchParams.set("error", "invalid_state");
    return NextResponse.redirect(errorRedirectUrl);
  }

  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    errorRedirectUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(errorRedirectUrl);
  }

  const codeVerifier = request.cookies.get("line_oauth_code_verifier")?.value;
  if (!codeVerifier) {
    errorRedirectUrl.searchParams.set("error", "missing_code_verifier");
    return NextResponse.redirect(errorRedirectUrl);
  }

  const tokenResponse = await fetch("https://api.line.me/oauth2/v2.1/token", {
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
  if (!tokenResponse.ok) {
    console.error(await tokenResponse.json());
    errorRedirectUrl.searchParams.set("error", "invalid_code");
    return NextResponse.redirect(errorRedirectUrl);
  }

  const { data: tokenData, error: tokenError } = z
    .looseObject({
      id_token: z.string(),
      access_token: z.string(),
      refresh_token: z.string(),
    })
    .safeParse(await tokenResponse.json());
  if (tokenError) {
    console.error(tokenError);
    errorRedirectUrl.searchParams.set("error", "invalid_token");
    return NextResponse.redirect(errorRedirectUrl);
  }

  const verifyResponse = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      id_token: tokenData.id_token,
      client_id: env.NEXT_PUBLIC_LINE_CHANNEL_ID,
    }),
  });
  if (!verifyResponse.ok) {
    console.error(await verifyResponse.json());
    errorRedirectUrl.searchParams.set("error", "verification_failed");
    return NextResponse.redirect(errorRedirectUrl);
  }

  const { data: verifyData, error: verifyError } = z
    .looseObject({
      sub: z.string(),
      name: z.string().optional(),
      picture: z.string().url().optional(),
    })
    .safeParse(await verifyResponse.json());
  if (verifyError) {
    console.error(verifyError);
    errorRedirectUrl.searchParams.set("error", "invalid_id_token");
    return NextResponse.redirect(errorRedirectUrl);
  }

  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    errorRedirectUrl.searchParams.set("error", "not_authenticated");
    return NextResponse.redirect(errorRedirectUrl);
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
    console.error(upsertProfileError.message);
    errorRedirectUrl.searchParams.set("error", "failed_to_update_profile");
    return NextResponse.redirect(errorRedirectUrl);
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
    console.error(upsertTokenError.message);
    errorRedirectUrl.searchParams.set("error", "failed_to_store_token");
    return NextResponse.redirect(errorRedirectUrl);
  }

  const redirectUrl = new URL(safeNext, request.url);
  return NextResponse.redirect(redirectUrl);
}
