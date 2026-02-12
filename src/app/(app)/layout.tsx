import { redirect } from "next/navigation";

import { DesktopSidebar } from "@/components/app/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { getCurrentSession } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 md:grid md:grid-cols-[16rem_1fr]">
      <DesktopSidebar role={session.user.role} />
      <div className="flex min-h-screen flex-col">
        <AppTopbar role={session.user.role} name={session.user.name} email={session.user.email} />
        <main className="flex-1 px-4 py-5 md:px-6">{children}</main>
      </div>
    </div>
  );
}
