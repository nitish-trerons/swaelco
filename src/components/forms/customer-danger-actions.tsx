"use client";

import { Loader2, Trash2, UserX2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function CustomerDangerActions({ customerId }: { customerId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  async function runDelete(anonymize: boolean) {
    setIsPending(true);

    const response = await fetch(`/api/customers/${customerId}?anonymize=${anonymize}`, {
      method: "DELETE",
    });

    setIsPending(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({ message: "Failed to delete" }));
      toast({ variant: "destructive", title: "Action failed", description: data.message });
      return;
    }

    toast({
      title: anonymize ? "Customer anonymized" : "Customer archived",
    });

    router.push("/customers");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="border-slate-700 bg-transparent text-slate-100">
            <Trash2 className="mr-2 h-4 w-4" />
            Soft Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="border-slate-800 bg-slate-950 text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Archive customer?</AlertDialogTitle>
            <AlertDialogDescription>
              The customer will be hidden from standard views but data remains recoverable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => runDelete(false)} disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <UserX2 className="mr-2 h-4 w-4" />
            Anonymize
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="border-slate-800 bg-slate-950 text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Anonymize customer data?</AlertDialogTitle>
            <AlertDialogDescription>
              This replaces contact details and marks the record as deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => runDelete(true)} disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Anonymize"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
