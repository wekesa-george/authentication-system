

import { z } from 'zod';
export const configSchema = z.object({
  company_name: z.string().min(8,'Enter Valid Company Name'),
  company_logo: z
  .instanceof(File, { message: 'Please upload a file.'})
  .refine((f) => f.size < 3000_000, 'Max 3 MB upload size.'),
  country: z.string().min(3,'Select Country'),
  timezone: z.string().min(3,'Select Time Zone'),
  currency: z.string().min(3,'Select Time Zone'),
});
export type ConfigSchema = typeof configSchema;

