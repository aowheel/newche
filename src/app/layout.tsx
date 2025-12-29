import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Newche",
  description: "Scheduling App for LINE",
};

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <main>{props.children}</main>
      </body>
    </html>
  );
}
