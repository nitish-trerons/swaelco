import { z } from "zod";

import { PROJECT_STATUSES, PROJECT_TYPES } from "@/lib/constants";

export const projectSchema = z.object({
  customerId: z.string().cuid(),
  buildingId: z.string().cuid(),
  name: z.string().min(2),
  type: z.enum(PROJECT_TYPES),
  status: z.enum(PROJECT_STATUSES).default("inquiry"),
  budget: z.number().int().nonnegative().optional().nullable(),
  actualCost: z.number().int().nonnegative().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const projectPatchSchema = projectSchema.partial();

export const projectCommentSchema = z.object({
  body: z.string().min(2).max(1000),
  parentId: z.string().cuid().optional().nullable(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
