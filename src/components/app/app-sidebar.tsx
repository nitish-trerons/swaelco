"use client";

import type { Role } from "@prisma/client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/components/layout/brand-logo";
import { navForRole } from "@/components/app/nav-links";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function SidebarLinks({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname();
  const links = navForRole(role);

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-blue-500/20 text-blue-200"
                : "text-slate-300 hover:bg-slate-800 hover:text-white",
            )}
            onClick={onNavigate}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DesktopSidebar({ role }: { role: Role }) {
  return (
    <aside className="hidden border-r border-slate-800 bg-slate-950 md:block md:min-h-screen md:w-64">
      <div className="px-5 py-5">
        <BrandLogo subtitle="Operations" textClassName="text-base" subtitleClassName="text-[9px] text-blue-300" />
        <p className="text-xs text-slate-400">Elevator delivery workspace</p>
      </div>
      <div className="px-3 pb-8">
        <SidebarLinks role={role} />
      </div>
    </aside>
  );
}

export function MobileSidebar({ role }: { role: Role }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="border-slate-700 bg-transparent text-slate-100 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="border-slate-800 bg-slate-950 text-slate-100">
        <SheetHeader>
          <SheetTitle className="text-slate-100">SWAELCO Ops</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <SidebarLinks role={role} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
