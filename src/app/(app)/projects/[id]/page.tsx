import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { DocumentUploadForm } from "@/components/forms/document-upload-form";
import { ProjectCommentForm } from "@/components/forms/project-comment-form";
import { TaskStatusForm } from "@/components/forms/task-status-form";
import { ProjectStatusBadge, TaskStatusBadge } from "@/components/app/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageRecords } from "@/lib/rbac";
import { projectWhereForUser } from "@/lib/scope";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  const user = {
    id: session.user.id,
    role: session.user.role,
    customerId: session.user.customerId,
  };

  const project = await prisma.project.findFirst({
    where: {
      id,
      ...projectWhereForUser(user),
    },
    include: {
      customer: true,
      building: true,
      documents: { orderBy: { createdAt: "desc" } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: { name: true, role: true },
          },
        },
      },
      tasks: {
        orderBy: { scheduledFor: "asc" },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const canManage = canManageRecords(session.user.role);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Project</p>
          <h1 className="text-2xl font-semibold text-white">{project.name}</h1>
          <p className="text-sm text-slate-300">
            {project.customer.name} · {project.building.name}
          </p>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      <Card className="border-slate-800 bg-slate-900/70">
        <CardContent className="grid gap-4 p-6 md:grid-cols-4">
          <div>
            <p className="text-xs text-slate-400">Type</p>
            <p className="text-sm capitalize text-slate-100">{project.type.replaceAll("_", " ")}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Budget</p>
            <p className="text-sm text-slate-100">{project.budget ? formatCurrency(project.budget) : "-"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Actual Cost</p>
            <p className="text-sm text-slate-100">{project.actualCost ? formatCurrency(project.actualCost) : "-"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Timeline</p>
            <p className="text-sm text-slate-100">
              {formatDate(project.startDate)} → {formatDate(project.endDate)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="border-slate-800 bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-white">Work Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-300">{project.description ?? "No description available."}</p>

              <div className="space-y-2">
                {project.tasks.length === 0 ? (
                  <p className="text-sm text-slate-400">No work orders created yet.</p>
                ) : (
                  project.tasks.map((task: (typeof project.tasks)[number]) => {
                    const canUpdateTask =
                      canManage ||
                      (session.user.role === "technician" && task.assignedTo?.id === session.user.id);

                    return (
                      <div key={task.id} className="rounded-md border border-slate-800 p-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-slate-100">{task.title}</p>
                            <p className="text-xs text-slate-400">
                              Scheduled: {formatDate(task.scheduledFor)} · Assigned to {task.assignedTo?.name ?? "Unassigned"}
                            </p>
                          </div>
                          <TaskStatusBadge status={task.status} />
                        </div>
                        {task.description ? <p className="mt-2 text-sm text-slate-300">{task.description}</p> : null}
                        {canUpdateTask ? <div className="mt-3"><TaskStatusForm taskId={task.id} currentStatus={task.status} /></div> : null}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="border-slate-800 bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-white">Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {canManage ? <DocumentUploadForm projectId={project.id} /> : null}

              <div className="space-y-2">
                {project.documents.length === 0 ? (
                  <p className="text-sm text-slate-400">No documents uploaded yet.</p>
                ) : (
                  project.documents.map((document: (typeof project.documents)[number]) => (
                    <div key={document.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-800 p-3">
                      <div>
                        <p className="text-sm font-medium text-slate-100">{document.name}</p>
                        <Badge variant="outline" className="mt-1 border-slate-700 text-slate-300">
                          {document.type.replaceAll("_", " ")}
                        </Badge>
                      </div>
                      <Link href={document.url} className="text-sm text-blue-300 hover:text-blue-200" target="_blank">
                        Download
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="border-slate-800 bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-white">Threaded Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProjectCommentForm projectId={project.id} />

              <div className="space-y-3">
                {project.comments.length === 0 ? (
                  <p className="text-sm text-slate-400">No messages yet.</p>
                ) : (
                  project.comments.map((comment: (typeof project.comments)[number]) => (
                    <div key={comment.id} className="rounded-md border border-slate-800 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-slate-100">{comment.author.name ?? "Team member"}</p>
                        <p className="text-xs text-slate-500">{formatDate(comment.createdAt)}</p>
                      </div>
                      <p className="mt-1 text-sm text-slate-300">{comment.body}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
