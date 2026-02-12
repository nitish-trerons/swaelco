import { Metadata } from "next";
import { BadgeCheck, FileCheck2, ShieldCheck, TimerReset } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
};

const principles = [
  { title: "Safety-first", icon: ShieldCheck, desc: "Risk-controlled execution in each phase from survey to handover." },
  { title: "Documentation-led", icon: FileCheck2, desc: "Every milestone leaves an auditable trail for operations teams." },
  { title: "Schedule accountability", icon: TimerReset, desc: "Transparent timelines and early escalation when constraints appear." },
  { title: "Client confidence", icon: BadgeCheck, desc: "Clear updates so customers always know project status and next steps." },
];

export default function AboutPage() {
  return (
    <div className="container grid gap-6 py-16 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">About SWAELCO</p>
        <h1 className="text-4xl font-black tracking-tight text-white">Field-Driven Elevator Teams With Enterprise Discipline</h1>
        <p className="text-slate-300">
          SWAELCO is an elevator installation and modernization partner focused on safety, delivery reliability,
          and long-term maintenance outcomes for commercial infrastructure.
        </p>
        <p className="text-slate-300">
          Our teams blend project engineering, field execution, and compliance management so owners and facility
          operators get predictable timelines and transparent reporting.
        </p>
      </div>

      <Card className="border-white/10 bg-slate-900/75">
        <CardHeader>
          <CardTitle className="text-white">Operating Principles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          {principles.map((item) => (
            <div key={item.title} className="rounded-md border border-slate-700/90 bg-slate-950/60 p-3">
              <p className="flex items-center gap-2 font-semibold text-slate-100">
                <item.icon className="h-4 w-4 text-blue-300" /> {item.title}
              </p>
              <p className="mt-1">{item.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
