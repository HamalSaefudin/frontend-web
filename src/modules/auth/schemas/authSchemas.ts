import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username Wajib Diisi"),
  password: z.string().min(1, "Password Wajib Diisi"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;