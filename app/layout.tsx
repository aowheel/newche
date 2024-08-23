import type { Metadata } from "next";
import "./globals.css";
import { notoSansJP } from "@/lib/fonts";
import { ReactNode } from "react";
import Navigator from "@/components/Navigator";

export const metadata: Metadata = {
  title: "Newche | An app for SCI Cycle-ball Team",
  description: "Newche is an app that makes it easy to share SCI Cycle-ball Team schedule."
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.className} bg-slate-900`}>
        <main className="h-screen">
          {children}
        </main>
        <Navigator />
      </body>
    </html>
  );
}
