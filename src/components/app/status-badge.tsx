import { Badge } from "@/components/ui/badge";

export function ProjectStatusBadge({ status }: { status: string }) {
  const mapped = {
    inquiry: "secondary",
    quoted: "secondary",
    approved: "default",
    in_progress: "default",
    inspection: "secondary",
    completed: "outline",
  } as const;

  const label = status.replaceAll("_", " ");

  return <Badge variant={mapped[status as keyof typeof mapped] ?? "outline"}>{label}</Badge>;
}

export function TaskStatusBadge({ status }: { status: string }) {
  const mapped = {
    pending: "secondary",
    in_progress: "default",
    done: "outline",
    cancelled: "destructive",
  } as const;

  return <Badge variant={mapped[status as keyof typeof mapped] ?? "outline"}>{status.replaceAll("_", " ")}</Badge>;
}
