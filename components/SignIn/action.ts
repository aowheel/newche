"use server";

import { signIn } from "@/auth";

export default async function handleSignIn(prevState: undefined, formData: FormData) {
  try {
    await signIn("google");
  } catch(error) {
    throw error;
  }
  return undefined;
}
