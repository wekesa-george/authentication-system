import {hasOne, model, property} from '@loopback/repository';
import {IAuthUser} from 'loopback4-authentication';
import {
  UserCredentials,
  UserCredentialsWithRelations,
} from './user-credentials.model';
import {UserModifiableEntity} from './user-modifiable-entity.model';

@model({
  name: 'users',
})
export class User extends UserModifiableEntity implements IAuthUser {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;
  @property({
    type: 'string',
    postgresql: {columnName: 'email_verified', dataType: 'character', dataPrecision: null, dataScale: null, nullable: 'YES', generated: undefined},
  })
  emailVerified?: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'phone_verified', dataType: 'character', dataPrecision: null, dataScale: null, nullable: 'YES', generated: undefined},
  })
  phoneVerified?: string;

  @property({
    type: 'object',
    postgresql: {columnName: 'other_info', dataType: 'jsonb', dataPrecision: null, dataScale: null, nullable: 'YES', generated: undefined},
  })
  otherInfo?: object;

  @property({
    type: 'string',
    required: true,
    name: 'first_name',
  })
  firstName: string;

  @property({
    type: 'string',
    name: 'last_name',
  })
  lastName: string;

  @property({
    type: 'string',
    name: 'middle_name',
  })
  middleName?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @property({
    type: 'number',
    name: 'default_tenant',
  })
  defaultTenant: number;

  @property({
    type: 'date',
    name: 'last_login',
    postgresql: {
      column: 'last_login',
    },
  })
  lastLogin?: string;

  @hasOne(() => UserCredentials, {keyTo: 'userId'})
  credentials: UserCredentials;

  constructor(data?: Partial<User>) {
    super(data);
  }
  getIdentifier(): string | undefined {
    return this.id?.toString();
  }
}

export interface UserRelations {
  credentials: UserCredentialsWithRelations;
}

export type UserWithRelations = User & UserRelations;
