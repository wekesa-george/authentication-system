import {TokenService} from '@loopback/authentication';
import {injectable} from '@loopback/core';
import {UserProfile} from '@loopback/security';
import {sign, verify} from 'jsonwebtoken';

@injectable()
export class SignupTokenService implements TokenService {
  async generateToken(userProfile: UserProfile): Promise<any> {
    const token = sign(userProfile,  process.env.JWT_PRIVATE_KEY??'', {
      expiresIn: '1h',
    });
    return {
      code:token,
      expires:1000000,
      email:userProfile.email
    };
  }

  async verifyToken(token: string): Promise<UserProfile|any> {
    try {
      const userProfile = verify(token,  process.env.JWT_PRIVATE_KEY??'' );
      return userProfile as UserProfile;
    } catch (error) {
      return undefined;
    }
  }
}
