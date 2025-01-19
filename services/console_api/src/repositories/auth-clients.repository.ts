import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthDbPgDataSource} from '../datasources';
import {AuthClients, AuthClientsRelations} from '../models';

export class AuthClientsRepository extends DefaultCrudRepository<
  AuthClients,
  typeof AuthClients.prototype.id,
  AuthClientsRelations
> {
  constructor(
    @inject('datasources.auth-db-pg') dataSource: AuthDbPgDataSource,
  ) {
    super(AuthClients, dataSource);
  }
}
