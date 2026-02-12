import { NextResponse } from "next/server";

import { createAuditLog } from "@/lib/audit";
import { requireApiSession } from "@/lib/api-session";
import { apiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { canManageRecords } from "@/lib/rbac";
import { taskWhereForUser } from "@/lib/scope";
import { taskPatchSchema, taskSchema } from "@/lib/validations/task";

export async function GET(request: Request) {
  try {
    const auth = await requireApiSession();
    if ("response" in auth) return auth.response;

    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 100);

    const tasks = await prisma.task.findMany({
      where: taskWhereForUser(auth.session.user),
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
      take: limit,
    });

    return NextResponse.json({ items: tasks });
  } catch (error) {
    return apiError(error, "Failed to load tasks");
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireApiSession();
    if ("response" in auth) return auth.response;

    if (!canManageRecords(auth.session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = taskSchema.parse(body);

    const task = await prisma.task.create({
      data: {
        ...parsed,
        description: parsed.description ?? null,
        assignedToUserId: parsed.assignedToUserId ?? null,
        scheduledFor: parsed.scheduledFor ? new Date(parsed.scheduledFor) : null,
      },
    });

    await createAuditLog({
      userId: auth.session.user.id,
      action: "task.create",
      entityType: "task",
      entityId: task.id,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return apiError(error, "Failed to create task");
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireApiSession();
    if ("response" in auth) return auth.response;

    const body = await request.json();
    const { id, ...input } = body as { id: string } & Record<string, unknown>;

    if (!id) {
      return NextResponse.json({ message: "Task id is required" }, { status: 400 });
    }

    const parsed = taskPatchSchema.parse(input);

    const existing = await prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        assignedToUserId: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const isManager = canManageRecords(auth.session.user.role);
    const isOwnTask = existing.assignedToUserId === auth.session.user.id;

    if (!isManager && !isOwnTask) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (!isManager && (parsed.title || parsed.description || parsed.assignedToUserId || parsed.projectId)) {
      return NextResponse.json({ message: "Only managers can edit task details" }, { status: 403 });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...parsed,
        scheduledFor: parsed.scheduledFor ? new Date(parsed.scheduledFor) : undefined,
      },
    });

    await createAuditLog({
      userId: auth.session.user.id,
      action: "task.update",
      entityType: "task",
      entityId: task.id,
      metadata: parsed,
    });

    return NextResponse.json(task);
  } catch (error) {
    return apiError(error, "Failed to update task");
  }
}
