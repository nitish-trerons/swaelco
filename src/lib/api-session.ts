import type { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { canAccessRole } from "@/lib/rbac";

export async function requireApiSession(allowedRoles?: Role[]) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  if (allowedRoles && !canAccessRole(session.user.role, allowedRoles)) {
    return {
      response: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    session,
  };
}
