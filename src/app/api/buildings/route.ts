import { NextResponse } from "next/server";

import { createAuditLog } from "@/lib/audit";
import { requireApiSession } from "@/lib/api-session";
import { apiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { canManageRecords } from "@/lib/rbac";
import { customerWhereForUser } from "@/lib/scope";
import { buildingSchema } from "@/lib/validations/building";

export async function GET() {
  try {
    const auth = await requireApiSession();
    if ("response" in auth) return auth.response;

    const buildings = await prisma.building.findMany({
      where: {
        customer: customerWhereForUser(auth.session.user),
      },
      include: {
        customer: {
          select: {
            id: true,
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
    });

    return NextResponse.json({ items: buildings });
  } catch (error) {
    return apiError(error, "Failed to load buildings");
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
    const parsed = buildingSchema.parse(body);

    const building = await prisma.building.create({
      data: {
        ...parsed,
        notes: parsed.notes ?? null,
      },
    });

    await createAuditLog({
      userId: auth.session.user.id,
      action: "building.create",
      entityType: "building",
      entityId: building.id,
    });

    return NextResponse.json(building, { status: 201 });
  } catch (error) {
    return apiError(error, "Failed to create building");
  }
}
