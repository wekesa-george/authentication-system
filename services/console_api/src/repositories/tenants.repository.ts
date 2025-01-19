import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDbPgDataSource} from '../datasources';
import {Tenants, TenantsRelations} from '../models';

export class TenantsRepository extends DefaultCrudRepository<
  Tenants,
  typeof Tenants.prototype.id,
  TenantsRelations
> {
  constructor(
    @inject('datasources.auth-db-pg') dataSource: AuthDbPgDataSource,
  ) {
    super(Tenants, dataSource);
  }
}
