import {sendMail} from '../modules/notifications';
import {ConsumeMessage, rabbitConsume} from '../modules/rabbit-mq';
import { getGeneralTpl } from '../tpls/general-email.tpl';
import { Message, TplPayload } from '../utils/types.dt';
export class ZohoConsumer {
  constructor() // public WebhookRepository: WebhookRepository, // @repository(WebhookRepository)
  // @service(WebhookProvider) public webhookService: WebhookService,
  {}
  @rabbitConsume({
    exchange: 'messaging.direct',
    routingKey: 'tenant.zoho',
    queue: 'truden_zoho',
  })
  async handle(message: Message, _rawMessage: ConsumeMessage) {
    try {
      console.log('Consuming');
      const tpl = getGeneralTpl({
        config:message.config,
        emailHTML:message.payload.emailHTML,
        name:message.payload.name
      })
  
      const resp = await sendMail(tpl,message.payload);
      
      console.log('Consuming Done ....');
      console.log(message);

    } catch (error) {
        console.log(error);
    }
   

    return {}
  }
}
