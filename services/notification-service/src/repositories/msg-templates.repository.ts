import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDbDataSource} from '../datasources';
import {MsgTemplates, MsgTemplatesRelations} from '../models';

export class MsgTemplatesRepository extends DefaultCrudRepository<
  MsgTemplates,
  typeof MsgTemplates.prototype.id,
  MsgTemplatesRelations
> {
  constructor(
    @inject('datasources.postgres-db') dataSource: PostgresDbDataSource,
  ) {
    super(MsgTemplates, dataSource);
  }
}
