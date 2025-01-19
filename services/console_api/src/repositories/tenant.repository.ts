import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDbPgDataSource} from '../datasources';
import {Tenant, TenantRelations} from '../models';

export class TenantRepository extends DefaultCrudRepository<
  Tenant,
  typeof Tenant.prototype.id,
  TenantRelations
> {
  constructor(
    @inject('datasources.auth-db-pg') dataSource: AuthDbPgDataSource,
  ) {
    super(Tenant, dataSource);
  }
}
