import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UserCredentialsRepository} from '@sourceloop/authentication-service';
import {AuthTokens} from '../models';
import {AuthTokensRepository} from '../repositories';
import {AuthToken, PasswordToken} from '../types';
const twofactor = require("node-2fa");

@injectable({scope: BindingScope.TRANSIENT})
export class AuthUtilitiesService {
  constructor(
    @repository(AuthTokensRepository)
    public authTokens: AuthTokensRepository,
    @repository(UserCredentialsRepository)
    public oldCredentials: UserCredentialsRepository,
  ) { }

  /**
   * Service to Generate Tokens
   *
   */
  async generateToken(username: string, user_tenant_id: string, client_id: string, token_type: string, param_type: string, transaction: any | null): Promise<AuthToken> {
    /*
    param_type : email or  phone no
    token_type: activation, password recover, Two factor Authentication
    */

    let random = createRandomString(14),
      newsecret = twofactor.generateSecret({name: username, client_id: client_id}),
      newToken = twofactor.generateToken(newsecret.secret);
    console.log(newToken);
    console.log("new Tokne");
    if (transaction) {

      await this.authTokens.create({
        token: newToken.token,
        secret: newsecret.secret,
        type: token_type,
        activationParam: param_type,
        userTenantId: user_tenant_id,
        random,
        email: username
      }, {transaction})

    } else {

      await this.authTokens.create({
        token: newToken.token,
        secret: newsecret.secret,
        type: token_type,
        activationParam: param_type,
        userTenantId: user_tenant_id,
        random
      })
    }
    return {
      token: newToken.token,
      activation_token: random
    }
  }
  async verifyToken(token: string, activation_code: string): Promise<AuthTokens> {
    console.log('=======authUtils Activation Code=====');
    console.log(activation_code);
    const tokenVerified = await this.authTokens.findOne({
      where: {
        random: activation_code
      }
    });
    if (!tokenVerified) {
      throw new Error('Invalid Token')
    }
    const authVerify = twofactor.verifyToken(tokenVerified.secret, token, 10);
    if (!authVerify) {
      throw new Error("Expired or Invalid Activation Token");
    }
    return tokenVerified
  }
  async createPasswordToken(token_id: string, username: string, user_tenant_id: number | any, client_id: string): Promise<PasswordToken> {

    await this.authTokens.deleteById(token_id);

    let random = createRandomString(14),
      newsecret = twofactor.generateSecret({name: username, client_id: client_id}),
      newToken = twofactor.generateToken(newsecret.secret);

    await this.authTokens.create({
      token: newToken.token,
      secret: newsecret.secret,
      type: "new-password",
      activationParam: "--",
      userTenantId: user_tenant_id,
      random,
      email: username
    })
    return {
      token: newToken.token,
      password_token: random
    }
  }
}

function createRandomString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
