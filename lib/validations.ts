import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number")
    .regex(/^[+()\d\s-]+$/, "Enter a valid phone number"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  role: z.enum(["TENANT", "LANDLORD"], { error: "Please select a role" }),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\d\s-]+$/, "Enter a valid phone number")
    // Count digits rather than characters so "++++++++++" is rejected.
    .refine(
      (value) => (value.match(/\d/g)?.length ?? 0) >= 10,
      "Enter a valid phone number",
    ),
});

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be at most 50 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
