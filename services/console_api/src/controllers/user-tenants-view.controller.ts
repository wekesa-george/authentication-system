import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {UserTenantsExtended} from '../models';
import {UserTenantsExtendedRepository} from '../repositories';

export class UserTenantsViewController {
  constructor(
    @repository(UserTenantsExtendedRepository)
    public userTenantsExtendedRepository : UserTenantsExtendedRepository,
  ) {}

  @post('/user-tenants-extendeds')
  @response(200, {
    description: 'UserTenantsExtended model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserTenantsExtended)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenantsExtended, {
            title: 'NewUserTenantsExtended',
            exclude: ['userTenantId'],
          }),
        },
      },
    })
    userTenantsExtended: Omit<UserTenantsExtended, 'userTenantId'>,
  ): Promise<UserTenantsExtended> {
    return this.userTenantsExtendedRepository.create(userTenantsExtended);
  }

  @get('/user-tenants-extendeds/count')
  @response(200, {
    description: 'UserTenantsExtended model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserTenantsExtended) where?: Where<UserTenantsExtended>,
  ): Promise<Count> {
    return this.userTenantsExtendedRepository.count(where);
  }

  @get('/user-tenants-extendeds')
  @response(200, {
    description: 'Array of UserTenantsExtended model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserTenantsExtended, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserTenantsExtended) filter?: Filter<UserTenantsExtended>,
  ): Promise<UserTenantsExtended[]> {
    return this.userTenantsExtendedRepository.find(filter);
  }

  @patch('/user-tenants-extendeds')
  @response(200, {
    description: 'UserTenantsExtended PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenantsExtended, {partial: true}),
        },
      },
    })
    userTenantsExtended: UserTenantsExtended,
    @param.where(UserTenantsExtended) where?: Where<UserTenantsExtended>,
  ): Promise<Count> {
    return this.userTenantsExtendedRepository.updateAll(userTenantsExtended, where);
  }

  @get('/user-tenants-extendeds/{id}')
  @response(200, {
    description: 'UserTenantsExtended model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserTenantsExtended, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(UserTenantsExtended, {exclude: 'where'}) filter?: FilterExcludingWhere<UserTenantsExtended>
  ): Promise<UserTenantsExtended> {
    return this.userTenantsExtendedRepository.findById(id, filter);
  }

  @patch('/user-tenants-extendeds/{id}')
  @response(204, {
    description: 'UserTenantsExtended PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenantsExtended, {partial: true}),
        },
      },
    })
    userTenantsExtended: UserTenantsExtended,
  ): Promise<void> {
    await this.userTenantsExtendedRepository.updateById(id, userTenantsExtended);
  }

  @put('/user-tenants-extendeds/{id}')
  @response(204, {
    description: 'UserTenantsExtended PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userTenantsExtended: UserTenantsExtended,
  ): Promise<void> {
    await this.userTenantsExtendedRepository.replaceById(id, userTenantsExtended);
  }

  @del('/user-tenants-extendeds/{id}')
  @response(204, {
    description: 'UserTenantsExtended DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userTenantsExtendedRepository.deleteById(id);
  }
}
