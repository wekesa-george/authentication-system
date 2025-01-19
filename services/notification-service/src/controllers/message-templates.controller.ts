import {OPERATION_SECURITY_SPEC} from '@loopback/authentication-jwt';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody
} from '@loopback/rest';
import {authenticateClient, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {MsgTemplates} from '../models';
import {PermissionKey} from '../modules/auth/permission-key.enum';
import {MsgTemplatesRepository} from '../repositories';

export class MessageTemplatesController {
  constructor(
    @repository(MsgTemplatesRepository)
    public msgTemplatesRepository : MsgTemplatesRepository,
  ) {}
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateMessageTemplate]})
  @post('/msg-templates',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200: {
        description: 'MsgTemplates model instance',
        content: {'application/json': {schema: getModelSchemaRef(MsgTemplates)}},
      }
    }
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MsgTemplates, {
            title: 'NewMsgTemplates',
            exclude: ['id'],
          }),
        },
      },
    })
    msgTemplates: Omit<MsgTemplates, 'id'>,
  ): Promise<MsgTemplates> {
    return this.msgTemplatesRepository.create(msgTemplates);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewAnyMessageTemplate]})
  @get('/msg-templates/count',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200: {
        description: 'MsgTemplates model count',
        content: {'application/json': {schema: CountSchema}},
      }
    }
  })
  async count(
    @param.where(MsgTemplates) where?: Where<MsgTemplates>,
  ): Promise<Count> {
    return this.msgTemplatesRepository.count(where);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewAnyMessageTemplate]})
  @get('/msg-templates',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200: {
        description: 'Array of MsgTemplates model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(MsgTemplates, {includeRelations: true}),
            },
          },
        },
      }
    }
  })
  async find(
    @param.filter(MsgTemplates) filter?: Filter<MsgTemplates>,
  ): Promise<MsgTemplates[]> {
    return this.msgTemplatesRepository.find(filter);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateAnyMessageTemplate,PermissionKey.UpdateOwnMessageTemplate]})
  @patch('/msg-templates',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200:{
        description: 'MsgTemplates PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      }
    }
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MsgTemplates, {partial: true}),
        },
      },
    })
    msgTemplates: MsgTemplates,
    @param.where(MsgTemplates) where?: Where<MsgTemplates>,
  ): Promise<Count> {
    return this.msgTemplatesRepository.updateAll(msgTemplates, where);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewAnyMessageTemplate]})
  @get('/msg-templates/{id}',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200: {
        description: 'MsgTemplates model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(MsgTemplates, {includeRelations: true}),
          },
        },
      }
    }
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MsgTemplates, {exclude: 'where'}) filter?: FilterExcludingWhere<MsgTemplates>
  ): Promise<MsgTemplates> {
    return this.msgTemplatesRepository.findById(id, filter);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateAnyMessageTemplate]})
  @patch('/msg-templates/{id}',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      204: {
        description: 'MsgTemplates PATCH success',
      }
    }
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MsgTemplates, {partial: true}),
        },
      },
    })
    msgTemplates: MsgTemplates,
  ): Promise<void> {
    await this.msgTemplatesRepository.updateById(id, msgTemplates);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateAnyMessageTemplate]})
  @put('/msg-templates/{id}',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200:{
        description: 'MsgTemplates PUT success',
      }
    }
  })

  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() msgTemplates: MsgTemplates,
  ): Promise<void> {
    await this.msgTemplatesRepository.replaceById(id, msgTemplates);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.DeleteAnyMessage]})
  @del('/msg-templates/{id}',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      204:{
        description: 'MsgTemplates DELETE success',
      }
    }
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.msgTemplatesRepository.deleteById(id);
  }
}
