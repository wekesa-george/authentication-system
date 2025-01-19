import {sendMail_SENDGRID} from '../modules/notifications';
import {ConsumeMessage, rabbitConsume} from '../modules/rabbit-mq';
import { getGeneralTpl } from '../tpls/general-email.tpl';
import { Message, TplPayload } from '../utils/types.dt';
export class ZohoConsumer {
  constructor() // public WebhookRepository: WebhookRepository, // @repository(WebhookRepository)
  // @service(WebhookProvider) public webhookService: WebhookService,
  {}
  @rabbitConsume({
    exchange: 'messaging.direct',
    routingKey: 'tenant.sendgrid',
    queue: 'truden_mail',
  })
  async handle(message: Message, _rawMessage: ConsumeMessage) {

    const tpl = getGeneralTpl({
      config:message.config,
      emailHTML:message.payload.emailHTML,
      name:message.payload.name
    })

    const resp = await sendMail_SENDGRID(tpl,message.payload);
    

    console.log(message);
    return {}
  }
}
