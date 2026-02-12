import { NextResponse } from "next/server";

import { createAuditLog } from "@/lib/audit";
import { requireApiSession } from "@/lib/api-session";
import { apiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { canManageRecords } from "@/lib/rbac";
import { customerWhereForUser } from "@/lib/scope";
import { customerPatchSchema } from "@/lib/validations/customer";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiSession();
    if ("response" in auth) return auth.response;

    const { id } = await params;

    const customer = await prisma.customer.findFirst({
      where: {
        id,
        ...customerWhereForUser(auth.session.user),
      },
      include: {
        buildings: true,
        projects: {
          orderBy: { createdAt: "desc" },
          take: 8,
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    return apiError(error, "Failed to load customer");
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
    const parsed = customerPatchSchema.parse(body);
    const { id } = await params;

    const customer = await prisma.customer.update({
      where: { id },
      data: parsed,
    });

    await createAuditLog({
      userId: auth.session.user.id,
      action: "customer.update",
      entityType: "customer",
      entityId: customer.id,
      metadata: parsed,
    });

    return NextResponse.json(customer);
  } catch (error) {
    return apiError(error, "Failed to update customer");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiSession(["admin"]);
    if ("response" in auth) return auth.response;

    const { id } = await params;
    const url = new URL(request.url);
    const anonymize = url.searchParams.get("anonymize") === "true";

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        isDeleted: true,
        anonymizedAt: anonymize ? new Date() : null,
        ...(anonymize
          ? {
              contactEmail: `${id}@anonymized.local`,
              contactPhone: null,
              billingAddress: null,
              notes: "Anonymized by admin request",
            }
          : {}),
      },
    });

    await createAuditLog({
      userId: auth.session.user.id,
      action: anonymize ? "customer.anonymize" : "customer.soft_delete",
      entityType: "customer",
      entityId: customer.id,
      metadata: { anonymize },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "Failed to remove customer");
  }
}
