import {SoftCrudRepository} from 'loopback4-soft-delete';

import {Count, DataObject, Entity, Getter, Where} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Options} from 'loopback-datasource-juggler';
import {AuthErrorKeys} from 'loopback4-authentication';
import {AuthDbPgDataSource} from '../datasources';
import {UserModifiableEntity} from '../models';
import {AuthUser} from '../modules/auth';

export abstract class DefaultUserModifyCrudRepository<
  T extends UserModifiableEntity,
  ID,
  Relations extends object = {},
> extends SoftCrudRepository<T, ID, Relations> {
  constructor(
    entityClass: typeof Entity & {
      prototype: T;
    },
    dataSource: AuthDbPgDataSource,
    protected readonly getCurrentUser: Getter<AuthUser | undefined>,
  ) {
    super(entityClass, dataSource);
  }

  async create(entity: DataObject<T>, options?: Options): Promise<T> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    entity.createdBy = currentUser.userTenantId;
    entity.modifiedBy = currentUser.userTenantId;
    return super.create(entity, options);
  }
  async createSignup(entity: DataObject<T>, options?: Options): Promise<T> {

    return super.create(entity, options);
  }
  async createAll(entities: DataObject<T>[], options?: Options): Promise<T[]> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    entities.forEach((entity) => {
      entity.createdBy = currentUser ? currentUser.userTenantId : 0;
      entity.modifiedBy = currentUser ? currentUser.userTenantId : 0;
    });
    return super.createAll(entities, options);
  }

  async save(entity: T, options?: Options): Promise<T> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    entity.modifiedBy = currentUser.userTenantId;
    return super.save(entity, options);
  }

  async update(entity: T, options?: Options): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    entity.modifiedBy = currentUser.userTenantId;
    return super.update(entity, options);
  }

  async updateAll(
    data: DataObject<T>,
    where?: Where<T>,
    options?: Options,
  ): Promise<Count> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    data.modifiedBy = currentUser.userTenantId;
    return super.updateAll(data, where, options);
  }

  async updateById(
    id: ID,
    data: DataObject<T>,
    options?: Options,
  ): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    data.modifiedBy = currentUser.userTenantId;
    return super.updateById(id, data, options);
  }
  async replaceById(
    id: ID,
    data: DataObject<T>,
    options?: Options,
  ): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new HttpErrors.Forbidden(AuthErrorKeys.InvalidCredentials);
    }
    data.modifiedBy = currentUser.userTenantId;
    return super.replaceById(id, data, options);
  }
}
