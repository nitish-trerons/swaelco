"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

const ElevatorViewer = dynamic(() => import("@/components/marketing/elevator-viewer"), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full rounded-xl bg-slate-800 sm:h-[360px] md:h-[420px]" />,
});

export function LazyElevatorViewer() {
  return <ElevatorViewer />;
}
