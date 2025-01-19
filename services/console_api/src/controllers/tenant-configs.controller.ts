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
import {TenantConfigs} from '../models';
import {TenantConfigsRepository} from '../repositories';

export class TenantConfigsController {
  constructor(
    @repository(TenantConfigsRepository)
    public tenantConfigsRepository : TenantConfigsRepository,
  ) {}

  @post('/tenant-configs')
  @response(200, {
    description: 'TenantConfigs model instance',
    content: {'application/json': {schema: getModelSchemaRef(TenantConfigs)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantConfigs, {
            title: 'NewTenantConfigs',
            exclude: ['id'],
          }),
        },
      },
    })
    tenantConfigs: Omit<TenantConfigs, 'id'>,
  ): Promise<TenantConfigs> {
    return this.tenantConfigsRepository.create(tenantConfigs);
  }

  @get('/tenant-configs/count')
  @response(200, {
    description: 'TenantConfigs model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TenantConfigs) where?: Where<TenantConfigs>,
  ): Promise<Count> {
    return this.tenantConfigsRepository.count(where);
  }

  @get('/tenant-configs')
  @response(200, {
    description: 'Array of TenantConfigs model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TenantConfigs, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TenantConfigs) filter?: Filter<TenantConfigs>,
  ): Promise<TenantConfigs[]> {
    return this.tenantConfigsRepository.find(filter);
  }

  @patch('/tenant-configs')
  @response(200, {
    description: 'TenantConfigs PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantConfigs, {partial: true}),
        },
      },
    })
    tenantConfigs: TenantConfigs,
    @param.where(TenantConfigs) where?: Where<TenantConfigs>,
  ): Promise<Count> {
    return this.tenantConfigsRepository.updateAll(tenantConfigs, where);
  }

  @get('/tenant-configs/{id}')
  @response(200, {
    description: 'TenantConfigs model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TenantConfigs, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(TenantConfigs, {exclude: 'where'}) filter?: FilterExcludingWhere<TenantConfigs>
  ): Promise<TenantConfigs> {
    return this.tenantConfigsRepository.findById(id, filter);
  }

  @patch('/tenant-configs/{id}')
  @response(204, {
    description: 'TenantConfigs PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantConfigs, {partial: true}),
        },
      },
    })
    tenantConfigs: TenantConfigs,
  ): Promise<void> {
    await this.tenantConfigsRepository.updateById(id, tenantConfigs);
  }

  @put('/tenant-configs/{id}')
  @response(204, {
    description: 'TenantConfigs PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tenantConfigs: TenantConfigs,
  ): Promise<void> {
    await this.tenantConfigsRepository.replaceById(id, tenantConfigs);
  }

  @del('/tenant-configs/{id}')
  @response(204, {
    description: 'TenantConfigs DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tenantConfigsRepository.deleteById(id);
  }
}
