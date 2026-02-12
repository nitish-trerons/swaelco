import { NextResponse } from "next/server";

import { createAuditLog } from "@/lib/audit";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/http";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const customer = await prisma.customer.create({
      data: {
        name: parsed.companyName,
        contactEmail: parsed.email,
        contactPhone: parsed.phone,
      },
    });

    const user = await prisma.user.create({
      data: {
        name: parsed.fullName,
        email: parsed.email,
        passwordHash: hashPassword(parsed.password),
        role: "customer",
        customerId: customer.id,
      },
    });

    await createAuditLog({
      userId: user.id,
      action: "auth.register",
      entityType: "user",
      entityId: user.id,
      metadata: { role: "customer" },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "Unable to register account");
  }
}
