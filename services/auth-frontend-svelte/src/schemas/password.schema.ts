import { z } from 'zod';

export const newPwdSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[\W_]/, { message: "Password must contain at least one special character" }),
  confirm_password: z.string().min(1, { message: "Please Confirm Password" }),
}).refine(data => data.password === data.confirm_password, {
  path: ['confirm_password'],
  message: "Passwords do not match",
});