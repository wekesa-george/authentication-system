import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingKey} from '@loopback/core';
import {AnyObject, RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestBindings} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';


import {ServiceMixin} from '@loopback/service-proxy';
import {
  AuthenticationServiceComponent,
  ClientPasswordVerifyProvider, FacebookOauth2SignupProvider, GoogleOauth2SignupProvider, LocalPreSignupProvider, LocalUserProfileDto, OtpMethodType,
  OtpProvider,
  VerifyBindings
} from '@sourceloop/authentication-service';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
  SFCoreBindings,
} from '@sourceloop/core';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {AuthenticationComponent, Strategies, STRATEGY} from 'loopback4-authentication';
import {LocalPasswordStrategyFactoryProvider} from 'loopback4-authentication/passport-local';
import {AzureAdSignupProvider} from './modules/auth/azure-signup-handler';
import {ForgotPasswordProvider} from './modules/auth/forgot-password.provider';
import {LocalPasswordVerifyProvider} from './modules/auth/local-password-verifier';
import {
  ConsumersBooter,
  MessageHandlerErrorBehavior,
  QueueComponent,
  RabbitmqBindings,
  RabbitmqComponent,
  RabbitmqComponentConfig
} from './modules/rabbit-mq';
import {MfaProvider} from './providers/mfa.provider';
import {OtpGenerateProvider} from './providers/otp-generate';
import {OtpSenderProvider} from './providers/otp-sender.provider';
//import {LocalPasswordVerifyProvider} from '@sourceloop/authentication-service';
import {AuthServiceBindings, SignUpBindings} from '@sourceloop/authentication-service';

import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';

import {OtpVerifyProvider} from '@sourceloop/authentication-service';
import {AzureADAuthStrategyFactoryProvider} from 'loopback4-authentication/passport-azure-ad';
import {GoogleAuthStrategyFactoryProvider} from 'loopback4-authentication/passport-google-oauth2';
import {PassportOtpStrategyFactoryProvider} from 'loopback4-authentication/passport-otp';
import {Loopback4HelmetComponent} from 'loopback4-helmet';
import {RateLimiterComponent, RateLimitSecurityBindings} from 'loopback4-ratelimiter';
import path from 'path';
import {SignupTokenHandlerProvider} from './modules/auth/local-sign-up-provider';
import {LocalSignupProviderClass} from './modules/auth/sign-up-token-handler';
import {UserRepositoryNew} from './modules/auth/user.repository';
import * as openapi from './openapi.json';
import {PasswordDecryptionProvider} from './providers/password-decryption.provider';
import {PasswordHashingProvider} from './providers/password-hashing.provider';
import {PasswordVerifyProvider} from './providers/password-verify.provider';
type UserSignupFn<T, S> = (model: T & LocalUserProfileDto, tokenInfo: AnyObject, transaction: any) => Promise<S>;
export {ApplicationConfig};

