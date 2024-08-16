import type { Metadata } from "next";
import "./globals.css";
import { inter, notoSansJP, orbitron } from "@/lib/fonts";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Newche | An app for SCI Cycle-ball Team",
  description: "Newche is an app that makes it easy to share SCI Cycle-ball Team schedule.",
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.className} min-h-screen flex flex-col bg-slate-900`}>
        <header
          className={`${orbitron.className} px-4 text-4xl text-teal-300`}
        >
          <Link href="/">Newche</Link>
        </header>
        <main className="grow flex flex-col items-center justify-center gap-y-4 p-4" >{children}</main>
        <footer className={`${inter.className} px-4 py-2 flex flex-wrap justify-around gap-x-8 gap-y-2 border-t border-slate-600 text-slate-400`}>
          <Link href="/">Home</Link>
          <Link href="/internal">Schedule</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/settings">Settings</Link>
          <Link href="/internal/admin">Admin</Link>
        </footer>
      </body>
    </html>
  );
}
