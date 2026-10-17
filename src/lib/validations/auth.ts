import { z } from "zod";

export const emailField = z
  .string()
  .trim()
  .min(1, "Enter your work email.")
  .pipe(z.email({ message: "Enter a valid email address, like name@school.edu.in." }));

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Enter your password."),
  remember: z.boolean().optional(),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const resetRequestSchema = z.object({
  email: emailField,
});

export type ResetRequestValues = z.infer<typeof resetRequestSchema>;
