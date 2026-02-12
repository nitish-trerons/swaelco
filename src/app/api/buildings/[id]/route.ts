import { NextResponse } from "next/server";

import { createAuditLog } from "@/lib/audit";
import { requireApiSession } from "@/lib/api-session";
import { apiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { canManageRecords } from "@/lib/rbac";
import { customerWhereForUser } from "@/lib/scope";
import { buildingPatchSchema } from "@/lib/validations/building";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiSession();
    if ("response" in auth) return auth.response;

    const { id } = await params;

    const building = await prisma.building.findFirst({
      where: {
        id,
        customer: customerWhereForUser(auth.session.user),
      },
      include: {
        customer: true,
        elevators: true,
        projects: {
          orderBy: { createdAt: "desc" },
          take: 8,
        },
      },
    });

    if (!building) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(building);
  } catch (error) {
    return apiError(error, "Failed to load building");
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

    const { id } = await params;
    const body = await request.json();
    const parsed = buildingPatchSchema.parse(body);

    const building = await prisma.building.update({
      where: { id },
      data: parsed,
    });

    await createAuditLog({
      userId: auth.session.user.id,
      action: "building.update",
      entityType: "building",
      entityId: building.id,
      metadata: parsed,
    });

    return NextResponse.json(building);
  } catch (error) {
    return apiError(error, "Failed to update building");
  }
}
