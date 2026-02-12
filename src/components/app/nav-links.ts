import type { Role } from "@prisma/client";
import { Building2, ClipboardList, LayoutDashboard, Settings, Users, Wrench } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

const allItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: ClipboardList },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/buildings", label: "Buildings", icon: Building2 },
  { href: "/tasks", label: "Tasks", icon: Wrench },
  { href: "/profile", label: "Profile", icon: Settings },
];

export function navForRole(role: Role) {
  if (role === "admin" || role === "project_manager") {
    return allItems;
  }

  if (role === "technician") {
    return allItems.filter((item) => ["/dashboard", "/projects", "/tasks", "/profile"].includes(item.href));
  }

  return allItems.filter((item) => ["/dashboard", "/projects", "/tasks", "/profile"].includes(item.href));
}
