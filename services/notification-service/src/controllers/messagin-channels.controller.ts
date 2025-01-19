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
import {MessagingChannels} from '../models';
import {PermissionKey} from '../modules/auth/permission-key.enum';
import {MessagingChannelsRepository} from '../repositories';

export class MessaginChannelsController {
  constructor(
    @repository(MessagingChannelsRepository)
    public messagingChannelsRepository : MessagingChannelsRepository,
  ) {}
  @authenticateClient(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateAnyMessage]})
  @post('/messaging-channels',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200: {
        description: 'MessagingChannels model instance',
        content: {'application/json': {schema: getModelSchemaRef(MessagingChannels)}},
      }
    }
  })

  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MessagingChannels, {
            title: 'NewMessagingChannels',
            exclude: ['id'],
          }),
        },
      },
    })
    messagingChannels: Omit<MessagingChannels, 'id'>,
  ): Promise<MessagingChannels> {
    return this.messagingChannelsRepository.create(messagingChannels);
  }

  @get('/messaging-channels/count',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200: {
        description: 'MessagingChannels model count',
        content: {'application/json': {schema: CountSchema}},
      }
    }
  })

  async count(
    @param.where(MessagingChannels) where?: Where<MessagingChannels>,
  ): Promise<Count> {
    return this.messagingChannelsRepository.count(where);
  }

  @get('/messaging-channels',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200: {
        description: 'Array of MessagingChannels model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(MessagingChannels, {includeRelations: true}),
            },
          },
        },
      }
    }
  })

  async find(
    @param.filter(MessagingChannels) filter?: Filter<MessagingChannels>,
  ): Promise<MessagingChannels[]> {
    return this.messagingChannelsRepository.find(filter);
  }

  @patch('/messaging-channels',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200: {
        description: 'MessagingChannels PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      }
    }
  })

  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MessagingChannels, {partial: true}),
        },
      },
    })
    messagingChannels: MessagingChannels,
    @param.where(MessagingChannels) where?: Where<MessagingChannels>,
  ): Promise<Count> {
    return this.messagingChannelsRepository.updateAll(messagingChannels, where);
  }

  @get('/messaging-channels/{id}',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200: {
        description: 'MessagingChannels model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(MessagingChannels, {includeRelations: true}),
          },
        },
      }
    }
  })

  async findById(
    @param.path.number('id') id: number,
    @param.filter(MessagingChannels, {exclude: 'where'}) filter?: FilterExcludingWhere<MessagingChannels>
  ): Promise<MessagingChannels> {
    return this.messagingChannelsRepository.findById(id, filter);
  }

  @patch('/messaging-channels/{id}',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      204: {
        description: 'MessagingChannels PATCH success',
      }
    }
  })

  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MessagingChannels, {partial: true}),
        },
      },
    })
    messagingChannels: MessagingChannels,
  ): Promise<void> {
    await this.messagingChannelsRepository.updateById(id, messagingChannels);
  }

  @put('/messaging-channels/{id}',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      204: {
        description: 'MessagingChannels PUT success',
      }
    }
  })

  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() messagingChannels: MessagingChannels,
  ): Promise<void> {
    await this.messagingChannelsRepository.replaceById(id, messagingChannels);
  }

  @del('/messaging-channels/{id}',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      204: {
        description: 'MessagingChannels DELETE success',
      }
    }
  })

  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.messagingChannelsRepository.deleteById(id);
  }
}
