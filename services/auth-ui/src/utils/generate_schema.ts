import { z } from 'zod';
export const generateSchema  = (config:any) =>{
    const specialCharRegex = new RegExp(`[!@#$%^&*(),.?":{}|<>]`);
    const upperCaseRegex = new RegExp(`[A-Z]`);
    const letterAndNumberRegex = new RegExp(`^(?=.*[a-zA-Z])(?=.*[0-9])`);
  
    let passwordSchema: any = z.string().min(config.minLength, `Password must be at least ${config.minLength} characters long`);
  
    if (config.specialCharaters > 0) {
      passwordSchema = passwordSchema.refine(
        (value: any) => (value.match(specialCharRegex) || []).length >= config.specialCharaters,
        `Password must contain at least ${config.specialCharaters} special character(s)`
      );
    }
  
    if (config.minUpperCaseCharacters > 0) {
      passwordSchema = passwordSchema.refine(
        (value: any) => (value.match(upperCaseRegex) || []).length >= config.minUpperCaseCharacters,
        `Password must contain at least ${config.minUpperCaseCharacters} uppercase letter(s)`
      );
    }
  
    if (config.lettersAndCharacters) {
      passwordSchema = passwordSchema.refine(
        (value: any) => letterAndNumberRegex.test(value),
        `Password must contain both letters and numbers`
      );
    }
  
    return z.object({
      password: passwordSchema,
      confirm_password: passwordSchema
    });
  }


