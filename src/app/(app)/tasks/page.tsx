import { redirect } from "next/navigation";

import { TaskStatusForm } from "@/components/forms/task-status-form";
import { TaskStatusBadge } from "@/components/app/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageRecords } from "@/lib/rbac";
import { taskWhereForUser } from "@/lib/scope";
import { formatDate } from "@/lib/utils";

export default async function TasksPage() {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: taskWhereForUser({
      id: session.user.id,
      role: session.user.role,
      customerId: session.user.customerId,
    }),
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [
      { scheduledFor: "asc" },
      { createdAt: "desc" },
    ],
    take: 100,
  });

  const isManager = canManageRecords(session.user.role);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          {session.user.role === "customer" ? "Scheduled Site Visits" : "Task Queue"}
        </h1>
        <p className="text-sm text-slate-300">Lightweight work-order tracking optimized for field operations.</p>
      </div>

      <div className="grid gap-3">
        {tasks.length === 0 ? (
          <Card className="border-slate-800 bg-slate-900/70">
            <CardContent className="p-6 text-sm text-slate-400">No tasks found.</CardContent>
          </Card>
        ) : (
          tasks.map((task: (typeof tasks)[number]) => {
            const canUpdate = isManager || (session.user.role === "technician" && task.assignedTo?.id === session.user.id);

            return (
              <Card key={task.id} className="border-slate-800 bg-slate-900/70">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-base text-white">{task.title}</CardTitle>
                  <p className="text-xs text-slate-400">{task.project.name}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <TaskStatusBadge status={task.status} />
                    <p className="text-xs text-slate-400">Scheduled: {formatDate(task.scheduledFor)}</p>
                    <p className="text-xs text-slate-500">Assigned: {task.assignedTo?.name ?? "Unassigned"}</p>
                  </div>
                  {task.description ? <p className="text-sm text-slate-300">{task.description}</p> : null}
                  {canUpdate ? <TaskStatusForm taskId={task.id} currentStatus={task.status} /> : null}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
