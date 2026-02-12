"use client";

import { usePathname } from "next/navigation";

import { MobileSidebar } from "@/components/app/app-sidebar";
import { UserMenu } from "@/components/app/user-menu";
import { ROLE_LABELS } from "@/lib/rbac";
import type { Role } from "@prisma/client";

const labels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/customers": "Customers",
  "/buildings": "Buildings",
  "/tasks": "Tasks",
  "/profile": "Profile",
};

export function AppTopbar({
  role,
  name,
  email,
}: {
  role: Role;
  name?: string | null;
  email?: string | null;
}) {
  const pathname = usePathname();
  const currentLabel = Object.entries(labels).find(([route]) => pathname.startsWith(route))?.[1] ?? "Workspace";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MobileSidebar role={role} />
          <div>
            <p className="text-sm text-slate-400">{ROLE_LABELS[role]}</p>
            <p className="text-lg font-semibold text-white">{currentLabel}</p>
          </div>
        </div>
        <UserMenu name={name} email={email} />
      </div>
    </header>
  );
}
