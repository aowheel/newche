import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "./lib/env/server";

export const config = {
  matcher: ["/login/:path*", "/connect/:path*", "/workspace/:path*"],
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
  const next = searchParams.get("next");
  const isLoginPath = pathname.startsWith("/login");
  const isConnectPath = pathname.startsWith("/connect");
  const isWorkspacePath = pathname.startsWith("/workspace");

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
        next?.startsWith("/workspace") ? next : "/workspace",
      );
    }
    return response;
  }

  if (isConnectPath || isWorkspacePath) {
    if (!isAuthenticated) {
      return redirectWithNext("/login", pathname);
    }
    return response;
  }

  return response;
}
