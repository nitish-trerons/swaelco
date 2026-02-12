import { NextResponse } from "next/server";

import { createAuditLog } from "@/lib/audit";
import { requireApiSession } from "@/lib/api-session";
import { apiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { canManageRecords } from "@/lib/rbac";
import { projectWhereForUser } from "@/lib/scope";
import { documentSchema } from "@/lib/validations/document";

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
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const documents = await prisma.document.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items: documents });
  } catch (error) {
    return apiError(error, "Failed to load documents");
  }
}

export async function POST(
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
    const parsed = documentSchema.parse({
      ...body,
      projectId: id,
    });

    const document = await prisma.document.create({
      data: parsed,
    });

    await createAuditLog({
      userId: auth.session.user.id,
      action: "project.document.create",
      entityType: "project",
      entityId: id,
      metadata: {
        documentId: document.id,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    return apiError(error, "Failed to create document");
  }
}
