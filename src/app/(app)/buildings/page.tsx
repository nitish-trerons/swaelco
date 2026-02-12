import Link from "next/link";
import { redirect } from "next/navigation";

import { BuildingCreateForm } from "@/components/forms/building-create-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageRecords } from "@/lib/rbac";
import { customerWhereForUser } from "@/lib/scope";

export default async function BuildingsPage() {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/login");
  }

  const customerScope = customerWhereForUser({
    id: session.user.id,
    role: session.user.role,
    customerId: session.user.customerId,
  });

  const [buildings, customers] = await Promise.all([
    prisma.building.findMany({
      where: {
        customer: customerScope,
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            elevators: true,
            projects: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    canManageRecords(session.user.role)
      ? prisma.customer.findMany({
          where: { isDeleted: false },
          select: {
            id: true,
            name: true,
          },
          orderBy: { name: "asc" },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Buildings</h1>
          <p className="text-sm text-slate-300">Managed buildings and elevator assets.</p>
        </div>
        {canManageRecords(session.user.role) ? <BuildingCreateForm customers={customers} /> : null}
      </div>

      <Card className="border-slate-800 bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-white">Building List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Floors</TableHead>
                <TableHead>Elevators</TableHead>
                <TableHead>Projects</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buildings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400">
                    No buildings available.
                  </TableCell>
                </TableRow>
              ) : (
                buildings.map((building: (typeof buildings)[number]) => (
                  <TableRow key={building.id}>
                    <TableCell>
                      <Link href={`/buildings/${building.id}`} className="font-medium text-blue-300 hover:text-blue-200">
                        {building.name}
                      </Link>
                    </TableCell>
                    <TableCell>{building.customer.name}</TableCell>
                    <TableCell>{building.address}</TableCell>
                    <TableCell>{building.floors}</TableCell>
                    <TableCell>{building._count.elevators}</TableCell>
                    <TableCell>{building._count.projects}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
