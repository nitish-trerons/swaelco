import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.24),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(239,68,68,0.16),_transparent_36%)]" />
      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-6 inline-flex text-sm text-slate-300 hover:text-white">
          ← Back to site
        </Link>
        {children}
      </div>
    </div>
  );
}
