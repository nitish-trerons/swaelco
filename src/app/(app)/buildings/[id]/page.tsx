import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { customerWhereForUser } from "@/lib/scope";
import { formatDate } from "@/lib/utils";

export default async function BuildingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  const building = await prisma.building.findFirst({
    where: {
      id,
      customer: customerWhereForUser({
        id: session.user.id,
        role: session.user.role,
        customerId: session.user.customerId,
      }),
    },
    include: {
      customer: true,
      elevators: true,
      projects: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!building) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">{building.name}</h1>
        <p className="text-sm text-slate-300">{building.address}</p>
      </div>

      <Card className="border-slate-800 bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-white">Building Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-slate-300 md:grid-cols-3">
          <p>Customer: {building.customer.name}</p>
          <p>Floors: {building.floors}</p>
          <p>Created: {formatDate(building.createdAt)}</p>
          {building.notes ? <p className="md:col-span-3">Notes: {building.notes}</p> : null}
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-white">Elevators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {building.elevators.length === 0 ? (
            <p className="text-sm text-slate-400">No elevators recorded yet.</p>
          ) : (
            building.elevators.map((elevator: (typeof building.elevators)[number]) => (
              <div key={elevator.id} className="rounded-md border border-slate-800 p-3">
                <p className="font-medium text-slate-100">{elevator.model}</p>
                <p className="text-xs text-slate-400">Capacity: {elevator.capacityKg}kg</p>
                <Badge variant="outline" className="mt-2 border-slate-700 text-slate-300">
                  {elevator.status.replaceAll("_", " ")}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-white">Linked Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {building.projects.length === 0 ? (
            <p className="text-sm text-slate-400">No projects linked.</p>
          ) : (
            building.projects.map((project: (typeof building.projects)[number]) => (
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
