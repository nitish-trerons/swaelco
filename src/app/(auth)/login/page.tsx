import { redirect } from "next/navigation";

import { LoginForm } from "@/components/forms/login-form";
import { getCurrentSession } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await getCurrentSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  const { callbackUrl } = await searchParams;

  return <LoginForm callbackUrl={callbackUrl ?? "/dashboard"} />;
}
