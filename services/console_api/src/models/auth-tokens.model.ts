import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, postgresql: {schema: 'auth', table: 'auth_tokens'}}
})
export class AuthTokens extends Entity {
  @property({
    type: 'date',
    jsonSchema: {nullable: true},
    generated: false,
    postgresql: {columnName: 'sdate', dataType: 'timestamp with time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  sdate?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    length: 50,
    generated: false,
    id: 1,
    postgresql: {columnName: 'id', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    postgresql: {columnName: 'token', dataType: 'character varying', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  token: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    postgresql: {columnName: 'secret', dataType: 'character varying', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  secret: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    postgresql: {columnName: 'type', dataType: 'character varying', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  type: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    postgresql: {columnName: 'activation_param', dataType: 'character varying', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  activationParam: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    generated: false,
    postgresql: {columnName: 'other_info', dataType: 'jsonb', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  otherInfo?: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    generated: false,
    postgresql: {columnName: 'random', dataType: 'character varying', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  random?: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    generated: false,
    postgresql: {columnName: 'email', dataType: 'character varying', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  email?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    length: 50,
    generated: false,
    postgresql: {columnName: 'user_tenant_id', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  userTenantId: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<AuthTokens>) {
    super(data);
  }
}

export interface AuthTokensRelations {
  // describe navigational properties here
}

export type AuthTokensWithRelations = AuthTokens & AuthTokensRelations;
