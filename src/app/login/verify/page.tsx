import { OtpForm } from "@/features/auth/components/OtpForm";

export default async function VerifyPage(props: {
  searchParams: Promise<Record<string, unknown>>;
}) {
  const searchParams = await props.searchParams;
  const next = typeof searchParams.next === "string" ? searchParams.next : "";
  const email =
    typeof searchParams.email === "string" ? searchParams.email : "";

  return <OtpForm next={next} email={email} />;
}
