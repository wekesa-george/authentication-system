import { property } from "@loopback/repository";
import { User } from "@sourceloop/authentication-service";

export interface AuthToken {
  token: string
  activation_token:string
}

export interface PasswordToken {
  token: string
  password_token:string
}

export class UserEmailToken extends User {
  @property({
    type: 'string'
  })
  activation_token: string;
}

export interface tenantOtherInfo{
  "title": string
  "colors": any
  "logoUrl": string
  "faviconUrl": string
  "termsOfUse": string
  "enableSignUp": boolean
  "enableOTPLogin": boolean
  "enableMobileLogin": boolean
  "enableSocialLogin": boolean
  "enableMobileSignUp": boolean
  "mailConfig": {
    "sender": string
    "banner": string
    "title": string
    "facebook": string
    "twitter": string
    "instgram": string
    "infoEmail": string
  }
}
