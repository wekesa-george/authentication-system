import {TokenService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';

/**
 * Binding keys used by this component.
 */
export namespace SignupTokenServiceBindings {
  /**
   * Binding key for the Signup Token Service
   */
  export const SIGNUP_TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.signup.token.service',
  );
}
