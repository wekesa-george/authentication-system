import {sendSingleSms} from '../modules/notifications';
import {ConsumeMessage, rabbitConsume} from '../modules/rabbit-mq';
interface Message {
  tenantId?: number;
  receiver: string;
  sender?: string,
  payload: any;
}

export class TwilioConsumer {
  constructor() // public WebhookRepository: WebhookRepository, // @repository(WebhookRepository)
  // @service(WebhookProvider) public webhookService: WebhookService,
  {}
  @rabbitConsume({
    exchange: 'messaging.direct',
    routingKey: 'tenant.twilio',
    queue: 'truden_twilio',
  })
  async handle(message: Message, rawMessage: ConsumeMessage) {
    const resp = await sendSingleSms(message.receiver,message.payload.message);
    return resp
  }
}
