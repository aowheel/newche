import google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

const authConfig = {
  pages: {
    signIn: "/settings"
  },
  callbacks: {
    authorized: ({ auth, request: { nextUrl } }) => {
      const isSignedIn = !!auth?.user;
      const isOnInternal = nextUrl.pathname.startsWith("/internal");
      if (isOnInternal) {
        if (isSignedIn) return true;
        return false;
      }
      return true;
    },
    session: async ({ session, token }) => {
      if (!token.sub) return session;
      session.user.id = token.sub;
      return session;
    }
  },
  providers: [google]
} satisfies NextAuthConfig;

export default authConfig;
