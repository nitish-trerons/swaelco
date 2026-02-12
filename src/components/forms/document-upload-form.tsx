"use client";

import { Loader2, Upload } from "lucide-react";
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
import { DOCUMENT_TYPES } from "@/lib/constants";

export function DocumentUploadForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [type, setType] = useState<(typeof DOCUMENT_TYPES)[number]>("contract");
  const [file, setFile] = useState<File | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function onSubmit() {
    if (!file) {
      toast({ variant: "destructive", title: "Please select a file" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);
    formData.append("type", type);

    setIsPending(true);

    const response = await fetch("/api/documents/upload", {
      method: "POST",
      body: formData,
    });

    setIsPending(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({ message: "Upload failed" }));
      toast({ variant: "destructive", title: "Upload failed", description: data.message });
      return;
    }

    toast({ title: "Document uploaded" });
    setFile(null);
    router.refresh();
  }

  return (
    <div className="space-y-3 rounded-md border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-sm font-medium text-slate-100">Upload document</p>
      <Select value={type} onValueChange={(value) => setType(value as (typeof DOCUMENT_TYPES)[number])}>
        <SelectTrigger>
          <SelectValue placeholder="Document type" />
        </SelectTrigger>
        <SelectContent>
          {DOCUMENT_TYPES.map((item) => (
            <SelectItem key={item} value={item}>
              {item.replaceAll("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input
        type="file"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        className="block w-full text-sm text-slate-200 file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
      />
      <Button onClick={onSubmit} disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" /> Upload
          </>
        )}
      </Button>
    </div>
  );
}
