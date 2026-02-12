import { z } from "zod";

import { TASK_STATUSES } from "@/lib/constants";

export const taskSchema = z.object({
  projectId: z.string().cuid(),
  assignedToUserId: z.string().cuid().optional().nullable(),
  title: z.string().min(2).max(200),
  description: z.string().max(1000).optional().nullable(),
  scheduledFor: z.string().datetime().optional().nullable(),
  status: z.enum(TASK_STATUSES).default("pending"),
});

export const taskPatchSchema = taskSchema.partial();

export type TaskInput = z.infer<typeof taskSchema>;
