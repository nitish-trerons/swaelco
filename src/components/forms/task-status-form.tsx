"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { TASK_STATUSES } from "@/lib/constants";

export function TaskStatusForm({
  taskId,
  currentStatus,
}: {
  taskId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState(currentStatus);
  const [isPending, setIsPending] = useState(false);

  async function onUpdate() {
    setIsPending(true);

    const response = await fetch("/api/tasks", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: taskId, status }),
    });

    setIsPending(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({ message: "Unable to update task" }));
      toast({ variant: "destructive", title: "Update failed", description: data.message });
      return;
    }

    toast({ title: "Task updated" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[170px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {TASK_STATUSES.map((item) => (
            <SelectItem key={item} value={item}>
              {item.replaceAll("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" onClick={onUpdate} disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
          </>
        ) : (
          "Update"
        )}
      </Button>
    </div>
  );
}
