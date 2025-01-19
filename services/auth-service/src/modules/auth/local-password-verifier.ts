// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthenticateErrorKeys, UserStatus} from '@sourceloop/core';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';
import { Otp } from '@sourceloop/authentication-service';

import {
  OtpRepository,
  UserTenantRepository,
} from '@sourceloop/authentication-service';
import { UserRepositoryNew } from './user.repository';
import {AuthUser} from '@sourceloop/authentication-service';
export class LocalPasswordVerifyProvider
  implements Provider<VerifyFunction.LocalPasswordFn>
{
  constructor(
    @repository(UserRepositoryNew)
    public userRepository: UserRepositoryNew,
    @repository(UserTenantRepository)
    public utRepository: UserTenantRepository,
    @repository(OtpRepository)
    public otpRepository: OtpRepository,
  ) {}

  value(): VerifyFunction.LocalPasswordFn {
    return async (username: string, password: string) => {
      try {
        const user: AuthUser = new AuthUser(
          await this.userRepository.verifyPassword(username, password),
        );
        user.permissions = [];
        return user;
      } catch (error) {
        const otp: Otp = await this.otpRepository.get(username);
        if (!otp || otp.otp !== password) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
        }
        const user = await this.userRepository.findOne({
          where: {username},
        });
        if (!user) {
          throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientUserMissing);
        }

        const userTenant = await this.utRepository.findOne({
          where: {
            userId: user.id,
            tenantId: user.defaultTenantId,
            status: {
              nin: [UserStatus.REJECTED, UserStatus.INACTIVE],
            },
          },
        });
        if (!userTenant) {
          throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserInactive);
        }
        const retUser = new AuthUser(user);
        retUser.permissions = [];
        return retUser;
      }
    };
  }
}
