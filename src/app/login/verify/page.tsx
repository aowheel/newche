import z from "zod";
import { VerifyOtpForm } from "@/features/auth/components/VerifyOtpForm";

export default async function VerifyPage(props: {
  searchParams: Promise<Record<string, unknown>>;
}) {
  const searchParams = await props.searchParams;
  const { next, email } = z
    .looseObject({
      next: z
        .string()
        .refine((path) => path.startsWith("/workspace"))
        .catch("/workspace"),
      email: z.string().catch(""),
    })
    .parse(searchParams);

  return <VerifyOtpForm nextPath={next} email={email} />;
}
