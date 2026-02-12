import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional().nullable(),
  billingAddress: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const customerPatchSchema = customerSchema.partial();

export type CustomerInput = z.infer<typeof customerSchema>;
