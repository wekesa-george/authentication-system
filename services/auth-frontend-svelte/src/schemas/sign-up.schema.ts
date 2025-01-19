
import { z } from 'zod';
const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
const password = new RegExp(
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()])(?=.*[0-9]).{8}$/
)
const fullnameRegex = new RegExp(/^[A-Za-z]+(?:\s[A-Za-z]+)+$/);
export const signUpEmailSchema = z.object({
  email: z.string().email(),
  fullname: z.string().min(5,'Enter your Full Name').regex(fullnameRegex,"Invalid Name")
})
export type SignUpSchema = typeof signUpEmailSchema;


export const signUpTelnoSchema = z.object({
  telno: z.string().regex(phoneRegex,'Invalid Number'),
  fullname: z.string().min(5,'Enter your Full Name')
});

export type SignUpTelnoSchema = typeof signUpTelnoSchema;
