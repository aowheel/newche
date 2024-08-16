import Google from "next-auth/providers/google";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import "next-auth/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma/edge";

declare module "next-auth" {
  interface Session {
    user: {
      displayName: string | null,
      period: number | null
    } & DefaultSession["user"]
  }
}

const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/settings"
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (!token.sub) return session;
      
      session.user.id = token.sub;

      if (!!session.user.displayName) return session;

      const { displayName, period } = await prisma.user.findUnique({
        where: {
          id: token.sub
        },
        select: {
          displayName: true,
          period: true
        }
      }) || { displayName: null, period: null };

      if (!displayName) return session;

      session.user.displayName = displayName;
      session.user.period = period;

      return session;
    },
    authorized: ({ auth, request: { nextUrl } }) => {
      const isSignedIn = !!auth?.user;
      const isOnInternal = nextUrl.pathname.startsWith("/internal");
      if (isOnInternal) {
        if (!isSignedIn) return false;
        const isActive = (auth.user.period || 0) >= Number(process.env.YOUNGEST_ACTIVE) - 5;
        const isOnActive = nextUrl.pathname.startsWith("/internal/active");
        const isOnAdmin = nextUrl.pathname.startsWith("/internal/admin");
        if (isOnActive) {
          if (isActive) return true;
          return Response.redirect(new URL("/internal", nextUrl));
        } else if (isOnAdmin) {
          if (process.env.ADMIN_EMAIL?.split(",").includes(auth.user.email || "")) return true;
          return Response.redirect(new URL("/internal", nextUrl));
        } else if (isActive) {
          return Response.redirect(new URL("/internal/active", nextUrl));
        }
        return true;
      }
      return true;
    }
  },
  providers: [Google]
} satisfies NextAuthConfig;

export default authConfig;
