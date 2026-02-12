import type { Role } from "@prisma/client";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  project_manager: "Project Manager",
  technician: "Technician",
  customer: "Customer",
};

export function canAccessRole(userRole: Role, allowed: Role[]) {
  return allowed.includes(userRole);
}

export function canManageRecords(role: Role) {
  return role === "admin" || role === "project_manager";
}

export function canViewProject(role: Role, projectCustomerId: string, customerId?: string | null) {
  if (role === "admin" || role === "project_manager") return true;
  if (role === "customer") return customerId === projectCustomerId;
  return role === "technician";
}

export function canViewTask(role: Role, assignedToUserId?: string | null, currentUserId?: string) {
  if (role === "admin" || role === "project_manager") return true;
  if (role === "technician") return assignedToUserId === currentUserId;
  return false;
}
