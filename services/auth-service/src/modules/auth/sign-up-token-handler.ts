import {Provider} from '@loopback/context';
import {AnyObject, repository} from '@loopback/repository';
import {AuthClient, LocalUserProfileDto, SignupRequest} from '@sourceloop/authentication-service';
import {Gender} from '@sourceloop/core';
import {UserRepositoryNew} from './user.repository';
interface SignUpUser extends SignupRequest {
  id?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  username: string;
  authClientIds?: string;
  designation?: string;
  dob: Date;
  gender?: Gender;
  defaultTenantId: string;
  password: string;
}
type UserSignupFn<T, S> = (model: T & LocalUserProfileDto, tokenInfo: AnyObject, transaction: any, client: AuthClient | null) => Promise<S>;
export class LocalSignupProviderClass implements Provider<UserSignupFn<any, any>> {
  constructor(
    @repository(UserRepositoryNew)
    public userRepository: UserRepositoryNew,
  ) { }
  value(): UserSignupFn<any, any> {
    return async (userProfile: any, tokenInfo: AnyObject, transaction: any, client: AuthClient | null): Promise<any> => {
      // Example logic to handle user signup
      // Normally, you would hash the password, create the user in the database, and return the user profile

      userProfile.username = userProfile.email;
      let newUser = {...userProfile};
      newUser.authClientIds = `{${client?.id}}`;
      delete newUser.password
      delete newUser.clientId
      delete newUser.client_secret

      try {


        const user = await this.userRepository.createWithoutPassword(newUser, {transaction})
        if (!user) {
          throw new Error('Unable to create User');
        }
        // Mock logic: Return the same profile for now

        const createdUser = user as any;

        return createdUser;
      } catch (error) {

        throw new Error(error.message);
      }

      // const cred = await this.userRepository.updatePassword(user.username,'my_temp_password',userProfile.password)


    };
  }
}
