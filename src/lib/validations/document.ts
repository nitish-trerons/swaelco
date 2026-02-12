import { z } from "zod";

import { DOCUMENT_TYPES } from "@/lib/constants";

export const documentSchema = z.object({
  projectId: z.string().cuid(),
  name: z.string().min(2),
  url: z.string().min(1),
  type: z.enum(DOCUMENT_TYPES),
});

export type DocumentInput = z.infer<typeof documentSchema>;
