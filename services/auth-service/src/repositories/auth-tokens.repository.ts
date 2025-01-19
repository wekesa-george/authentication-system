import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {AuthTokens, AuthTokensRelations} from '../models';
import { AuthDbSourceName } from '@sourceloop/authentication-service';
export class AuthTokensRepository extends DefaultCrudRepository<
  AuthTokens,
  typeof AuthTokens.prototype.id,
  AuthTokensRelations
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: PostgresDataSource,
  ) {
    super(AuthTokens, dataSource); 
  }
}
