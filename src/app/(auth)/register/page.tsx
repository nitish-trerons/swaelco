import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/forms/register-form";
import { getCurrentSession } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getCurrentSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return <RegisterForm />;
}
