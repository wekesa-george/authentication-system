import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDbPgDataSource} from '../datasources';
import {UserIdCounter, UserIdCounterRelations} from '../models';

export class UserIdCounterRepository extends DefaultCrudRepository<
  UserIdCounter,
  typeof UserIdCounter.prototype.id,
  UserIdCounterRelations
> {
  constructor(
    @inject('datasources.auth-db-pg') dataSource: AuthDbPgDataSource,
  ) {
    super(UserIdCounter, dataSource);
  }
}
