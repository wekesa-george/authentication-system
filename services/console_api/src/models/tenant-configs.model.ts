import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, postgresql: {schema: 'auth', table: 'tenant_configs'}}
})
export class TenantConfigs extends Entity {
  @property({
    type: 'string',
    
    jsonSchema: {nullable: false},
    generated: false,
    id: 1,
    postgresql: {columnName: 'id', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    length: 100,
    generated: false,
    postgresql: {columnName: 'config_key', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  configKey: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    postgresql: {columnName: 'config_value', dataType: 'jsonb', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  configValue: string;

  @property({
    type: 'date',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    postgresql: {columnName: 'created_on', dataType: 'timestamp with time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  createdOn: string;

  @property({
    type: 'date',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    postgresql: {columnName: 'modified_on', dataType: 'timestamp with time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  modifiedOn: string;

  @property({
    type: 'number',
    jsonSchema: {nullable: true},
    scale: 0,
    generated: false,
    postgresql: {columnName: 'created_by', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'YES', generated: false},
  })
  createdBy?: number;

  @property({
    type: 'number',
    jsonSchema: {nullable: true},
    scale: 0,
    generated: false,
    postgresql: {columnName: 'modified_by', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'YES', generated: false},
  })
  modifiedBy?: number;

  @property({
    type: 'boolean',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    postgresql: {columnName: 'deleted', dataType: 'boolean', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  deleted: boolean;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    postgresql: {columnName: 'tenant_id', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  tenantId: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    generated: false,
    postgresql: {columnName: 'deleted_by', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  deletedBy?: string;

  @property({
    type: 'date',
    jsonSchema: {nullable: true},
    generated: false,
    postgresql: {columnName: 'deleted_on', dataType: 'timestamp with time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  deletedOn?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TenantConfigs>) {
    super(data);
  }
}

export interface TenantConfigsRelations {
  // describe navigational properties here
}

export type TenantConfigsWithRelations = TenantConfigs & TenantConfigsRelations;
