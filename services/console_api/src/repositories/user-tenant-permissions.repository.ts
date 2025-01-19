import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDbPgDataSource} from '../datasources';
import {UserTenantPermissions, UserTenantPermissionsRelations} from '../models';

export class UserTenantPermissionsRepository extends DefaultCrudRepository<
  UserTenantPermissions,
  typeof UserTenantPermissions.prototype.id,
  UserTenantPermissionsRelations
> {
  constructor(
    @inject('datasources.auth-db-pg') dataSource: AuthDbPgDataSource,
  ) {
    super(UserTenantPermissions, dataSource);
  }
}
