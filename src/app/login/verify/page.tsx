import { VerifyOtpForm } from "@/features/auth/components/VerifyOtpForm";

export default async function VerifyPage(props: {
  searchParams: Promise<Record<string, unknown>>;
}) {
  const searchParams = await props.searchParams;
  const next = typeof searchParams.next === "string" ? searchParams.next : "";
  const email =
    typeof searchParams.email === "string" ? searchParams.email : "";

  return <VerifyOtpForm next={next} email={email} />;
}
