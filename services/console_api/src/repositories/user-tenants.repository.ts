import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDbPgDataSource} from '../datasources';
import {UserTenants, UserTenantsRelations} from '../models';

export class UserTenantsRepository extends DefaultCrudRepository<
  UserTenants,
  typeof UserTenants.prototype.id,
  UserTenantsRelations
> {
  constructor(
    @inject('datasources.auth-db-pg') dataSource: AuthDbPgDataSource,
  ) {
    super(UserTenants, dataSource);
  }
}
