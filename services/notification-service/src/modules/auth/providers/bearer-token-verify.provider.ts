import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';

import {User} from '../../../models/user.model';
import {RevokedTokenRepository} from '../../../repositories';
import {AuthenticateErrorKeys} from '../error-keys';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn>
{
  constructor(
    @repository(RevokedTokenRepository)
    public revokedTokenRepository: RevokedTokenRepository,
  ) {}

  value(): VerifyFunction.BearerFn {
    return async (token: string) => {
      if (token && (await this.revokedTokenRepository.get(token))) {
        throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.TokenRevoked);
      }
      const user = verify(token, process.env.JWT_SECRET as string, {
        issuer: process.env.JWT_ISSUER,
      }) as User;
      return user;
    };
  }
}
