
import { z } from 'zod';
const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
export const loginEmailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8,'Enter your password')
});
export type LoginEmailSchema = typeof loginEmailSchema;


export const loginTelnoSchema = z.object({
  telno: z.string().regex(phoneRegex,'Invalid Number'),
  password: z.string().min(8,'Enter your password')
});

export type LoginTelnoSchema = typeof loginTelnoSchema;
