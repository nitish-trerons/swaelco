import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CustomerDangerActions } from "@/components/forms/customer-danger-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessRole } from "@/lib/rbac";
import { customerWhereForUser } from "@/lib/scope";
import { formatDate } from "@/lib/utils";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  const customer = await prisma.customer.findFirst({
    where: {
      id,
      ...customerWhereForUser({
        id: session.user.id,
        role: session.user.role,
        customerId: session.user.customerId,
      }),
    },
    include: {
      buildings: true,
      projects: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">{customer.name}</h1>
          <p className="text-sm text-slate-300">{customer.contactEmail}</p>
        </div>

        {canAccessRole(session.user.role, ["admin"]) ? <CustomerDangerActions customerId={customer.id} /> : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-800 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="text-white">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>Phone: {customer.contactPhone ?? "-"}</p>
            <p>Billing: {customer.billingAddress ?? "-"}</p>
            <p>Created: {formatDate(customer.createdAt)}</p>
            <p>Status: {customer.isDeleted ? "Archived" : "Active"}</p>
            {customer.notes ? <p>Notes: {customer.notes}</p> : null}
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="text-white">Buildings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {customer.buildings.length === 0 ? (
              <p className="text-sm text-slate-400">No buildings added.</p>
            ) : (
              customer.buildings.map((building: (typeof customer.buildings)[number]) => (
                <Link
                  key={building.id}
                  href={`/buildings/${building.id}`}
                  className="block rounded-md border border-slate-800 px-3 py-2 text-sm text-blue-300 hover:text-blue-200"
                >
                  {building.name}
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-800 bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-white">Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {customer.projects.length === 0 ? (
            <p className="text-sm text-slate-400">No projects linked to this customer.</p>
          ) : (
            customer.projects.map((project: (typeof customer.projects)[number]) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block rounded-md border border-slate-800 px-3 py-2 text-sm text-blue-300 hover:text-blue-200"
              >
                {project.name}
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
