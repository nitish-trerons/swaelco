import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectStatusBadge, TaskStatusBadge } from "@/components/app/status-badge";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectWhereForUser, taskWhereForUser } from "@/lib/scope";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/login");
  }

  const user = {
    id: session.user.id,
    role: session.user.role,
    customerId: session.user.customerId,
  };

  const [projectCount, pendingTasks, upcomingTasks, recentProjects] = await Promise.all([
    prisma.project.count({ where: projectWhereForUser(user) }),
    prisma.task.count({
      where: {
        ...taskWhereForUser(user),
        status: {
          in: ["pending", "in_progress"],
        },
      },
    }),
    prisma.task.findMany({
      where: {
        ...taskWhereForUser(user),
        scheduledFor: {
          not: null,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { scheduledFor: "asc" },
      take: 5,
    }),
    prisma.project.findMany({
      where: projectWhereForUser(user),
      include: {
        customer: {
          select: { name: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Welcome, {session.user.name ?? "Operator"}</h1>
        <p className="text-sm text-slate-300">Operational overview for your elevator projects.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-800 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="text-sm text-slate-300">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-white">{projectCount}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="text-sm text-slate-300">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-white">{pendingTasks}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="text-sm text-slate-300">Role</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold capitalize text-white">
              {session.user.role.replaceAll("_", " ")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-800 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="text-white">Upcoming Site Visits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-slate-400">No scheduled visits yet.</p>
            ) : (
              upcomingTasks.map((task: (typeof upcomingTasks)[number]) => (
                <div key={task.id} className="rounded-md border border-slate-800 p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-100">{task.title}</p>
                      <p className="text-xs text-slate-400">{task.project.name}</p>
                      <p className="text-xs text-slate-500">{formatDate(task.scheduledFor)}</p>
                    </div>
                    <TaskStatusBadge status={task.status} />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="text-white">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProjects.map((project: (typeof recentProjects)[number]) => (
              <div key={project.id} className="rounded-md border border-slate-800 p-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-100">{project.name}</p>
                    <p className="text-xs text-slate-400">{project.customer.name}</p>
                  </div>
                  <ProjectStatusBadge status={project.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
