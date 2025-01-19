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
import {Messages} from '../models';
import {PermissionKey} from '../modules/auth/permission-key.enum';
import {MessagesRepository} from '../repositories';

export class MessagesController {
  constructor(
    @repository(MessagesRepository)
    public messagesRepository : MessagesRepository,
  ) {}
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateAnyMessage]})
  @post('/messages',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200: {
        description: 'Messages model instance',
        content: {'application/json': {schema: getModelSchemaRef(Messages)}},
      }
    }
  })

  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Messages, {
            title: 'NewMessages',
            exclude: ['id'],
          }),
        },
      },
    })
    messages: Omit<Messages, 'id'>,
  ): Promise<Messages> {
    return this.messagesRepository.create(messages);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewAnyMessage]})
  @get('/messages/count',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200:{
        description: 'Messages model count',
        content: {'application/json': {schema: CountSchema}},
      }
    }
  })

  async count(
    @param.where(Messages) where?: Where<Messages>,
  ): Promise<Count> {
    return this.messagesRepository.count(where);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewAnyMessage]})
  @get('/messages',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200: {
        description: 'Array of Messages model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Messages, {includeRelations: true}),
            },
          },
        },
      }
    }
  })

  async find(
    @param.filter(Messages) filter?: Filter<Messages>,
  ): Promise<Messages[]> {
    return this.messagesRepository.find(filter);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateAnyMessage]})
  @patch('/messages',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200: {
        description: 'Messages PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      }
    }
  })

  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Messages, {partial: true}),
        },
      },
    })
    messages: Messages,
    @param.where(Messages) where?: Where<Messages>,
  ): Promise<Count> {
    return this.messagesRepository.updateAll(messages, where);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewAnyMessage]})
  @get('/messages/{id}',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200: {
        description: 'Messages model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Messages, {includeRelations: true}),
          },
        },
      }
    }
  })

  async findById(
    @param.path.number('id') id: number,
    @param.filter(Messages, {exclude: 'where'}) filter?: FilterExcludingWhere<Messages>
  ): Promise<Messages> {
    return this.messagesRepository.findById(id, filter);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateAnyMessage]})
  @patch('/messages/{id}',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      204: {
        description: 'Messages PATCH success',
      }
    }
  })

  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Messages, {partial: true}),
        },
      },
    })
    messages: Messages,
  ): Promise<void> {
    await this.messagesRepository.updateById(id, messages);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateAnyMessage]})
  @put('/messages/{id}',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      204: {
        description: 'Messages PUT success',
      }
    }
  })

  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() messages: Messages,
  ): Promise<void> {
    await this.messagesRepository.replaceById(id, messages);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.DeleteAnyMessage]})
  @del('/messages/{id}',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      204:{
        description: 'Messages DELETE success',
      }
    }
  })

  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.messagesRepository.deleteById(id);
  }
}
