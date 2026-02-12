import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      customer: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">Profile</h1>

      <Card className="border-slate-800 bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-white">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-300">
          <p>Name: {user?.name ?? "-"}</p>
          <p>Email: {user?.email ?? "-"}</p>
          <p>Role: {user?.role.replaceAll("_", " ")}</p>
          {user?.customer?.name ? <p>Customer Org: {user.customer.name}</p> : null}
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-white">Security Defaults</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-300">
          <p>Session cookies are HTTP-only and managed by NextAuth.</p>
          <p>API requests are validated with Zod and role-checked server-side.</p>
          <p>Customer records support soft-delete and optional anonymization.</p>
        </CardContent>
      </Card>
    </div>
  );
}
