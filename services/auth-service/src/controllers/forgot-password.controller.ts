// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject, service} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {HttpErrors, get, param, patch, post, requestBody} from '@loopback/rest';
import {
  AuthClient, AuthServiceBindings, ForgetPasswordDto,
  ResetPasswordWithClient,
  User, UserTenantRepository
} from '@sourceloop/authentication-service';
import {
  AuthProvider,
  AuthenticateErrorKeys,
  ErrorCodes,
  ILogger,
  LOGGER,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
  SuccessResponse,
} from '@sourceloop/core';
import {omit} from 'lodash';
import {
  AuthErrorKeys,
  AuthenticationBindings,
  ClientAuthCode,
  STRATEGY,
  authenticateClient,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';

import {
  AuthCodeBindings,
  ForgotPasswordHandlerFn,
  JWTSignerFn,
  JWTVerifierFn,
  LoginHelperService,
  RevokedTokenRepository, UserRepository,
} from '@sourceloop/authentication-service';
import {AuthTokensRepository} from '../repositories';
import {AuthUtilitiesService} from '../services/authUtils.service';

export class ForgetPasswordController {
  constructor(
    @repository(UserRepository)
    private readonly userRepo: UserRepository,
    @repository(RevokedTokenRepository)
    private readonly revokedTokensRepo: RevokedTokenRepository,
    @inject('services.LoginHelperService')
    private readonly loginHelperService: LoginHelperService,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(AuthCodeBindings.JWT_SIGNER.key)
    private readonly jwtSigner: JWTSignerFn<AnyObject>,
    @inject(AuthCodeBindings.JWT_VERIFIER.key)
    private readonly jwtVerifier: JWTVerifierFn<AnyObject>,
    @service(AuthUtilitiesService)
    public authUtils: AuthUtilitiesService,
    @repository(AuthTokensRepository)
    private authTokens: AuthTokensRepository,
    @repository(UserTenantRepository)
    private userTenantRepo: UserTenantRepository,
  ) { }

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authorize({permissions: ['*']})
  @post(`auth/forget-password`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Success Response.',
      },
      ...ErrorCodes,
    },
  })
  async forgetPassword(
    @requestBody()
    req: ForgetPasswordDto,
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    client: AuthClient,
    @inject(AuthServiceBindings.ForgotPasswordHandler)
    forgetPasswordHandler: ForgotPasswordHandlerFn,
  ): Promise<any> {
    const user = await this.userRepo.findOne({
      where: {
        username: req.username,
      },
      include: ['credentials'],
    });
    try {
      await this.loginHelperService.verifyClientUserLogin(req, client, user);
    } catch (e) {
      return Promise.reject({
        error: e.error,
        message: e.message
      });;
    }
    if (!user?.id) {
      this.logger.info(`Forget password attempted for invalid user`);
      return;
    }

    if (!user.email) {
      this.logger.info(`Forget password attempted for user without email`);
      return;
    }

    const codePayload: ClientAuthCode<User> = {
      clientId: client.clientId,
      userId: parseInt(user.id),
      user: new User({
        id: user.id,
        email: user.email,
        username: user.username,
      }),
    };
    // Default expiry is 30 minutes
    const expiryDuration = parseInt(
      process.env.FORGOT_PASSWORD_LINK_EXPIRY ?? '1800',
    );
    const token = await this.jwtSigner(codePayload, {
      audience: req.client_id,
      subject: user.username.toLowerCase(),
      expiresIn: expiryDuration,
    });

    if (user?.credentials?.authProvider !== AuthProvider.INTERNAL) {
      throw new HttpErrors.BadRequest(
        AuthenticateErrorKeys.PasswordCannotBeChanged,
      );
    }

    return forgetPasswordHandler({
      code: token,
      expiry: expiryDuration,
      email: user.email,
      user: omit(user, 'credentials'),
    });
  }

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authorize({permissions: ['*']})
  @post(`auth/forget-password-2`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Success Response.',
      },
      ...ErrorCodes,
    },
  })
  async forgetPassword2(
    @requestBody()
    req: ForgetPasswordDto,
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    client: AuthClient,
    @inject(AuthServiceBindings.ForgotPasswordHandler)
    forgetPasswordHandler: ForgotPasswordHandlerFn,
  ): Promise<any> {
    const user = await this.userRepo.findOne({
      where: {
        username: req.username,
      },
      include: ['credentials'],
    });

    if (!user?.id) {
      this.logger.info(`Forget password attempted for invalid user`);
      return;
    }

    if (!user.email) {
      this.logger.info(`Forget password attempted for user without email`);
      return;
    }

    const codePayload: ClientAuthCode<User> = {
      clientId: client.clientId,
      userId: parseInt(user.id),
      user: new User({
        id: user.id,
        email: user.email,
        username: user.username,
      }),
    };
    // Default expiry is 30 minutes
    const expiryDuration = parseInt(
      process.env.FORGOT_PASSWORD_LINK_EXPIRY ?? '1800',
    );
    const token = await this.jwtSigner(codePayload, {
      audience: req.client_id,
      subject: user.username.toLowerCase(),
      expiresIn: expiryDuration,
    });


    return forgetPasswordHandler({
      code: token,
      expiry: expiryDuration,
      email: user.email,
      user: omit(user, 'credentials'),
    });
  }



  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authorize({permissions: ['*']})
  @post(`auth/forget-password/verify-token-email`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Success Response.',
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
  async forgetPasswordVerify(
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
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    client: AuthClient
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
      const {password_token} = await this.authUtils.createPasswordToken(tokenReturn.id, user.username, userTenancy.id, body.client_id)

      return Promise.resolve({password_token});

    } catch (error) {

      throw new HttpErrors.Forbidden(`Error - ${error.message}`)

    }
  }

  @authorize({permissions: ['*']})
  @get(`auth/verify-reset-password-link`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Check if Token Is Valid and not Expired.',
      },
    },
  })
  async verifyResetPasswordLink(
    @param.query.string('token', {required: true})
    token: string,
  ): Promise<SuccessResponse> {
    let payload;

    const isRevoked = await this.revokedTokensRepo.get(token);
    if (isRevoked?.token) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.TokenRevoked);
    }
    try {
      payload = (await this.jwtVerifier(token, {})) as ClientAuthCode<User>;
    } catch (error) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenExpired);
    }

    if (!payload.clientId || !payload.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }

    return new SuccessResponse({
      success: true,
    });
  }

  @authenticateClient(STRATEGY.CLIENT_PASSWORD)
  @authorize({permissions: ['*']})
  @patch(`auth/reset-password`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'If User password successfully changed.',
      },
    },
  })
  async resetPassword(
    @requestBody()
    req: ResetPasswordWithClient,
    @inject(AuthenticationBindings.CURRENT_CLIENT)
    client: AuthClient,
  ): Promise<void> {
    if (!req.token) {
      throw new HttpErrors.UnprocessableEntity(
        AuthenticateErrorKeys.TokenMissing,
      );
    }

    if (req.password && req.password.length <= 0) {
      throw new HttpErrors.BadRequest(AuthenticateErrorKeys.PasswordInvalid);
    }

    let payload: ClientAuthCode<User>;

    const isRevoked = await this.revokedTokensRepo.get(req.token);
    if (isRevoked?.token) {
      throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.TokenRevoked);
    }

    try {
      payload = (await this.jwtVerifier(req.token, {})) as ClientAuthCode<User>;
    } catch (error) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenExpired);
    }

    if (!payload.clientId || !payload.user) {
      throw new HttpErrors.Unauthorized(AuthErrorKeys.TokenInvalid);
    }
    const user = await this.userRepo.findOne({
      where: {
        username: payload.user.username,
      },
    });
    await this.loginHelperService.verifyClientUserLogin(req, client, user);

    await this.userRepo.changePassword(payload.user.username, req.password);

    await this.revokedTokensRepo.set(req.token, {
      token: req.token,
    });
  }
}
