import {Getter, inject} from '@loopback/core';
import {
  DataObject,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {Options} from '@loopback/repository/src/common-types';
import {HttpErrors} from '@loopback/rest';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import {AuthErrorKeys, AuthenticationBindings} from 'loopback4-authentication';
import {AuthDbPgDataSource} from '../datasources';
import {User, UserCredentials, UserRelations} from '../models';
import {AuthUser} from '../modules/auth';
import {AuthenticateErrorKeys} from '../modules/auth/error-keys';
import {DefaultUserModifyCrudRepository} from './default-user-modify-crud.repository.base';
import {UserCredentialsRepository} from './user-credentials.repository';

export class UserRepository extends DefaultUserModifyCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly credentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;
  constructor(
    @inject('datasources.AuthDbPg') dataSource: AuthDbPgDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<AuthUser | undefined>,
    @repository.getter('UserCredentialsRepository')
    getUserCredsRepository: Getter<UserCredentialsRepository>,
  ) {
    super(User, dataSource, getCurrentUser);

  }

  private readonly saltRounds = 10;

  async create(entity: DataObject<User>, options?: Options): Promise<User> {
    const user = await super.create(entity, options);
    try {
      // Add temporary password for first time
      console.log(process.env.USER_TEMP_PASSWORD);
      const password = await bcrypt.hash(
        process.env.USER_TEMP_PASSWORD as string,
        this.saltRounds,
      );
      const creds = new UserCredentials({
        authProvider: 'internal',
        password: password,

      });
      await this.credentials(user.id).create(creds);
    } catch (err) {

      throw new HttpErrors.UnprocessableEntity('Error while hashing password');
    }
    return user;
  }
  async createSignUp(entity: DataObject<User>, options?: Options): Promise<User> {
    const user = await super.createSignup(entity, options);

    try {
      // Add temporary password for first time
      const password = await bcrypt.hash(
        process.env.USER_TEMP_PASSWORD as string,
        this.saltRounds,
      );
      const creds = new UserCredentials({
        authProvider: 'internal',
        password: password,

      });
      await this.credentials(user.id).create(creds,options);

    } catch (err) {

      throw new HttpErrors.UnprocessableEntity('Error while hashing password');
    }
    return user;
  }

  async createGoogleUser(entity: DataObject<User>,profileId: string, options?: Options): Promise<User> {
    const user = await super.create(entity, options);
    try {
      // Add temporary password for first time
      const password = await bcrypt.hash(
        process.env.USER_TEMP_PASSWORD as string,
        this.saltRounds,
      );
      const creds = new UserCredentials({
        authProvider: 'google',
        password: password,
        authId:profileId
      });
      await this.credentials(user.id).create(creds);
    } catch (err) {
      console.log(err);
      throw new HttpErrors.UnprocessableEntity('Error while hashing password');
    }
    return user;
  }
async findByEmail(email: string){
  const user = await super.findOne({where: {email}});
  return user;
}
  async verifyPassword(username: string, password: string): Promise<User> {
    const user = await super.findOne({where: {username}});
    const creds = user && (await this.credentials(user.id).get());
    if (!user || user.deleted || !creds || !creds.password) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserDoesNotExist);
    } else if (!(await bcrypt.compare(password, creds.password))) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
    } else if (
      await bcrypt.compare(password, process.env.USER_TEMP_PASSWORD!)
    ) {
      throw new HttpErrors.Forbidden(
        AuthenticateErrorKeys.TempPasswordLoginDisallowed,
      );
    }
    return user;
  }

  async updatePassword(
    username: string,
    password: string,
    newPassword: string,
  ): Promise<User> {
    const user = await super.findOne({where: {username}});
    const creds = user && (await this.credentials(user.id).get());
    if (!user || user.deleted || !creds || !creds.password) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.UserDoesNotExist);
    } else if (!(await bcrypt.compare(password, creds.password))) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.WrongPassword);
    } else if (await bcrypt.compare(newPassword, creds.password)) {
      throw new HttpErrors.Unauthorized(
        'Password cannot be same as previous password!',
      );
    }
    await this.credentials(user.id).patch({
      password: await bcrypt.hash(newPassword, this.saltRounds),
    });
    return user;
  }
}
