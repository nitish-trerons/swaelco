import { Metadata } from "next";
import { ArrowRight, Building2, Cog, HardHat, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Services",
};

const offerings = [
  {
    title: "New Installation",
    description: "Engineering, shaft planning, commissioning, and handover for passenger and freight systems.",
    icon: Building2,
  },
  {
    title: "Modernization",
    description: "Controller, cabin, and door upgrades that improve uptime, comfort, and energy profile.",
    icon: Cog,
  },
  {
    title: "Maintenance Programs",
    description: "Preventive schedules with transparent service records and escalation workflows.",
    icon: HardHat,
  },
  {
    title: "Safety & Audit Support",
    description: "Inspection prep, corrective actions, and evidence-grade documentation packages.",
    icon: ShieldCheck,
  },
];

export default function ServicesPage() {
  return (
    <div className="container space-y-10 py-16">
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">Service Portfolio</p>
        <h1 className="text-4xl font-black tracking-tight text-white">Programs Built for Uptime and Compliance</h1>
        <p className="text-slate-300">
          We align field delivery with facilities operations so you can forecast downtime, budget clearly, and
          maintain confidence with tenants and regulators.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {offerings.map((offering) => (
          <Card key={offering.title} className="border-white/10 bg-slate-900/75">
            <CardHeader>
              <offering.icon className="h-6 w-6 text-blue-300" />
              <CardTitle className="text-white">{offering.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <p>{offering.description}</p>
              <p className="rounded-md border border-slate-700/90 bg-slate-950/60 px-3 py-2">
                Includes customer portal visibility and milestone reporting.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-2xl border border-red-300/25 bg-red-500/10 p-5">
        <p className="text-sm text-red-100">
          Need a detailed scope now? We can produce a proposal with budget bands, timeline assumptions, and safety checkpoints.
        </p>
        <Button asChild className="mt-3 bg-red-500 text-white hover:bg-red-400">
          <Link href="/contact">
            Request Service Scope <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