export class AuthServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    const port = 3000;
    dotenv.config();
    dotenvExt.load({
      schema: '.env.example',
      errorOnMissing: process.env.NODE_ENV !== 'test',
      includeProcessEnv: true,
    });
    options.rest = options.rest ?? {};
    options.rest.basePath = process.env.BASE_PATH ?? '';
    options.rest.port = +(process.env.PORT ?? port);
    options.rest.host = process.env.HOST;
    options.rest.openApiSpec = {
      endpointMapping: {
        [`${options.rest.basePath}/openapi.json`]: {
          version: '3.0.0',
          format: 'json',
        },
      },
    };

    super(options);

    // To check if monitoring is enabled from env or not
    const enableObf = !!+(process.env.ENABLE_OBF ?? 0);
    // To check if authorization is enabled for swagger stats or not
    const authentication =
      process.env.SWAGGER_USER && process.env.SWAGGER_PASSWORD ? true : false;
    const obj = {
      enableObf,
      obfPath: process.env.OBF_PATH ?? '/obf',
      openapiSpec: openapi,
      authentication: authentication,
      swaggerUsername: process.env.SWAGGER_USER,
      swaggerPassword: process.env.SWAGGER_PASSWORD,
      authenticateSwaggerUI: process.env.AUTHENTICATE_SWAGGER ? Number(process.env.AUTHENTICATE_SWAGGER) == 1 : false

    }
    this.bind(SFCoreBindings.config).to(obj);

    // Set up the custom sequence
    this.sequence(ServiceSequence);

    // Add authentication component
    this.component(AuthenticationComponent);
    this.component(AuthenticationServiceComponent);
    this.bind(AuthServiceBindings.PASSWORD_DECRYPTION_PROVIDER.key).toProvider(PasswordDecryptionProvider);
    this.bind(AuthServiceBindings.PASSWORD_HASHING_PROVIDER.key).toProvider(PasswordHashingProvider);
    this.bind(AuthServiceBindings.PASSWORD_VERIFY_PROVIDER.key).toProvider(PasswordVerifyProvider);
    this.bind(AuthServiceBindings.ForgotPasswordHandler.key).toProvider(ForgotPasswordProvider);
    this.bind(Strategies.Passport.AZURE_AD_STRATEGY_FACTORY.key).toProvider(AzureADAuthStrategyFactoryProvider);
    this.bind(Strategies.Passport.OTP_AUTH_STRATEGY_FACTORY.key).toProvider(PassportOtpStrategyFactoryProvider);
    this.bind(VerifyBindings.MFA_PROVIDER.key).toProvider(MfaProvider);
    this.bind(VerifyBindings.OTP_SENDER_PROVIDER.key).toProvider(OtpSenderProvider);
    this.bind(VerifyBindings.OTP_GENERATE_PROVIDER.key).toProvider(OtpGenerateProvider);
    this.bind(VerifyBindings.OTP_PROVIDER.key).toProvider(OtpProvider);
    this.bind(Strategies.Passport.OTP_VERIFIER.key).toProvider(OtpVerifyProvider);
    this.bind(SignUpBindings.GOOGLE_SIGN_UP_PROVIDER).toProvider(
      GoogleOauth2SignupProvider,
    );
    this.bind(
      Strategies.Passport.GOOGLE_OAUTH2_STRATEGY_FACTORY.key,
    ).toProvider(GoogleAuthStrategyFactoryProvider);
    this.bind(SignUpBindings.FACEBOOK_SIGN_UP_PROVIDER).toProvider(
      FacebookOauth2SignupProvider,
    );

    this.bind(AuthServiceBindings.OtpConfig).to({
      method: OtpMethodType.OTP
    });

    this.bind(SignUpBindings.AZURE_AD_SIGN_UP_PROVIDER.key).toProvider(AzureAdSignupProvider);
    this.bind(Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER.key).toProvider(
      ClientPasswordVerifyProvider
    );
    this.bind('repositories.UserRepositoryNew').toClass(UserRepositoryNew);


    // Add bearer verifier component
    this.bind(BearerVerifierBindings.Config).to({
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);

    this.component(BearerVerifierComponent);

    // Add authorization component
    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer', '/openapi.json'],
    });
    this.component(AuthorizationComponent);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));


    this.bind(RestBindings.ERROR_WRITER_OPTIONS).to({
      debug: process.env.NODE_ENV == 'development'
    });

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    // const LOCAL_SIGNUP_PROVIDER: BindingKey<UserSignupFn<any, any>>;
    const LOCAL_SIGNUP_PROVIDER = BindingKey.create<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      UserSignupFn<any, any> //NOSONAR
    >(`sf.local.signup.provider`);

    this.component(RestExplorerComponent);
    this.bind(SignUpBindings.PRE_LOCAL_SIGNUP_PROVIDER.key).toProvider(LocalPreSignupProvider);
    this.bind(LOCAL_SIGNUP_PROVIDER.key).toProvider(LocalSignupProviderClass)
    this.bind(SignUpBindings.SIGNUP_HANDLER_PROVIDER.key).toProvider(SignupTokenHandlerProvider)
    this.bind(AuthServiceBindings.MfaConfig).to({
      secondFactor: STRATEGY.OTP,
    });
    this.component(Loopback4HelmetComponent);
    this.component(RateLimiterComponent);
    this.bind(RateLimitSecurityBindings.CONFIG).to({
      name: 'lms_redis',
      type: 'RedisStore',
    });
    this.bind(Strategies.Passport.LOCAL_STRATEGY_FACTORY).toProvider(LocalPasswordStrategyFactoryProvider)
    this.bind(Strategies.Passport.LOCAL_PASSWORD_VERIFIER).toProvider(
      LocalPasswordVerifyProvider
    );

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
      },
      services: {
        dirs: ['services'],
        extensions: ['.service.js'],
        nested: true,
      },
    };

    this.api({
      openapi: '3.0.0',
      info: {
        title: 'auth-service',
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
