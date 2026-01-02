import type { ReactNode } from "react";

export default async function DashboardLayout(props: { children: ReactNode }) {
  return (
    <>
      <header></header>
      <main className="grow">{props.children}</main>
      <footer>Newche</footer>
    </>
  );
}
