import Link from "next/link";
import { redirect } from "next/navigation";

import { ProjectCreateForm } from "@/components/forms/project-create-form";
import { ProjectStatusBadge } from "@/components/app/status-badge";
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
import { projectWhereForUser } from "@/lib/scope";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ProjectsPage() {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/login");
  }

  const user = {
    id: session.user.id,
    role: session.user.role,
    customerId: session.user.customerId,
  };

  const projects = await prisma.project.findMany({
    where: projectWhereForUser(user),
    include: {
      customer: {
        select: { id: true, name: true },
      },
      building: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const canManage = canManageRecords(session.user.role);

  const [customers, buildings] = canManage
    ? await Promise.all([
        prisma.customer.findMany({
          where: { isDeleted: false },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        }),
        prisma.building.findMany({
          where: { customer: { isDeleted: false } },
          select: { id: true, name: true, customerId: true },
          orderBy: { name: "asc" },
        }),
      ])
    : [[], []];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Projects</h1>
          <p className="text-sm text-slate-300">Track installation, modernization, and repair jobs.</p>
        </div>
        {canManage ? <ProjectCreateForm customers={customers} buildings={buildings} /> : null}
      </div>

      <Card className="border-slate-800 bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-white">Project List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Start</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400">
                    No projects available.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project: (typeof projects)[number]) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Link href={`/projects/${project.id}`} className="font-medium text-blue-300 hover:text-blue-200">
                        {project.name}
                      </Link>
                    </TableCell>
                    <TableCell>{project.customer.name}</TableCell>
                    <TableCell>{project.building.name}</TableCell>
                    <TableCell>
                      <ProjectStatusBadge status={project.status} />
                    </TableCell>
                    <TableCell>{project.budget ? formatCurrency(project.budget) : "-"}</TableCell>
                    <TableCell>{formatDate(project.startDate)}</TableCell>
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
