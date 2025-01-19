import {OPERATION_SECURITY_SPEC} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Request,
  ResponseObject,
  RestBindings,
  get,
  param
} from '@loopback/rest';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {
  RabbitmqBindings,
  RabbitmqProducer,
} from '../modules/rabbit-mq';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * Response for Test Email
 *
 */
const TEST_EMAIL_RESPONSE: ResponseObject = {
  description: 'Test Email Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'TestEmailResponse',
        properties: {
          success: {type: 'boolean'}
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RabbitmqBindings.RABBITMQ_PRODUCER)
    private rabbitmqProducer: RabbitmqProducer
    ) {}

  // Map to `GET /ping`
  @authenticate(STRATEGY.BEARER)
  @get('/ping',{
    security: OPERATION_SECURITY_SPEC,
    responses:{
      200:PING_RESPONSE
    }
  })
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

 // @authenticate(STRATEGY.BEARER)
  @get('/test-email',{
    //security: OPERATION_SECURITY_SPEC,
    responses:{
      200:TEST_EMAIL_RESPONSE
    }
  })
  async test(
    @param.query.string('exchange', {required: false}) exchange?: string,
    @param.query.string('routingKey', {required: false}) routingKey?: string,
  ) {
console.log('Publishing ....');
    await this.rabbitmqProducer.publish(
      exchange ?? 'messaging.direct',
      routingKey ?? 'tenant.zoho',
      Buffer.from(JSON.stringify({
        payload:{
          body:{
            name:'',
            to_email:'wekesaprincegeorgia@gmail.com',
            subject:'Test Email',
            from:'no-reply-lace@truden.tech'
          },
          tpl:"Welcome Here",

        },
      })),
    );
    console.log('Publishing Done ....');
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }
}
