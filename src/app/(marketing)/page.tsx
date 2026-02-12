import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { LazyElevatorViewer } from "@/components/marketing/lazy-elevator-viewer";
import { QuickEstimator } from "@/components/marketing/quick-estimator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    title: "New Elevator Installation",
    description: "Traction and hydraulic systems built for commercial reliability.",
    icon: Building2,
  },
  {
    title: "Modernization",
    description: "Controller upgrades, energy savings, and passenger-experience improvements.",
    icon: Wrench,
  },
  {
    title: "Safety & Compliance",
    description: "Code-driven inspections and certifications with full audit trails.",
    icon: ShieldCheck,
  },
];

const processSteps = [
  "Site assessment and engineering survey",
  "Code and permit coordination",
  "Install or modernization execution",
  "Safety testing and handover",
];

const proofStats = [
  { label: "Avg. downtime reduction", value: "28%" },
  { label: "On-time project delivery", value: "96%" },
  { label: "Certified field technicians", value: "42" },
  { label: "Buildings serviced", value: "300+" },
];

export default function HomePage() {
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="container relative space-y-10 py-16 lg:py-24">
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge className="border border-blue-300/30 bg-blue-500/10 text-blue-100">
                Trusted by high-rise operators and facilities teams
              </Badge>
              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
                Elevator Projects That Look Premium, Run Safer, and Deliver On Schedule.
              </h1>
              <p className="max-w-3xl text-lg text-slate-300">
                SWAELCO combines field execution with transparent customer-facing workflows so you can plan
                installation and modernization without hidden risk or unclear timelines.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-red-500 text-white hover:bg-red-400">
                  <Link href="/contact">Request a Quote</Link>
                </Button>
                <Button asChild variant="outline" className="border-blue-300/35 bg-blue-500/10 text-blue-100 hover:bg-blue-500/20">
                  <Link href="/contact">Book Inspection</Link>
                </Button>
                <Button asChild variant="ghost" className="text-slate-100 hover:bg-slate-800">
                  <Link href="/services">
                    Explore Services <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {proofStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-slate-900/70 p-3 shadow-[0_12px_35px_-25px_rgba(37,99,235,0.55)]"
                >
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-3 shadow-[0_30px_80px_-40px_rgba(37,99,235,0.6)] sm:p-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(96,165,250,0.28),transparent_46%),radial-gradient(circle_at_80%_100%,rgba(248,113,113,0.2),transparent_48%)]" />
              <div className="relative rounded-xl border border-white/10 bg-slate-950/50 p-2 sm:p-3">
                <LazyElevatorViewer />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mt-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <QuickEstimator />

        <Card className="border-white/10 bg-slate-900/75">
          <CardHeader>
            <CardTitle className="text-white">Customer Portal Value</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
              <p className="flex items-center gap-2 font-semibold text-slate-100"><BarChart3 className="h-4 w-4 text-blue-300" /> Real-time project status</p>
              <p className="mt-1">Design, installation, inspection, and handover progress visible without email chains.</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
              <p className="flex items-center gap-2 font-semibold text-slate-100"><ClipboardCheck className="h-4 w-4 text-blue-300" /> Document center</p>
              <p className="mt-1">Permits, blueprints, and reports available in one secure workspace.</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
              <p className="flex items-center gap-2 font-semibold text-slate-100"><BadgeCheck className="h-4 w-4 text-blue-300" /> Compliance confidence</p>
              <p className="mt-1">Clear audit logs and signed milestones for internal and regulatory reviews.</p>
            </div>
            <Button asChild variant="outline" className="w-full border-blue-300/35 bg-blue-500/10 text-blue-100 hover:bg-blue-500/20">
              <Link href="/login">Preview Customer Portal</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section id="services" className="container mt-20 space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-300">Services</p>
          <h2 className="text-3xl font-bold text-white">Built For Long-Term Building Performance</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.title}
              className="group border-white/10 bg-slate-900/75 transition-all duration-200 hover:-translate-y-1 hover:border-blue-300/40 hover:shadow-[0_20px_45px_-30px_rgba(37,99,235,0.7)]"
            >
              <CardHeader>
                <service.icon className="h-6 w-6 text-blue-300" />
                <CardTitle className="text-white">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mt-20 grid gap-8 lg:grid-cols-2">
        <Card className="border-white/10 bg-slate-900/75">
          <CardHeader>
            <CardTitle className="text-white">Industries Served</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            {[
              "Commercial towers",
              "Hospitals and healthcare",
              "Hotels and mixed-use",
              "Industrial campuses",
              "Public transit hubs",
              "University facilities",
            ].map((industry) => (
              <p key={industry} className="rounded-md border border-slate-700/90 bg-slate-950/60 px-3 py-2">
                {industry}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-900/75">
          <CardHeader>
            <CardTitle className="text-white">Implementation Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {processSteps.map((step) => (
              <div key={step} className="flex items-start gap-3 rounded-md border border-slate-700/90 bg-slate-950/60 px-3 py-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-300" />
                <p className="text-sm text-slate-300">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="container mt-20 grid gap-4 md:grid-cols-2">
        <Card className="border-white/10 bg-slate-900/75">
          <CardHeader>
            <CardTitle className="text-white">Case Study: Harbor Center</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>Replaced 4 legacy units with destination dispatch controls, reducing average wait time by 28%.</p>
            <p className="rounded-md border border-red-300/30 bg-red-500/10 px-3 py-2 text-red-100">
              Outcome: tenant satisfaction scores increased after modernization phase.
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-slate-900/75">
          <CardHeader>
            <CardTitle className="text-white">Certifications & Safety</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>OSHA-aligned procedures, state-certified inspections, and documented commissioning checklists.</p>
            <p className="rounded-md border border-blue-300/30 bg-blue-500/10 px-3 py-2 text-blue-100">
              Documentation format aligned for facility, insurer, and regulator review.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
