import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDbPgDataSource} from '../datasources';
import {AuthTokens, AuthTokensRelations} from '../models';

export class AuthTokensRepository extends DefaultCrudRepository<
  AuthTokens,
  typeof AuthTokens.prototype.id,
  AuthTokensRelations
> {
  constructor(
    @inject('datasources.auth-db-pg') dataSource: AuthDbPgDataSource,
  ) {
    super(AuthTokens, dataSource);
  }
}
