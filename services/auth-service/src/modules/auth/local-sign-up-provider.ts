import {Provider} from '@loopback/core';
import {type SignupTokenHandlerFn} from '@sourceloop/authentication-service';

export class SignupTokenHandlerProvider
  implements Provider<SignupTokenHandlerFn>
{
  value(): SignupTokenHandlerFn {
    return async dto => {
      try {
        // Extract necessary properties from the DTO
        const { code, expiry, email } = dto;


      } catch (error) {
        console.error('Error processing signup token:', error);
        throw error;
      }
    };
  }
}
