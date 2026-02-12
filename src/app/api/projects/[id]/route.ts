import { NextResponse } from "next/server";

import { createAuditLog } from "@/lib/audit";
import { requireApiSession } from "@/lib/api-session";
import { apiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { canManageRecords } from "@/lib/rbac";
import { projectWhereForUser } from "@/lib/scope";
import { projectPatchSchema } from "@/lib/validations/project";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiSession();
    if ("response" in auth) return auth.response;

    const { id } = await params;

    const project = await prisma.project.findFirst({
      where: {
        id,
        ...projectWhereForUser(auth.session.user),
      },
      include: {
        customer: true,
        building: true,
        documents: {
          orderBy: { createdAt: "desc" },
        },
        tasks: {
          orderBy: { scheduledFor: "asc" },
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        comments: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return apiError(error, "Failed to load project");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiSession();
    if ("response" in auth) return auth.response;
    if (!canManageRecords(auth.session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = projectPatchSchema.parse(body);
    const { id } = await params;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...parsed,
        startDate: parsed.startDate ? new Date(parsed.startDate) : undefined,
        endDate: parsed.endDate ? new Date(parsed.endDate) : undefined,
      },
    });

    await createAuditLog({
      userId: auth.session.user.id,
      action: "project.update",
      entityType: "project",
      entityId: project.id,
      metadata: parsed,
    });

    return NextResponse.json(project);
  } catch (error) {
    return apiError(error, "Failed to update project");
  }
}
