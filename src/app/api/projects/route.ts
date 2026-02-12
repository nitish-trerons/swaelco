import { NextResponse } from "next/server";

import { createAuditLog } from "@/lib/audit";
import { requireApiSession } from "@/lib/api-session";
import { apiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { canManageRecords } from "@/lib/rbac";
import { projectWhereForUser } from "@/lib/scope";
import { projectSchema } from "@/lib/validations/project";

export async function GET(request: Request) {
  try {
    const auth = await requireApiSession();
    if ("response" in auth) return auth.response;

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 10), 50);
    const skip = (page - 1) * limit;

    const where = projectWhereForUser(auth.session.user);

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          customer: {
            select: { id: true, name: true },
          },
          building: {
            select: { id: true, name: true },
          },
          _count: {
            select: { tasks: true, documents: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      items,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return apiError(error, "Failed to load projects");
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
    const parsed = projectSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        ...parsed,
        startDate: parsed.startDate ? new Date(parsed.startDate) : null,
        endDate: parsed.endDate ? new Date(parsed.endDate) : null,
      },
    });

    await createAuditLog({
      userId: auth.session.user.id,
      action: "project.create",
      entityType: "project",
      entityId: project.id,
      metadata: {
        status: project.status,
        type: project.type,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return apiError(error, "Failed to create project");
  }
}
