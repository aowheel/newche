import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "./lib/env/server";

export const config = {
  matcher: ["/login/:path*", "/connect/:path*", "/dashboard/:path*"],
};

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, nextUrl } = request;
  const { pathname, searchParams } = nextUrl;

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
  const isAuthenticated = !!data;
  const isLineConnected = !!data?.claims.user_metadata?.line_connected;
  const next = searchParams.get("next");
  const isLoginPath = pathname.startsWith("/login");
  const isConnectPath = pathname.startsWith("/connect");
  const isDashboardPath = pathname.startsWith("/dashboard");
  const isLinePath = pathname.startsWith("/dashboard/line");

  const redirectWithNext = (path: string, next?: string) => {
    const redirectUrl = new URL(path, url);
    if (next) {
      redirectUrl.searchParams.set("next", next);
    }
    return NextResponse.redirect(redirectUrl);
  };

  if (isLoginPath) {
    if (isAuthenticated) {
      return redirectWithNext(
        next?.startsWith("/dashboard") ? next : "/dashboard",
      );
    }
    return response;
  }

  if (isConnectPath) {
    if (!isAuthenticated) {
      return redirectWithNext("/login", pathname);
    }
    return response;
  }

  if (isLinePath) {
    if (!isAuthenticated) {
      return redirectWithNext("/login", pathname);
    }
    if (!isLineConnected) {
      return redirectWithNext("/connect", pathname);
    }
    return response;
  }

  if (isDashboardPath) {
    if (!isAuthenticated) {
      return redirectWithNext("/login", pathname);
    }
    return response;
  }

  return response;
}
