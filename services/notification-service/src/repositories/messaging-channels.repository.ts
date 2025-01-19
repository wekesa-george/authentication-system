import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDbDataSource} from '../datasources';
import {MessagingChannels, MessagingChannelsRelations} from '../models';

export class MessagingChannelsRepository extends DefaultCrudRepository<
  MessagingChannels,
  typeof MessagingChannels.prototype.id,
  MessagingChannelsRelations
> {
  constructor(
    @inject('datasources.postgres-db') dataSource: PostgresDbDataSource,
  ) {
    super(MessagingChannels, dataSource);
  }
}
