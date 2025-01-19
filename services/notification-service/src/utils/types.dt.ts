
export interface Message {
    tenantId?: number;
    receiver: string;
    sender: string,
    payload: Payload;
    config: Config
  }
  export interface TplPayload{
    config:Config
    emailHTML:string
    name: string
  }
export interface Config{
    banner: string,
    title: string,
    facebook: string,
    twitter: string,
    instgram: string,
    infoEmail: string,
  }

  export interface Payload{
    from:string,
    name:string,
    to_email: string
    subject: string,
    emailHTML:string
  }