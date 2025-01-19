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
import {UserTenants} from '../models';
import {UserTenantsRepository} from '../repositories';

export class UserTenantsController {
  constructor(
    @repository(UserTenantsRepository)
    public userTenantsRepository : UserTenantsRepository,
  ) {}

  @post('/user-tenants')
  @response(200, {
    description: 'UserTenants model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserTenants)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenants, {
            title: 'NewUserTenants',
            exclude: ['id'],
          }),
        },
      },
    })
    userTenants: Omit<UserTenants, 'id'>,
  ): Promise<UserTenants> {
    return this.userTenantsRepository.create(userTenants);
  }

  @get('/user-tenants/count')
  @response(200, {
    description: 'UserTenants model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserTenants) where?: Where<UserTenants>,
  ): Promise<Count> {
    return this.userTenantsRepository.count(where);
  }

  @get('/user-tenants')
  @response(200, {
    description: 'Array of UserTenants model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserTenants, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserTenants) filter?: Filter<UserTenants>,
  ): Promise<UserTenants[]> {
    return this.userTenantsRepository.find(filter);
  }

  @patch('/user-tenants')
  @response(200, {
    description: 'UserTenants PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenants, {partial: true}),
        },
      },
    })
    userTenants: UserTenants,
    @param.where(UserTenants) where?: Where<UserTenants>,
  ): Promise<Count> {
    return this.userTenantsRepository.updateAll(userTenants, where);
  }

  @get('/user-tenants/{id}')
  @response(200, {
    description: 'UserTenants model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserTenants, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserTenants, {exclude: 'where'}) filter?: FilterExcludingWhere<UserTenants>
  ): Promise<UserTenants> {
    return this.userTenantsRepository.findById(id, filter);
  }

  @patch('/user-tenants/{id}')
  @response(204, {
    description: 'UserTenants PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTenants, {partial: true}),
        },
      },
    })
    userTenants: UserTenants,
  ): Promise<void> {
    await this.userTenantsRepository.updateById(id, userTenants);
  }

  @put('/user-tenants/{id}')
  @response(204, {
    description: 'UserTenants PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userTenants: UserTenants,
  ): Promise<void> {
    await this.userTenantsRepository.replaceById(id, userTenants);
  }

  @del('/user-tenants/{id}')
  @response(204, {
    description: 'UserTenants DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userTenantsRepository.deleteById(id);
  }
}
