import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDbPgDataSource} from '../datasources';
import {UserTenantsExtended, UserTenantsExtendedRelations} from '../models';

export class UserTenantsExtendedRepository extends DefaultCrudRepository<
  UserTenantsExtended,
  typeof UserTenantsExtended.prototype.userTenantId,
  UserTenantsExtendedRelations
> {
  constructor(
    @inject('datasources.auth-db-pg') dataSource: AuthDbPgDataSource,
  ) {
    super(UserTenantsExtended, dataSource);
  }
}
