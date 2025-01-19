
import { z } from 'zod';

export const activationSchema = z.object({
  token: z.string().min(1,'Token is required'),
  activation_code:z.string()
});
export type ActivationSchema = typeof activationSchema;


