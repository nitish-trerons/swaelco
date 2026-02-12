import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Provide a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Name is required."),
  companyName: z.string().min(2, "Company name is required."),
  email: z.string().email("Provide a valid email."),
  phone: z.string().min(7, "Phone number is required."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password needs one uppercase letter.")
    .regex(/[a-z]/, "Password needs one lowercase letter.")
    .regex(/[^A-Za-z0-9]/, "Password needs one symbol."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
