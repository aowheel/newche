import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next");
  const safeNext = next?.startsWith("/dashboard") ? next : "/dashboard";

  const redirectWithError = (error?: unknown) => {
    if (error) {
      console.error(error);
    }
    const errorRedirectUrl = new URL("/login", request.url);
    errorRedirectUrl.searchParams.set("next", safeNext);
    errorRedirectUrl.searchParams.set("error", "auth_failed");
    return NextResponse.redirect(errorRedirectUrl);
  };

  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return redirectWithError();
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return redirectWithError(error.message);
  }

  const redirectUrl = new URL(safeNext, request.url);
  return NextResponse.redirect(redirectUrl);
}
