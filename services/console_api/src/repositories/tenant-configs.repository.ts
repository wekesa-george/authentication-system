import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDbPgDataSource} from '../datasources';
import {TenantConfigs, TenantConfigsRelations} from '../models';

export class TenantConfigsRepository extends DefaultCrudRepository<
  TenantConfigs,
  typeof TenantConfigs.prototype.id,
  TenantConfigsRelations
> {
  constructor(
    @inject('datasources.auth-db-pg') dataSource: AuthDbPgDataSource,
  ) {
    super(TenantConfigs, dataSource);
  }
}
