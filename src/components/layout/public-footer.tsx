import { ArrowRight, Building, ShieldCheck, Wrench } from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand-logo";
import { Button } from "@/components/ui/button";

export function PublicFooter() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(59,130,246,0.2),transparent_40%),radial-gradient(circle_at_100%_100%,rgba(239,68,68,0.16),transparent_42%)]" />

      <div className="container relative space-y-10 py-14">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">Ready To Upgrade Vertical Mobility?</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Book a no-obligation site review this week.</h3>
            <p className="mt-2 text-sm text-slate-300">
              Get a compliance-aware scope with budget bands and timeline assumptions.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 lg:mt-0">
            <Button asChild className="bg-red-500 text-white hover:bg-red-400">
              <Link href="/contact">
                Get Proposal <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-blue-300/40 bg-blue-500/10 text-blue-100 hover:bg-blue-500/20">
              <a href="tel:+15559811200">Emergency Hotline</a>
            </Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <BrandLogo subtitle="Elevator Systems" />
            <p className="mt-2 text-sm text-slate-300">
              Installation, modernization, and maintenance programs for high-demand buildings.
            </p>
            <div className="mt-4 space-y-2 text-xs text-slate-400">
              <p>Bhubaneswar, Odisha · On-site and remote program support</p>
              <p>support@swaelco.com</p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-300">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Services</p>
            <p className="flex items-center gap-2"><Building className="h-4 w-4 text-blue-300" /> New installations</p>
            <p className="flex items-center gap-2"><Wrench className="h-4 w-4 text-blue-300" /> Modernization</p>
            <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-300" /> Safety inspections</p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Company</p>
            <Link href="/services" className="block text-slate-300 hover:text-white">Services</Link>
            <Link href="/about" className="block text-slate-300 hover:text-white">About</Link>
            <Link href="/contact" className="block text-slate-300 hover:text-white">Contact</Link>
            <Link href="/login" className="block text-blue-300 hover:text-blue-200">Customer Portal</Link>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 text-xs text-slate-500">
          © {new Date().getFullYear()} SWAELCO Elevators. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
