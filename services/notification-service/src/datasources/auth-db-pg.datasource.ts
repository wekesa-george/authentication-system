import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import 'dotenv/config';
import * as config from './auth-db-pg.datasource.config.json';

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class AuthDbPgDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'AuthDbPg';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.AuthDbPg', {optional: true})
    dsConfig: object = {...config},
  ) {
    Object.assign(dsConfig, {
      host: process.env.AUTH_DB_HOST,
      port: process.env.AUTH_DB_PORT,
      user: process.env.AUTH_DB_USER,
      password: process.env.AUTH_DB_PASSWORD,
      database: process.env.AUTH_DB_DATABASE,
      schema: process.env.AUTH_DB_SCHEMA,
    });
    super(dsConfig);
  }
}
