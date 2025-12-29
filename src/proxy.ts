import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "./lib/env/server";

export const config = {
  matcher: ["/login/:path*", "/dashboard/:path*"],
};

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          for (const cookie of cookies) {
            request.cookies.set(cookie.name, cookie.value);
          }
          response = NextResponse.next({ request });
          for (const cookie of cookies) {
            response.cookies.set(cookie.name, cookie.value, cookie.options);
          }
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const isLoginPath = request.nextUrl.pathname.startsWith("/login");

  if (data) {
    if (isLoginPath) {
      const next = request.nextUrl.searchParams.get("next");
      const safeNext = next?.startsWith("/dashboard") ? next : "/dashboard";
      const redirectUrl = new URL(safeNext, request.url);
      redirectUrl.pathname = safeNext;
      return NextResponse.redirect(redirectUrl);
    } else {
      return response;
    }
  } else {
    if (isLoginPath) {
      return response;
    } else {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }
}
