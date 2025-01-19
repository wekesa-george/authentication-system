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
import {AuthClients} from '../models';
import {AuthClientsRepository} from '../repositories';

export class AuthClientsController {
  constructor(
    @repository(AuthClientsRepository)
    public authClientsRepository : AuthClientsRepository,
  ) {}

  @post('/auth-clients')
  @response(200, {
    description: 'AuthClients model instance',
    content: {'application/json': {schema: getModelSchemaRef(AuthClients)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AuthClients, {
            title: 'NewAuthClients',
            exclude: ['id'],
          }),
        },
      },
    })
    authClients: Omit<AuthClients, 'id'>,
  ): Promise<AuthClients> {
    return this.authClientsRepository.create(authClients);
  }

  @get('/auth-clients/count')
  @response(200, {
    description: 'AuthClients model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(AuthClients) where?: Where<AuthClients>,
  ): Promise<Count> {
    return this.authClientsRepository.count(where);
  }

  @get('/auth-clients')
  @response(200, {
    description: 'Array of AuthClients model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AuthClients, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(AuthClients) filter?: Filter<AuthClients>,
  ): Promise<AuthClients[]> {
    return this.authClientsRepository.find(filter);
  }

  @patch('/auth-clients')
  @response(200, {
    description: 'AuthClients PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AuthClients, {partial: true}),
        },
      },
    })
    authClients: AuthClients,
    @param.where(AuthClients) where?: Where<AuthClients>,
  ): Promise<Count> {
    return this.authClientsRepository.updateAll(authClients, where);
  }

  @get('/auth-clients/{id}')
  @response(200, {
    description: 'AuthClients model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AuthClients, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(AuthClients, {exclude: 'where'}) filter?: FilterExcludingWhere<AuthClients>
  ): Promise<AuthClients> {
    return this.authClientsRepository.findById(id, filter);
  }

  @patch('/auth-clients/{id}')
  @response(204, {
    description: 'AuthClients PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AuthClients, {partial: true}),
        },
      },
    })
    authClients: AuthClients,
  ): Promise<void> {
    await this.authClientsRepository.updateById(id, authClients);
  }

  @put('/auth-clients/{id}')
  @response(204, {
    description: 'AuthClients PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() authClients: AuthClients,
  ): Promise<void> {
    await this.authClientsRepository.replaceById(id, authClients);
  }

  @del('/auth-clients/{id}')
  @response(204, {
    description: 'AuthClients DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.authClientsRepository.deleteById(id);
  }
}
