
import { z } from 'zod';
const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
export const email = z.object({
  email: z.string().email()
});
export type Email = typeof email;


export const telno = z.object({
  telno: z.string().regex(phoneRegex,'Invalid Number')
});

export type Telno = typeof telno;
