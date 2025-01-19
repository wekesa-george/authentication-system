import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'auth', table: 'user_id_counter'}
  }
})
export class UserIdCounter extends Entity {
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
    type: 'number',
    jsonSchema: {nullable: true},
    generated: false,
    postgresql: {columnName: 'counter', dataType: 'numeric', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  counter?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserIdCounter>) {
    super(data);
  }
}

export interface UserIdCounterRelations {
  // describe navigational properties here
}

export type UserIdCounterWithRelations = UserIdCounter & UserIdCounterRelations;
