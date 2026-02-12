"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Clock3, IndianRupee, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

const PROJECT_FACTORS = {
  new_installation: { label: "New Installation", timelineBase: 10 },
  modernization: { label: "Modernization", timelineBase: 7 },
  repair: { label: "Repair / Corrective", timelineBase: 3 },
} as const;

const COST_PROFILES = {
  new_installation: { carBaseInr: 1_600_000, perFloorInr: 200_000 },
  modernization: { carBaseInr: 1_100_000, perFloorInr: 130_000 },
  repair: { carBaseInr: 550_000, perFloorInr: 75_000 },
} as const;

type ProjectKind = keyof typeof PROJECT_FACTORS;

export function QuickEstimator() {
  const [projectKind, setProjectKind] = useState<ProjectKind>("modernization");
  const [floors, setFloors] = useState(4);
  const [cars, setCars] = useState(1);
  const [urgency, setUrgency] = useState("standard");

  const estimate = useMemo(() => {
    const factor = PROJECT_FACTORS[projectKind];
    const cost = COST_PROFILES[projectKind];
    const urgencyMultiplier = urgency === "rush" ? 1.08 : urgency === "planned" ? 0.95 : 1;
    const extraFloors = Math.max(0, floors - 1);

    const base = (cost.carBaseInr + extraFloors * cost.perFloorInr) * cars;
    const total = Math.round(base * urgencyMultiplier);
    const low = Math.round(total * 0.9);
    const high = Math.round(total * 1.1);
    const weeks = Math.max(2, Math.round(factor.timelineBase + floors / 5 + cars * 1.8));

    return { low, high, weeks };
  }, [projectKind, floors, cars, urgency]);

  return (
    <Card className="border-blue-300/25 bg-slate-900/85 shadow-[0_18px_50px_-25px_rgba(37,99,235,0.7)]">
      <CardHeader>
        <CardTitle className="text-white">Quick Budget & Timeline Estimator</CardTitle>
        <p className="text-sm text-slate-300">Use this as a planning baseline before a formal on-site survey.</p>
        <p className="text-xs text-blue-200">Reference: New 4-floor (G+3), 1-car installation is typically around ₹20-24 lakh.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Project Type</p>
            <Select value={projectKind} onValueChange={(value) => setProjectKind(value as ProjectKind)}>
              <SelectTrigger className="border-slate-700 bg-slate-950/70 text-slate-100">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROJECT_FACTORS).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Urgency</p>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger className="border-slate-700 bg-slate-950/70 text-slate-100">
                <SelectValue placeholder="Choose urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planned (90+ days)</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="rush">Rush</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
              <span>Floors serviced</span>
              <span className="font-semibold text-white">{floors}</span>
            </div>
            <input
              type="range"
              min={2}
              max={20}
              step={1}
              value={floors}
              onChange={(event) => setFloors(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-blue-500"
              aria-label="Floors serviced"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
              <span>Elevator cars</span>
              <span className="font-semibold text-white">{cars}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={cars}
              onChange={(event) => setCars(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-red-500"
              aria-label="Elevator cars"
            />
          </div>
        </div>

        <div className="grid gap-3 rounded-xl border border-white/10 bg-slate-950/80 p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-400">Estimated budget band</p>
            <p className="mt-1 text-sm font-semibold text-white">{formatCurrency(estimate.low)} - {formatCurrency(estimate.high)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Indicative timeline</p>
            <p className="mt-1 text-sm font-semibold text-white">{estimate.weeks} weeks</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Program fit</p>
            <p className="mt-1 text-sm font-semibold text-white">{PROJECT_FACTORS[projectKind].label}</p>
          </div>
        </div>

        <div className="grid gap-2 text-xs text-slate-300 sm:grid-cols-3">
          <p className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5 text-blue-300" /> Budget-aligned scopes</p>
          <p className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5 text-blue-300" /> Delivery windows by phase</p>
          <p className="flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-blue-300" /> Code and safety review included</p>
        </div>

        <Button asChild className="w-full bg-red-500 text-white hover:bg-red-400">
          <a href="/contact">
            Get a Formal Proposal <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
