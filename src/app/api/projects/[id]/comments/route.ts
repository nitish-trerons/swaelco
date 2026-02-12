import { NextResponse } from "next/server";

import { createAuditLog } from "@/lib/audit";
import { requireApiSession } from "@/lib/api-session";
import { apiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { projectWhereForUser } from "@/lib/scope";
import { projectCommentSchema } from "@/lib/validations/project";

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

    const comments = await prisma.projectComment.findMany({
      where: { projectId: id },
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
    });

    return NextResponse.json({ items: comments });
  } catch (error) {
    return apiError(error, "Failed to load comments");
  }
}

export async function POST(
  request: Request,
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

    const body = await request.json();
    const parsed = projectCommentSchema.parse(body);

    const comment = await prisma.projectComment.create({
      data: {
        projectId: id,
        authorId: auth.session.user.id,
        parentId: parsed.parentId,
        body: parsed.body,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    await createAuditLog({
      userId: auth.session.user.id,
      action: "project.comment.create",
      entityType: "project",
      entityId: id,
      metadata: {
        commentId: comment.id,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return apiError(error, "Failed to create comment");
  }
}
