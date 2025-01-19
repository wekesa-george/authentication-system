import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDbPgDataSource} from '../datasources';
import {OldUserCredentials, OldUserCredentialsRelations} from '../models';

export class OldUserCredentialsRepository extends DefaultCrudRepository<
  OldUserCredentials,
  typeof OldUserCredentials.prototype.id,
  OldUserCredentialsRelations
> {
  constructor(
    @inject('datasources.auth-db-pg') dataSource: AuthDbPgDataSource,
  ) {
    super(OldUserCredentials, dataSource);
  }
}
