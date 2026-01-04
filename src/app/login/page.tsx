import z from "zod";
import { SignInForm } from "@/features/auth/components/SignInForm";

export default async function LoginPage(props: {
  searchParams: Promise<Record<string, unknown>>;
}) {
  const searchParams = await props.searchParams;
  const { next, error } = z
    .looseObject({
      next: z
        .string()
        .refine((path) => path.startsWith("/workspace"))
        .catch("/workspace"),
      error: z.string().optional(),
    })
    .parse(searchParams);

  return <SignInForm nextPath={next} queryError={error} />;
}
