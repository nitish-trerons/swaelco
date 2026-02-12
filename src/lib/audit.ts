import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function createAuditLog(input: {
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Prisma.InputJsonValue;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata,
      },
    });
  } catch (error) {
    console.error("audit.log_failed", error);
  }
}
