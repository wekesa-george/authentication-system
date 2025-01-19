import {BindingScope, injectable} from '@loopback/core';
import {InfisicalSDK} from '@infisical/sdk';

@injectable({scope: BindingScope.TRANSIENT})
export class InfisicalService {
  private client: InfisicalSDK;

  constructor() {
    this.client = new InfisicalSDK({
      siteUrl: process.env.INFISCAL_SERVICE_URL, // Optional, defaults to https://app.infisical.com
    });
  }

  async login() {
    // Authenticate with Infisical
    await this.client.auth().universalAuth.login({
      clientId: process.env.INF_CLIENT_ID??'',
      clientSecret: process.env.INF_CLIENT_SECRET??'',
    });
  }

  async getSecrets(environment: string, projectId: string):Promise<any> {
    // Ensure we are authenticated
    await this.login();

    // Fetch all secrets for a specific environment and project
    const secrets = await this.client.secrets().listSecrets({
      environment,
      projectId,
    });

    return secrets;
  }
}
