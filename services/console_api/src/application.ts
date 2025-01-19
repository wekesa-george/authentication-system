
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestBindings} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {AuthenticationBindings, AuthenticationComponent, Strategies} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent
} from 'loopback4-authorization';
import {HelmetSecurityBindings} from 'loopback4-helmet';
import path from 'path';
import {User} from './models/user.model';
import { SFCoreBindings,SECURITY_SCHEME_SPEC, CoreComponent, ServiceSequence } from '@sourceloop/core';
import {
  BearerTokenVerifyProvider,
  ClientPasswordVerifyProvider,
  ResourceOwnerVerifyProvider,
} from './modules/auth';
import {
  ConsumersBooter,
  MessageHandlerErrorBehavior,
  QueueComponent,
  RabbitmqBindings,
  RabbitmqComponent,
  RabbitmqComponentConfig
} from './modules/rabbit-mq';
import {MySequence} from './sequence';
import {getUser} from './utils/getUser';
export {ApplicationConfig};

export class LaceClubConsole extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);
    /*
    this.component(CoreComponent);

    // Set up the custom sequence
    this.sequence(ServiceSequence);*/
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer', '/openapi.json'],
    });
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.bind(AuthenticationBindings.USER_MODEL).to(User);
    const enableObf = !!+(process.env.ENABLE_OBF ?? 0);
    // To check if authorization is enabled for swagger stats or not
    const authentication =
      process.env.SWAGGER_USER && process.env.SWAGGER_PASSWORD ? true : false;
      const obj={
        enableObf,
        obfPath: process.env.OBF_PATH ?? '/obf',
        authentication: authentication,
        swaggerUsername: process.env.SWAGGER_USER,
        swaggerPassword: process.env.SWAGGER_PASSWORD,
        authenticateSwaggerUI:process.env.AUTHENTICATE_SWAGGER?Number(process.env.AUTHENTICATE_SWAGGER)==1:false

      }
    this.bind(SFCoreBindings.config).to(obj);
    this.bind(HelmetSecurityBindings.CONFIG).to({
      referrerPolicy: {
        policy: 'same-origin',
      },
      contentSecurityPolicy: { 
        directives: {
          frameSrc: ["'self'"],
        },
      },
    });
    this.bind(AuthenticationBindings.CURRENT_USER).to(getUser());
    this.component(AuthenticationComponent);

    this.bind(RestBindings.ERROR_WRITER_OPTIONS).to({debug: true});
    // Add authentication component
    this.component(AuthenticationComponent);
    // Customize authentication verify handlers
    this.bind(Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER).toProvider(
      ClientPasswordVerifyProvider,
    );
    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
      BearerTokenVerifyProvider,
    );
    this.bind(Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER).toProvider(
      ResourceOwnerVerifyProvider,
    );

    this.component(AuthorizationComponent);

    this.configure<RabbitmqComponentConfig>(RabbitmqBindings.COMPONENT).to({
      options: {
        protocol: process.env.RABBITMQ_PROTOCOL ?? 'amqp',
        hostname: process.env.RABBITMQ_HOST ?? 'localhost',
        port:
          process.env.RABBITMQ_PORT === undefined
            ? 5672
            : +process.env.RABBITMQ_PORT,
        username: process.env.RABBITMQ_USER ?? 'rabbitmq',
        password: process.env.RABBITMQ_PASS ?? 'rabbitmq',
        vhost: process.env.RABBITMQ_VHOST ?? '/',
      },
      // configurations below are optional, (Default values)
      producer: {
        idleTimeoutMillis: 10000,
      },
      consumer: {
        retries: 0, // number of retries, 0 is forever
        interval: 1500, // retry interval in ms
      },
      defaultConsumerErrorBehavior: MessageHandlerErrorBehavior.ACK,
      prefetchCount: 10,
      exchanges: [
        {
          name: 'loopback.direct',
          type: 'direct', // Uma troca direta entrega mensagens às filas com base na chave de roteamento de mensagens.
          // type: 'fanout' // Uma exchange de fanout roteia mensagens para todas as filas que estão vinculadas
        },
        {
          name: 'messaging.direct',
          type: 'direct',
        },
      ],
    });
    this.component(RabbitmqComponent);
    /**
     *  Bind classes to listen Events
     */
    this.booters(ConsumersBooter);
    this.component(QueueComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },repositories: {
        dirs: ['repositories'],
        extensions: ['.repository.js'],
        nested: true,
      }
    };
    this.api({
      openapi: '3.1.0',
      info: {
        title: 'Console',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });
  }
}
