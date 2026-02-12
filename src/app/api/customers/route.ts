import { NextResponse } from "next/server";

import { createAuditLog } from "@/lib/audit";
import { requireApiSession } from "@/lib/api-session";
import { apiError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { customerWhereForUser } from "@/lib/scope";
import { customerSchema } from "@/lib/validations/customer";

export async function GET(request: Request) {
  try {
    const auth = await requireApiSession();
    if ("response" in auth) return auth.response;

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 10), 50);
    const skip = (page - 1) * limit;

    const where = customerWhereForUser(auth.session.user);

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              buildings: true,
              projects: true,
            },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return NextResponse.json({
      items,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return apiError(error, "Failed to load customers");
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireApiSession(["admin", "project_manager"]);
    if ("response" in auth) return auth.response;

    const body = await request.json();
    const parsed = customerSchema.parse(body);

    const customer = await prisma.customer.create({
      data: {
        ...parsed,
        contactPhone: parsed.contactPhone ?? null,
        billingAddress: parsed.billingAddress ?? null,
        notes: parsed.notes ?? null,
      },
    });

    await createAuditLog({
      userId: auth.session.user.id,
      action: "customer.create",
      entityType: "customer",
      entityId: customer.id,
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    return apiError(error, "Failed to create customer");
  }
}
