"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const checkCookies = async () => {
  const cookieStore = cookies();
  return cookieStore.get("tutorial")?.value === "20240823";
} 

export const setCookies = async () => {
  const cookieStore = cookies();
  cookieStore.set("tutorial", "20240823", {
    maxAge: 60*60*24*365
  });
  redirect("/internal");
}
