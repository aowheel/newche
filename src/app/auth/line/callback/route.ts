import crypto from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { env } from "@/lib/env/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
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
    if (!next) throw new Error("Invalid state");

    const code = request.nextUrl.searchParams.get("code");
    const codeVerifier = request.cookies.get("line_oauth_code_verifier")?.value;
    if (!code || !codeVerifier) {
      throw new Error("Missing code or code verifier");
    }

    const tokenResponse = await fetch("https://api.line.me/oauth2/v2.1/token", {
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
    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenBody = await tokenResponse.json();
    const { data: tokenData, error: tokenError } = z
      .looseObject({
        id_token: z.string(),
        access_token: z.string(),
        refresh_token: z.string(),
      })
      .safeParse(tokenBody);
    if (tokenError) {
      throw tokenError;
    }

    const verifyResponse = await fetch(
      "https://api.line.me/oauth2/v2.1/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          id_token: tokenData.id_token,
          client_id: env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID,
        }),
      },
    );
    if (!verifyResponse.ok) {
      throw new Error("Failed to verify ID token");
    }

    const verifyBody = await verifyResponse.json();
    const { data: verifyData, error: verifyError } = z
      .looseObject({
        sub: z.string(),
        name: z.string().optional(),
        picture: z.url().optional(),
      })
      .safeParse(verifyBody);
    if (verifyError) {
      throw verifyError;
    }

    const supabase = await createClient();

    const { error: updateUserError } = await supabase.auth.updateUser({
      data: {
        line_connected: true,
      },
    });
    if (updateUserError) {
      throw updateUserError;
    }

    const {
      data: { user },
      error: refreshError,
    } = await supabase.auth.refreshSession();
    if (refreshError) {
      throw refreshError;
    }
    if (!user) {
      throw new Error("User not found");
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
      throw upsertProfileError;
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
      throw upsertTokenError;
    }

    const redirectUrl = new URL(next, request.url);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    const errorRedirectUrl = new URL("/connect", request.url);
    errorRedirectUrl.searchParams.set("error", "line_connect_failed");
    return NextResponse.redirect(errorRedirectUrl);
  }
}
