import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDbPgDataSource} from '../datasources';
import {TenantDomains, TenantDomainsRelations} from '../models';

export class TenantDomainsRepository extends DefaultCrudRepository<
  TenantDomains,
  typeof TenantDomains.prototype.id,
  TenantDomainsRelations
> {
  constructor(
    @inject('datasources.auth-db-pg') dataSource: AuthDbPgDataSource,
  ) {
    super(TenantDomains, dataSource);
  }
}
