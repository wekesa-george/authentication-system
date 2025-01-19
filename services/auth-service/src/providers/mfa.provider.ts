import {Provider} from '@loopback/context';
import {AuthUser, MfaCheckFn} from '@sourceloop/authentication-service';

export class MfaProvider implements Provider<MfaCheckFn> {
  value(): MfaCheckFn {
    return async (_user: AuthUser) => {
      return true
    };
  }
}
