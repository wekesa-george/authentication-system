import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDbDataSource} from '../datasources';
import {MessagesPerChannel, MessagesPerChannelRelations} from '../models';

export class MessagesPerChannelRepository extends DefaultCrudRepository<
  MessagesPerChannel,
  typeof MessagesPerChannel.prototype.id,
  MessagesPerChannelRelations
> {
  constructor(
    @inject('datasources.postgres-db') dataSource: PostgresDbDataSource,
  ) {
    super(MessagesPerChannel, dataSource);
  }
}
