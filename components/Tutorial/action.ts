"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const handleTutorial = async () => {
  const cookieStore = cookies();
  cookieStore.set("tutorial", "20240823", {
    maxAge: 60*60*24*365
  });
  redirect("/internal");
}

export default handleTutorial;
