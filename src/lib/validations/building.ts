import { z } from "zod";

export const buildingSchema = z.object({
  customerId: z.string().cuid(),
  name: z.string().min(2),
  address: z.string().min(5),
  floors: z.number().int().min(1).max(200),
  notes: z.string().optional().nullable(),
});

export const buildingPatchSchema = buildingSchema.partial();

export type BuildingInput = z.infer<typeof buildingSchema>;
