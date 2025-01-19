

// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {AnyObject, IsolationLevel, repository} from '@loopback/repository';
import {get, HttpErrors, post, requestBody, RestBindings} from '@loopback/rest';
import {accountCreation} from '../utils/password-tkn';

import {
  AuthClient,
  AuthClientRepository,
  AuthCodeBindings,
  JWTSignerFn, LocalUserProfileDto, PreSignupFn, SignUpBindings, SignupRequest, SignupRequestDto, SignupTokenHandlerFn,
  TenantConfigRepository,
  UserTenantRepository,
  VerifyBindings
} from '@sourceloop/authentication-service';
import {
  ConfigKey,
  CONTENT_TYPE,
  ErrorCodes,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {UserRepositoryNew} from '../modules/auth/user.repository';
import {RabbitmqBindings, RabbitmqProducer} from '../modules/rabbit-mq';
import {AuthTokensRepository} from '../repositories';
import {AuthUtilitiesService} from '../services/authUtils.service';
import {UserEmailToken} from '../types';
const successResponse = 'Sucess Response.';
const basePath = '/auth/sign-up';
type UserSignupFn<T, S> = (model: T & LocalUserProfileDto, tokenInfo: AnyObject, transaction: any, client: AuthClient) => Promise<S>;
export class SignUpControllerNewController {
  constructor(
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    private readonly client: AuthClient | undefined,
    @inject(SignUpBindings.PRE_LOCAL_SIGNUP_PROVIDER)
    private readonly preSignupFn: PreSignupFn<LocalUserProfileDto, AnyObject>,
    @inject(SignUpBindings.LOCAL_SIGNUP_PROVIDER)
    private readonly userSignupFn: UserSignupFn<any, AnyObject>,
    @inject(AuthCodeBindings.JWT_SIGNER.key)
    private readonly jwtSigner: JWTSignerFn<AnyObject>,
    @service(AuthUtilitiesService)
    public authUtils: AuthUtilitiesService,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RabbitmqBindings.RABBITMQ_PRODUCER)
    private rabbitmqProducer: RabbitmqProducer,
    @repository(AuthClientRepository)
    private authClientRepo: AuthClientRepository,
    @repository(TenantConfigRepository)
    private tenantCfgRepo: TenantConfigRepository,
    @repository(UserTenantRepository)
    private userTenantRepo: UserTenantRepository,
    @repository(UserRepositoryNew)
    private userRepo: UserRepositoryNew,
    @repository(AuthTokensRepository)
    private authTokens: AuthTokensRepository,

  ) { }

  @authorize({permissions: ['*']})
  @post(`${basePath}/create-token`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: successResponse,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'Login ID, either email or password',
                },
                expiry: {
                  type: 'string'
                },
                email: {
                  type: 'string'
                }
              },
            },
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async requestSignup(
    @requestBody()
    signUpRequest: SignupRequestDto<LocalUserProfileDto>,
    @inject(SignUpBindings.SIGNUP_HANDLER_PROVIDER)
    handler: SignupTokenHandlerFn,
  ): Promise<any> {
    // Default expiry is 30 minutes
    const expiryDuration = parseInt(
      process.env.REQUEST_SIGNUP_LINK_EXPIRY ?? '1800',
    );

    const codePayload = await this.preSignupFn(signUpRequest);
    const token = await this.jwtSigner(codePayload, {
      subject: signUpRequest.email,
      expiresIn: expiryDuration,
    });
    await handler({
      code: token,
      expiry: expiryDuration,
      email: signUpRequest.email,
    });
    return Promise.resolve({
      code: token,
      expiry: expiryDuration,
      email: signUpRequest.email,
    })
  }

  @authenticate(
    STRATEGY.BEARER,
    {},
    undefined,
    VerifyBindings.BEARER_SIGNUP_VERIFY_PROVIDER,
  )
  @authorize({permissions: ['*']})
  @post(`${basePath}/create-user`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: successResponse,
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string'
                },
                user: {
                  type: 'object'
                },
                activation_token: {
                  type: 'string'
                }
              },
            },
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async signupWithToken(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string'
              },
              lastName: {
                type: 'string'
              },
              middleName: {
                type: 'string'
              },
              phoneNumber: {
                type: 'string'
              },
              defaultTenantId: {
                type: 'string'
              },
              designation: {
                type: 'string'
              },
              gender: {
                type: 'string'
              },
              dob: {
                type: 'string'
              },
              email: {
                type: 'string'
              },
              clientId: {
                type: 'string'
              }
            },
          },
        },
      }
    })
    req: any,
    @inject(AuthenticationBindings.CURRENT_USER)
    signupUser: SignupRequest,

  ): Promise<any> {
    let user: any = null;
    user = await this.userRepo.findOne({
      where: {
        email: req.email
      }
    });
    let tenancy: any;
    let client: any;
    const transaction = await this.userRepo.dataSource.beginTransaction(
      IsolationLevel.SERIALIZABLE,
    );

    try {
      client = await this.authClientRepo.findOne({
        where: {
          clientId: req.clientId
        }
      })

      if (!client) {
        throw new Error('Unknown Client');
      }
      if (!user) {

        user = await this.userSignupFn(req, signupUser, transaction, client);


        tenancy = await this.userTenantRepo.create({
          roleId: "a92af5fa-4da8-e5f8-dbba-3d3e23a6669d",
          userId: user.id,
          status: 1,
          tenantId: user.defaultTenantId
        }, {transaction});

      } else {


        tenancy = await this.userTenantRepo.findOne({
          where: {
            userId: user.id,
            tenantId: user.defaultTenantId
          }
        });

        if (!tenancy) {

          tenancy = await this.userTenantRepo.create({
            roleId: "a92af5fa-4da8-e5f8-dbba-3d3e23a6669d",
            userId: user.id,
            status: 1,
            tenantId: user.defaultTenantId
          }, {transaction});
        }
      }

      const {token, activation_token} = await this.authUtils.generateToken(req.email, tenancy.id, req.clientId, 'activation', 'email', transaction);

      const tenantCfg: any = await this.tenantCfgRepo.findOne({
        where: {
          tenantId: user.defaultTenantId,
          configKey: ConfigKey.Profile
        }
      })
      if (!tenantCfg?.configValue) {
        throw new HttpErrors.BadRequest("Invalid Tenancy ID");
      }

      const htmlBody = accountCreation({
        token
      });
      // send Token through Notifications


      await this.rabbitmqProducer.publish(
        'messaging.direct',
        'tenant.sendgrid',
        Buffer.from(JSON.stringify({
          sender: tenantCfg?.configValue.title,
          receiver: `${user.firstName} ${user.lastName}`,
          tenantId: user.defaultTenantId,
          config: tenantCfg?.configValue.mailConfig,
          payload: {
            name: `${user.firstName} ${user.lastName}`,
            to_email: user.email,
            subject: 'Account Creation',
            from: tenantCfg?.configValue.mailConfig.sender,
            emailHTML: htmlBody
          },
        })),
      );
      await transaction.commit();

      return Promise.resolve({
        email: req.email,
        user: user,
        activation_token
      });
    } catch (error) {

      await transaction.rollback();
      throw new HttpErrors.InternalServerError(error.message);
    }

  }


  @authenticate(
    STRATEGY.BEARER,
    {},
    undefined,
    VerifyBindings.BEARER_SIGNUP_VERIFY_PROVIDER,
  )
  @authorize({permissions: ['*']})
  @post(`${basePath}/create-user-talkup`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: successResponse,
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string'
                },
                user: {
                  type: 'object'
                },
                activation_token: {
                  type: 'string'
                }
              },
            },
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async signupWithTalkup(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string'
              },
              lastName: {
                type: 'string'
              },
              middleName: {
                type: 'string'
              },
              phoneNumber: {
                type: 'string'
              },
              defaultTenantId: {
                type: 'string'
              },
              designation: {
                type: 'string'
              },
              gender: {
                type: 'string'
              },
              dob: {
                type: 'string'
              },
              email: {
                type: 'string'
              },
              clientId: {
                type: 'string'
              }
            },
          },
        },
      }
    })
    req: any,
    @inject(AuthenticationBindings.CURRENT_USER)
    signupUser: SignupRequest,

  ): Promise<any> {
    let user: any = null;
    user = await this.userRepo.findOne({
      where: {
        email: req.email
      }
    });
    let tenancy: any;
    let client: any;
    const transaction = await this.userRepo.dataSource.beginTransaction(
      IsolationLevel.SERIALIZABLE,
    );

    try {
      client = await this.authClientRepo.findOne({
        where: {
          clientId: req.clientId
        }
      })

      if (!client) {
        throw new Error('Unknown Client');
      }
      if (!user) {

        user = await this.userSignupFn(req, signupUser, transaction, client);


        tenancy = await this.userTenantRepo.create({
          roleId: "a92af5fa-4da8-e5f8-dbba-3d3e23a6669d",
          userId: user.id,
          status: 1,
          tenantId: user.defaultTenantId
        }, {transaction});

      } else {


        tenancy = await this.userTenantRepo.findOne({
          where: {
            userId: user.id,
            tenantId: user.defaultTenantId
          }
        });

        if (!tenancy) {

          tenancy = await this.userTenantRepo.create({
            roleId: "a92af5fa-4da8-e5f8-dbba-3d3e23a6669d",
            userId: user.id,
            status: 1,
            tenantId: user.defaultTenantId
          }, {transaction});
        }
      }

      const {token, activation_token} = await this.authUtils.generateToken(req.email, tenancy.id, req.clientId, 'activation', 'email', transaction);

      const tenantCfg: any = await this.tenantCfgRepo.findOne({
        where: {
          tenantId: user.defaultTenantId,
          configKey: ConfigKey.Profile
        }
      })
      if (!tenantCfg?.configValue) {
        throw new HttpErrors.BadRequest("Invalid Tenancy ID");
      }
      console.log(token);
      const htmlBody = accountCreation({
        token
      });
      // send Token through Notifications


      await this.rabbitmqProducer.publish(
        'messaging.direct',
        'tenant.sendgrid',
        Buffer.from(JSON.stringify({
          sender: tenantCfg?.configValue.title,
          receiver: `${user.firstName} ${user.lastName}`,
          tenantId: user.defaultTenantId,
          config: tenantCfg?.configValue.mailConfig,
          payload: {
            name: `${user.firstName} ${user.lastName}`,
            to_email: user.email,
            subject: 'Account Creation',
            from: tenantCfg?.configValue.mailConfig.sender,
            emailHTML: htmlBody
          },
        })),
      );
      await transaction.commit();

      return Promise.resolve({
        email: req.email,
        user: user,
        activation_token
      });
    } catch (error) {

      await transaction.rollback();
      throw new HttpErrors.InternalServerError(error.message);
    }

  }



  @authenticate(
    STRATEGY.BEARER,
    {},
    undefined,
    VerifyBindings.BEARER_SIGNUP_VERIFY_PROVIDER,
  )
  @authorize({permissions: ['*']})
  @post(`${basePath}/create-user-mobile`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: successResponse,
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string'
                },
                user: {
                  type: 'object'
                },
                activation_token: {
                  type: 'string'
                }
              },
            },
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async signupTelno(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              firstName: {
                type: 'string'
              },
              lastName: {
                type: 'string'
              },
              middleName: {
                type: 'string'
              },
              phoneNumber: {
                type: 'string'
              },
              defaultTenantId: {
                type: 'string'
              },
              dob: {
                type: 'string'
              },
              designation: {
                type: 'string'
              },
              gender: {
                type: 'string'
              },
              email: {
                type: 'string'
              },
              clientId: {
                type: 'string'
              }
            },
          },
        },
      }
    })
    req: any,
    @inject(AuthenticationBindings.CURRENT_USER)
    signupUser: SignupRequest,

  ): Promise<any> {
    console.log(req);
    console.log(1);

    let user: any = null;
    req.email = await this.removeSpaces(req.telno) + "@telias.tel"
    user = await this.userRepo.findOne({
      where: {
        email: req.email
      }
    });

    console.log(2);
    console.log(user);
    let tenancy: any;
    const transaction = await this.userRepo.dataSource.beginTransaction(
      IsolationLevel.SERIALIZABLE,
    );
    console.log(3);

    let client: any;
    try {

      if (!user) {
        console.log(4);
        let newS: any = {...req}
        newS.phone = await this.removeSpaces(newS.telno);
        newS.phone = '+256' + newS.phone
        delete newS.clientId
        delete newS.telno
        client = await this.authClientRepo.findOne({
          where: {
            clientId: req.clientId
          }
        })

        if (!client) {
          throw new Error('Unknown Client');
        }

        console.log(6);
        user = await this.userSignupFn(newS, signupUser, transaction, client);

        tenancy = await this.userTenantRepo.create({
          roleId: "a92af5fa-4da8-e5f8-dbba-3d3e23a6669d",
          userId: user.id,
          status: 1,
          tenantId: user.defaultTenantId
        }, {transaction});

      } else {
        console.log(7);
        tenancy = await this.userTenantRepo.findOne({
          where: {
            userId: user.id,
            tenantId: user.defaultTenantId
          }
        });

        if (!tenancy) {

          console.log(8);
          tenancy = await this.userTenantRepo.create({
            roleId: "a92af5fa-4da8-e5f8-dbba-3d3e23a6669d",
            userId: user.id,
            status: 1,
            tenantId: user.defaultTenantId
          }, {transaction});
        }
      }

      console.log(9);
      const {token, activation_token} = await this.authUtils.generateToken(req.email, tenancy.id, req.clientId, 'activation', 'email', transaction);

      const tenantCfg: any = await this.tenantCfgRepo.findOne({
        where: {
          tenantId: user.defaultTenantId,
          configKey: ConfigKey.Profile
        }
      })
      if (!tenantCfg?.configValue) {
        throw new HttpErrors.BadRequest("Invalid Tenancy ID");
      }

      console.log('M');
      console.log(19);
      const htmlBody = accountCreation({
        token
      });
      // send Token through Notifications



      await this.rabbitmqProducer.publish(
        'messaging.direct',
        'tenant.sendgrid',
        Buffer.from(JSON.stringify({
          sender: tenantCfg?.configValue.title,
          receiver: `${user.firstName} ${user.lastName}`,
          tenantId: user.defaultTenantId,
          config: tenantCfg?.configValue.mailConfig,
          payload: {
            name: `${user.firstName} ${user.lastName}`,
            to_email: 'wekesaprincegeorgia@gmail.com',
            subject: 'Account Creation Telias',
            from: tenantCfg?.configValue.mailConfig.sender,
            emailHTML: htmlBody
          },
        })),
      );
      await transaction.commit();
      const userCred: any = await this.userRepo.changePasswordNew(
        user.username,
        token,

      );
      return Promise.resolve({
        email: req.email,
        user: user,
        activation_token,
        token,
        userId: tenancy.id
      });
    } catch (error) {

      await transaction.rollback();
      throw new HttpErrors.InternalServerError(error.message);

    }

  }


  @authenticate(
    STRATEGY.BEARER,
    {},
    undefined,
    VerifyBindings.BEARER_SIGNUP_VERIFY_PROVIDER,
  )
  @authorize({permissions: ['*']})
  @get(`${basePath}/verify-token`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: successResponse,
      },
      ...ErrorCodes,
    },
  })
  async verifyInviteToken(
    @inject(AuthenticationBindings.CURRENT_USER)
    signupUser: SignupRequest,
  ): Promise<SignupRequest> {
    return signupUser;
  }

  @authenticate(
    STRATEGY.BEARER,
    {},
    undefined,
    VerifyBindings.BEARER_SIGNUP_VERIFY_PROVIDER,
  )
  @authorize({permissions: ['*']})
  @post(`${basePath}/verify-token-email`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Verify Token Response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                password_token: {
                  type: 'string',
                }
              }
            }

          }
        },
      },
      ...ErrorCodes,
    },
  })

  async verifyEmailToken(
    @requestBody({
      description: 'Verify Email Token',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              tenancyId: {
                type: 'string'
              },
              client_id: {
                type: 'string'
              },
              client_secret: {
                type: 'string'
              },
              token: {
                type: 'string'
              },
              activation_code: {
                type: 'string'
              }
            },
          },
        },
      },
    })

    body: any,
  ): Promise<any> {


    const rec = await this.authTokens.findOne({
      where: {
        token: body.token,
        random: body.activation_code
      }
    })

    if (!rec) {
      throw new HttpErrors.Forbidden(`Invalid Token`);
    }

    const userTenancy = await this.userTenantRepo.findById(rec.userTenantId);
    if (!userTenancy) {
      throw new HttpErrors.Forbidden(`Error -  User is Unknown`);
    }

    const user = await this.userRepo.findById(userTenancy.userId);

    if (!user) {
      throw new HttpErrors.Forbidden(`Unknown User does not exist`);
    }


    try {

      const tokenReturn = await this.authUtils.verifyToken(body.token, body.activation_code);
      // send Token through Notifications
      const {password_token, token} = await this.authUtils.createPasswordToken(tokenReturn.id, user.username, userTenancy.id, body.client_id)

      return Promise.resolve({
        password_token,
        token
      });

    } catch (error) {

      throw new HttpErrors.Forbidden(`Error - ${error.message}`)

    }

  }


  @authenticate(
    STRATEGY.BEARER,
    {},
    undefined,
    VerifyBindings.BEARER_SIGNUP_VERIFY_PROVIDER,
  )
  @authorize({permissions: ['*']})
  @post(`${basePath}/confirm-pwd`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Confirm password',
        content: {
          'application/json': {schema: UserEmailToken}
        },
      }
    }
  })
  async confirmPassword(
    @requestBody({
      description: 'Confirm Password',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {

              password: {
                type: 'string'
              },
              code: {
                type: 'string'
              },
              passwordToken: {
                type: 'string'
              },
              tenancyId: {

                type: 'string'
              },
              client_id: {
                type: 'string'
              },
              client_secret: {
                type: 'string'
              }
            },
          },
        },
      },
    })

    body: any,
  ): Promise<any> {
    console.log(body);
    const rec = await this.authTokens.findOne({
      where: {
        random: body.password_token,
        token: body.code

      }
    })
    if (!rec) {
      throw new HttpErrors.Forbidden(`Invalid Password Token`);
    }
    const user = await this.userRepo.findOne({
      where: {
        email: rec.email
      }
    })



    if (!user) {
      throw new HttpErrors.Forbidden(`Unknown User`);
    }

    try {



      const userCred: any = await this.userRepo.changePasswordNew(
        user.username,
        body.password,
      );

      const rec1 = await this.authTokens.deleteById(rec.id)

      return Promise.resolve({
        success: true
      });

    } catch (error) {
      console.error('An error occurred:', error.message);
      console.error('Stack trace:', error.stack);
      throw new HttpErrors.InternalServerError("Unable to perform request. An Error Occurred: " + error.message)
    }

  }

  async removeSpaces(str: string) {
    return str.replace(/\s+/g, '');
  }

}
