// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, Provider, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {AuthClient, AuthenticationBindings, ForgotPasswordHandlerFn, TenantConfigRepository, UserTenantRepository} from '@sourceloop/authentication-service';
import {ConfigKey} from '@sourceloop/core';
import {AuthUtilitiesService} from '../../services/authUtils.service';
import {accountCreation} from '../../utils/password-tkn';
import {RabbitmqBindings, RabbitmqProducer} from '../rabbit-mq';

export class ForgotPasswordProvider
  implements Provider<ForgotPasswordHandlerFn> {
  constructor(
    @service(AuthUtilitiesService)
    public authUtils: AuthUtilitiesService,
    @inject(RabbitmqBindings.RABBITMQ_PRODUCER)
    private rabbitmqProducer: RabbitmqProducer,
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    private readonly client: AuthClient | undefined,
    @repository(TenantConfigRepository)
    private tenantCfgRepo: TenantConfigRepository,
    @repository(UserTenantRepository)
    private userTenantRepo: UserTenantRepository,
  ) { }
  value(): ForgotPasswordHandlerFn {
    return async dto => {
      let user: any = dto.user;


      if (!user || !this.client) {
        throw new Error('Internal Server Error');
      }
      let tenancy: any = await this.tenantCfgRepo.findOne({
        where: {
          tenantId: user.defaultTenantId,
          configKey: ConfigKey.Profile
        }
      })

      if (!tenancy) {
        throw new Error('Internal Server Error');
      }
      const userTenancy = await this.userTenantRepo.findOne({
        where: {
          tenantId: user.defaultTenantId,
          userId: user.id
        }
      });


      if (!userTenancy) {
        throw new Error('Internal Server Error');
      }
      const {token, activation_token} = await this.authUtils.generateToken(user.email, userTenancy.id ?? '', this.client.clientId, 'activation', 'email', null);

      const htmlBody = accountCreation({
        token
      });
      // send Token through Notifications

      await this.rabbitmqProducer.publish(
        'messaging.direct',
        'tenant.sendgrid',
        Buffer.from(JSON.stringify({
          sender: tenancy?.configValue.title,
          receiver: `${user.firstName} ${user.lastName}`,
          tenantId: user.defaultTenantId,
          config: tenancy?.configValue.mailConfig,
          payload: {
            name: `${user.firstName} ${user.lastName}`,
            to_email: user.email,
            subject: 'Forgot Password',
            from: tenancy?.configValue.mailConfig.sender,
            emailHTML: htmlBody
          },
        })),
      );
console.log(token);
      return {
        code: dto.code,
        activation_token,
        email: user.email
      }
    };
  }
}
