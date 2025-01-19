
import {inject, Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {OtpSenderFn, TenantConfigRepository, User} from '@sourceloop/authentication-service';
import {ConfigKey} from '@sourceloop/core';
import {RabbitmqBindings, RabbitmqProducer} from '../modules/rabbit-mq';
import {tfaTpl} from '../utils/tfa';
export class OtpSenderProvider implements Provider<OtpSenderFn> {
  constructor(
    @repository(TenantConfigRepository)
    private tenantConfigRepository: TenantConfigRepository,
    @inject(RabbitmqBindings.RABBITMQ_PRODUCER)
    private rabbitmqProducer: RabbitmqProducer,
  ) { }
  value(): OtpSenderFn {
    return async (_otp: string, _user: User) => {

      const tenantCfg: any = await this.tenantConfigRepository.findOne({
        where: {
          tenantId: _user.defaultTenantId,
          configKey: ConfigKey.Profile
        }
      })
      if (!tenantCfg?.configValue) {
        throw new HttpErrors.BadRequest("Invalid Tenancy ID");
      }

      const htmlBody = tfaTpl({
        token: _otp
      });

      // send Token through Notifications


      await this.rabbitmqProducer.publish(
        'messaging.direct',
        'tenant.sendgrid',
        Buffer.from(JSON.stringify({
          sender: tenantCfg?.configValue.title,
          receiver: `${_user.firstName} ${_user.lastName}`,
          tenantId: _user.defaultTenantId,
          config: tenantCfg?.configValue.mailConfig,
          payload: {
            name: `${_user.firstName} ${_user.lastName}`,
            to_email: _user.email,
            subject: 'OTP Token',
            from: tenantCfg?.configValue.mailConfig.sender,
            emailHTML: htmlBody
          },
        })),
      );

      console.log(_otp)

    };
  }
}
