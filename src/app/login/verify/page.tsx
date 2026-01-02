import z from "zod";
import { VerifyOtpForm } from "@/features/auth/components/VerifyOtpForm";

export default async function VerifyPage(props: {
  searchParams: Promise<Record<string, unknown>>;
}) {
  const searchParams = await props.searchParams;
  const { next, email } = z
    .looseObject({
      next: z.string().optional(),
      email: z.string().optional(),
    })
    .parse(searchParams);

  return <VerifyOtpForm nextPath={next} email={email} />;
}
