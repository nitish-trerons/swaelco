import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { DOCUMENT_TYPES } from "@/lib/constants";
import { createAuditLog } from "@/lib/audit";
import { requireApiSession } from "@/lib/api-session";
import { apiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { canManageRecords } from "@/lib/rbac";

export async function POST(request: Request) {
  try {
    const auth = await requireApiSession();
    if ("response" in auth) return auth.response;

    if (!canManageRecords(auth.session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();

    const file = formData.get("file");
    const projectId = String(formData.get("projectId") ?? "");
    const type = String(formData.get("type") ?? "contract");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "File is required" }, { status: 400 });
    }

    if (!projectId) {
      return NextResponse.json({ message: "Project id is required" }, { status: 400 });
    }

    if (!DOCUMENT_TYPES.includes(type as (typeof DOCUMENT_TYPES)[number])) {
      return NextResponse.json({ message: "Invalid document type" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: "File too large (10MB max)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storedName = `${Date.now()}-${safeName}`;
    const absolutePath = path.join(uploadsDir, storedName);
    const urlPath = `/uploads/${storedName}`;

    await writeFile(absolutePath, buffer);

    const document = await prisma.document.create({
      data: {
        projectId,
        name: file.name,
        type: type as (typeof DOCUMENT_TYPES)[number],
        url: urlPath,
      },
    });

    await createAuditLog({
      userId: auth.session.user.id,
      action: "document.upload",
      entityType: "document",
      entityId: document.id,
      metadata: {
        projectId,
        size: file.size,
        fileName: file.name,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    return apiError(error, "Failed to upload document");
  }
}
