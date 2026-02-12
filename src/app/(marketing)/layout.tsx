import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.2),transparent_34%),radial-gradient(circle_at_100%_20%,rgba(239,68,68,0.18),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.15),transparent_35%)]" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:34px_34px] opacity-30" />
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
