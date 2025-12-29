import { SignInForm } from "@/features/auth/components/SignInForm";

export default async function LoginPage(props: {
  searchParams: Promise<Record<string, unknown>>;
}) {
  const searchParams = await props.searchParams;
  const next = typeof searchParams.next === "string" ? searchParams.next : "";

  return <SignInForm next={next} />;
}
