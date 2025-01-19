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
import {Tenants} from '../models';
import {TenantsRepository} from '../repositories';

export class TenantsController {
  constructor(
    @repository(TenantsRepository)
    public tenantsRepository : TenantsRepository,
  ) {}

  @post('/tenants')
  @response(200, {
    description: 'Tenants model instance',
    content: {'application/json': {schema: getModelSchemaRef(Tenants)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tenants, {
            title: 'NewTenants',
            exclude: ['id'],
          }),
        },
      },
    })
    tenants: Omit<Tenants, 'id'>,
  ): Promise<Tenants> {
    return this.tenantsRepository.create(tenants);
  }

  @get('/tenants/count')
  @response(200, {
    description: 'Tenants model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Tenants) where?: Where<Tenants>,
  ): Promise<Count> {
    return this.tenantsRepository.count(where);
  }

  @get('/tenants')
  @response(200, {
    description: 'Array of Tenants model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Tenants, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Tenants) filter?: Filter<Tenants>,
  ): Promise<Tenants[]> {
    return this.tenantsRepository.find(filter);
  }

  @patch('/tenants')
  @response(200, {
    description: 'Tenants PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tenants, {partial: true}),
        },
      },
    })
    tenants: Tenants,
    @param.where(Tenants) where?: Where<Tenants>,
  ): Promise<Count> {
    return this.tenantsRepository.updateAll(tenants, where);
  }

  @get('/tenants/{id}')
  @response(200, {
    description: 'Tenants model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Tenants, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Tenants, {exclude: 'where'}) filter?: FilterExcludingWhere<Tenants>
  ): Promise<Tenants> {
    return this.tenantsRepository.findById(id, filter);
  }

  @patch('/tenants/{id}')
  @response(204, {
    description: 'Tenants PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tenants, {partial: true}),
        },
      },
    })
    tenants: Tenants,
  ): Promise<void> {
    await this.tenantsRepository.updateById(id, tenants);
  }

  @put('/tenants/{id}')
  @response(204, {
    description: 'Tenants PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tenants: Tenants,
  ): Promise<void> {
    await this.tenantsRepository.replaceById(id, tenants);
  }

  @del('/tenants/{id}')
  @response(204, {
    description: 'Tenants DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tenantsRepository.deleteById(id);
  }
}
