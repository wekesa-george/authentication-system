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
import {MessagesPerChannel} from '../models';
import {PermissionKey} from '../modules/auth/permission-key.enum';
import {MessagesPerChannelRepository} from '../repositories';

export class MessagesPerChannelController {
  constructor(
    @repository(MessagesPerChannelRepository)
    public messagesPerChannelRepository : MessagesPerChannelRepository,
  ) {}
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateAnyMessage]})
  @post('/messages-per-channels',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200:{
        description: 'MessagesPerChannel model instance',
        content: {'application/json': {schema: getModelSchemaRef(MessagesPerChannel)}},
      }
    }
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MessagesPerChannel, {
            title: 'NewMessagesPerChannel',
            exclude: ['id'],
          }),
        },
      },
    })
    messagesPerChannel: Omit<MessagesPerChannel, 'id'>,
  ): Promise<MessagesPerChannel> {
    return this.messagesPerChannelRepository.create(messagesPerChannel);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewAnyMessage]})
  @get('/messages-per-channels/count',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200: {
        description: 'MessagesPerChannel model count',
        content: {'application/json': {schema: CountSchema}},
      }
    }
  })

  async count(
    @param.where(MessagesPerChannel) where?: Where<MessagesPerChannel>,
  ): Promise<Count> {
    return this.messagesPerChannelRepository.count(where);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewAnyMessage]})
  @get('/messages-per-channels',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200: {
        description: 'Array of MessagesPerChannel model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(MessagesPerChannel, {includeRelations: true}),
            },
          },
        },
      }
    }
  })

  async find(
    @param.filter(MessagesPerChannel) filter?: Filter<MessagesPerChannel>,
  ): Promise<MessagesPerChannel[]> {
    return this.messagesPerChannelRepository.find(filter);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateAnyMessage]})
  @patch('/messages-per-channels',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200:{
        description: 'MessagesPerChannel PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      }
    }
  })

  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MessagesPerChannel, {partial: true}),
        },
      },
    })
    messagesPerChannel: MessagesPerChannel,
    @param.where(MessagesPerChannel) where?: Where<MessagesPerChannel>,
  ): Promise<Count> {
    return this.messagesPerChannelRepository.updateAll(messagesPerChannel, where);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewAnyMessage]})
  @get('/messages-per-channels/{id}',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200: {
        description: 'MessagesPerChannel model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(MessagesPerChannel, {includeRelations: true}),
          },
        },
      }
    }
  })

  async findById(
    @param.path.number('id') id: number,
    @param.filter(MessagesPerChannel, {exclude: 'where'}) filter?: FilterExcludingWhere<MessagesPerChannel>
  ): Promise<MessagesPerChannel> {
    return this.messagesPerChannelRepository.findById(id, filter);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateAnyMessage]})
  @patch('/messages-per-channels/{id}',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      204:{
        description: 'MessagesPerChannel PATCH success',
      }
    }
  })

  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MessagesPerChannel, {partial: true}),
        },
      },
    })
    messagesPerChannel: MessagesPerChannel,
  ): Promise<void> {
    await this.messagesPerChannelRepository.updateById(id, messagesPerChannel);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateAnyMessage]})
  @put('/messages-per-channels/{id}',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      204:{
        description: 'MessagesPerChannel PUT success',
      }
    }
  })

  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() messagesPerChannel: MessagesPerChannel,
  ): Promise<void> {
    await this.messagesPerChannelRepository.replaceById(id, messagesPerChannel);
  }
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.DeleteAnyMessage]})
  @del('/messages-per-channels/{id}',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      204: {
        description: 'MessagesPerChannel DELETE success',
      }
    }
  })

  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.messagesPerChannelRepository.deleteById(id);
  }
}
