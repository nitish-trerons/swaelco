"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export function ProjectCommentForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [value, setValue] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function submitComment() {
    if (!value.trim()) {
      return;
    }

    setIsPending(true);

    const response = await fetch(`/api/projects/${projectId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: value.trim() }),
    });

    setIsPending(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({ message: "Unable to save note" }));
      toast({ variant: "destructive", title: "Error", description: data.message });
      return;
    }

    setValue("");
    toast({ title: "Note added" });
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Add a project note"
        className="min-h-24"
      />
      <Button onClick={submitComment} disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting
          </>
        ) : (
          "Post Note"
        )}
      </Button>
    </div>
  );
}
