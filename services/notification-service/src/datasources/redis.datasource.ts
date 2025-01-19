import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import 'dotenv/config';
import * as config from './redis.datasource.config.json';

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class RedisDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'redis';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.Redis', {optional: true})
    dsConfig: object = {...config},
  ) {
    Object.assign(dsConfig, {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DATABASE,
      url: process.env.REDIS_URL,
    });
    super(dsConfig);
  }
}
