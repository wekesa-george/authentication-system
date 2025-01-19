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
import {TenantDomains} from '../models';
import {TenantDomainsRepository} from '../repositories';

export class TenantDomainsController {
  constructor(
    @repository(TenantDomainsRepository)
    public tenantDomainsRepository : TenantDomainsRepository,
  ) {}

  @post('/tenant-domains')
  @response(200, {
    description: 'TenantDomains model instance',
    content: {'application/json': {schema: getModelSchemaRef(TenantDomains)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantDomains, {
            title: 'NewTenantDomains',
            exclude: ['id'],
          }),
        },
      },
    })
    tenantDomains: Omit<TenantDomains, 'id'>,
  ): Promise<TenantDomains> {
    return this.tenantDomainsRepository.create(tenantDomains);
  }

  @get('/tenant-domains/count')
  @response(200, {
    description: 'TenantDomains model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TenantDomains) where?: Where<TenantDomains>,
  ): Promise<Count> {
    return this.tenantDomainsRepository.count(where);
  }

  @get('/tenant-domains')
  @response(200, {
    description: 'Array of TenantDomains model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TenantDomains, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TenantDomains) filter?: Filter<TenantDomains>,
  ): Promise<TenantDomains[]> {
    return this.tenantDomainsRepository.find(filter);
  }

  @patch('/tenant-domains')
  @response(200, {
    description: 'TenantDomains PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantDomains, {partial: true}),
        },
      },
    })
    tenantDomains: TenantDomains,
    @param.where(TenantDomains) where?: Where<TenantDomains>,
  ): Promise<Count> {
    return this.tenantDomainsRepository.updateAll(tenantDomains, where);
  }

  @get('/tenant-domains/{id}')
  @response(200, {
    description: 'TenantDomains model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TenantDomains, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(TenantDomains, {exclude: 'where'}) filter?: FilterExcludingWhere<TenantDomains>
  ): Promise<TenantDomains> {
    return this.tenantDomainsRepository.findById(id, filter);
  }

  @patch('/tenant-domains/{id}')
  @response(204, {
    description: 'TenantDomains PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TenantDomains, {partial: true}),
        },
      },
    })
    tenantDomains: TenantDomains,
  ): Promise<void> {
    await this.tenantDomainsRepository.updateById(id, tenantDomains);
  }

  @put('/tenant-domains/{id}')
  @response(204, {
    description: 'TenantDomains PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tenantDomains: TenantDomains,
  ): Promise<void> {
    await this.tenantDomainsRepository.replaceById(id, tenantDomains);
  }

  @del('/tenant-domains/{id}')
  @response(204, {
    description: 'TenantDomains DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tenantDomainsRepository.deleteById(id);
  }
}
