import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next");
  const safeNext = next?.startsWith("/dashboard") ? next : "/dashboard";

  const errorRedirectUrl = new URL("/login", request.url);
  errorRedirectUrl.searchParams.set("next", safeNext);

  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    errorRedirectUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(errorRedirectUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error(error.message);
    errorRedirectUrl.searchParams.set("error", "invalid_code");
    return NextResponse.redirect(errorRedirectUrl);
  }

  const redirectUrl = new URL(safeNext, request.url);
  console.log("Redirecting to:", redirectUrl.toString());
  return NextResponse.redirect(redirectUrl);
}
