import type { Prisma, Role } from "@prisma/client";

export type SessionUser = {
  id: string;
  role: Role;
  customerId?: string | null;
};

export function projectWhereForUser(user: SessionUser): Prisma.ProjectWhereInput {
  if (user.role === "admin" || user.role === "project_manager") {
    return {};
  }

  if (user.role === "customer") {
    return {
      customerId: user.customerId ?? "",
    };
  }

  return {
    tasks: {
      some: {
        assignedToUserId: user.id,
      },
    },
  };
}

export function customerWhereForUser(user: SessionUser): Prisma.CustomerWhereInput {
  if (user.role === "admin" || user.role === "project_manager") {
    return { isDeleted: false };
  }

  if (user.role === "customer") {
    return {
      id: user.customerId ?? "",
      isDeleted: false,
    };
  }

  return {
    projects: {
      some: {
        tasks: {
          some: {
            assignedToUserId: user.id,
          },
        },
      },
    },
    isDeleted: false,
  };
}

export function taskWhereForUser(user: SessionUser): Prisma.TaskWhereInput {
  if (user.role === "admin" || user.role === "project_manager") {
    return {};
  }

  if (user.role === "technician") {
    return {
      assignedToUserId: user.id,
    };
  }

  return {
    project: {
      customerId: user.customerId ?? "",
    },
  };
}
