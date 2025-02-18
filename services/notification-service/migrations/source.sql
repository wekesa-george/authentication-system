DROP SCHEMA IF EXISTS my_schema CASCADE;
CREATE SCHEMA my_schema;
GRANT ALL ON SCHEMA my_schema TO public;

CREATE SEQUENCE my_schema.messaging_channels_id_seq;
CREATE SEQUENCE my_schema.messages_id_seq;
CREATE SEQUENCE my_schema.msg_templates_id_seq;
CREATE SEQUENCE my_schema.messages_per_channel_id_seq;

CREATE TABLE my_schema.messaging_channels
(
    sdate timestamp with time zone default (current_timestamp at TIME ZONE 'UTC'),
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    channel_name character varying(50),
    channel_description text,
    created_by integer NOT NULL,
    last_updated_by integer,
    last_updated_date timestamp with time zone default (current_timestamp at TIME ZONE 'UTC'),
    locked character varying(1) DEFAULT 'F' check (locked in ('T','F')),
    locked_by integer,
    locked_date timestamp with time zone,
    object_vsn numeric default 2.0,
    archived character varying(1) DEFAULT 'F' check (archived in ('T','F')),
    archived_by integer,
    archived_date timestamp with time zone,
    deleted character varying(1) DEFAULT 'F' check (deleted in ('T','F')),
    deleted_by integer,
    deleted_date timestamp with time zone,
    other_info jsonb default '{}'::jsonb,
    CONSTRAINT pk_messaging_channels_id PRIMARY KEY (id)
);

CREATE INDEX idx_pk_messaging_channels ON my_schema.messaging_channels (id);

CREATE INDEX idx_messaging_channels_created_by ON my_schema.messaging_channels (created_by);

CREATE INDEX idx_messaging_channels_last_updated_by ON my_schema.messaging_channels (last_updated_by);

CREATE TABLE my_schema.msg_templates
(
    sdate timestamp with time zone default (current_timestamp at TIME ZONE 'UTC'),
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    template_name character varying(50),
    template_description text,
    message_channel_id integer references my_schema.messaging_channels(id),
    template text,
    tenancy_id integer,
    created_by integer NOT NULL,
    last_updated_by integer,
    last_updated_date timestamp with time zone default (current_timestamp at TIME ZONE 'UTC'),
    locked character varying(1) DEFAULT 'F' check (locked in ('T','F')),
    locked_by integer,
    locked_date timestamp with time zone,
    object_vsn numeric default 2.0,
    archived character varying(1) DEFAULT 'F' check (archived in ('T','F')),
    archived_by integer,
    archived_date timestamp with time zone,
    deleted character varying(1) DEFAULT 'F' check (deleted in ('T','F')),
    deleted_by integer,
    deleted_date timestamp with time zone,
    other_info jsonb default '{}'::jsonb,
    CONSTRAINT pk_msg_templates_id PRIMARY KEY (id)
);

CREATE INDEX idx_pk_msg_templates ON my_schema.msg_templates (id);

CREATE INDEX idx_msg_templates_created_by ON my_schema.msg_templates (created_by);

CREATE INDEX idx_msg_templates_last_updated_by ON my_schema.msg_templates (last_updated_by);

CREATE TABLE my_schema.messages
(
    sdate timestamp with time zone default (current_timestamp at TIME ZONE 'UTC'),
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    subject character varying(150),
    body text,
    receiver integer,
    user_tenancy_id integer,
    tenancy_id integer,
    sender character varying,
    message_options jsonb default '{}'::jsonb,
    created_by integer NOT NULL,
    last_updated_by integer,
    last_updated_date timestamp with time zone default (current_timestamp at TIME ZONE 'UTC'),
    locked character varying(1) DEFAULT 'F' check (locked in ('T','F')),
    locked_by integer,
    locked_date timestamp with time zone,
    object_vsn numeric default 2.0,
    archived character varying(1) DEFAULT 'F' check (archived in ('T','F')),
    archived_by integer,
    archived_date timestamp with time zone,
    deleted character varying(1) DEFAULT 'F' check (deleted in ('T','F')),
    deleted_by integer,
    deleted_date timestamp with time zone,
    other_info jsonb default '{}'::jsonb,
    CONSTRAINT pk_message_id PRIMARY KEY (id)
);

CREATE INDEX idx_pk_messages ON my_schema.messages (id);

CREATE INDEX idx_messages_created_by ON my_schema.messages (created_by);

CREATE INDEX idx_messages_last_updated_by ON my_schema.messages (last_updated_by);

CREATE TABLE my_schema.messages_per_channel
(
    sdate timestamp with time zone default (current_timestamp at TIME ZONE 'UTC'),
    id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    message_channel_id integer references my_schema.messaging_channels(id),
    message_id integer references my_schema.messages(id),
    template_id integer references my_schema.msg_templates(id),
    user_tenancy_id integer,
    tenancy_id integer,
    delivery_status character varying(1) DEFAULT 'F' check (delivery_status in ('S','F')),
    created_by integer NOT NULL,
    last_updated_by integer,
    last_updated_date timestamp with time zone default (current_timestamp at TIME ZONE 'UTC'),
    locked character varying(1) DEFAULT 'F' check (locked in ('T','F')),
    locked_by integer,
    locked_date timestamp with time zone,
    object_vsn numeric default 2.0,
    archived character varying(1) DEFAULT 'F' check (archived in ('T','F')),
    archived_by integer,
    archived_date timestamp with time zone,
    deleted character varying(1) DEFAULT 'F' check (deleted in ('T','F')),
    deleted_by integer,
    deleted_date timestamp with time zone,
    other_info jsonb default '{}'::jsonb,
    CONSTRAINT pk_messages_per_channel_id PRIMARY KEY (id)
);

CREATE INDEX idx_pk_messages_per_channel ON my_schema.messages_per_channel (id);

CREATE INDEX idx_messages_per_channel_created_by ON my_schema.messages_per_channel (created_by);

CREATE INDEX idx_messages_per_channel_last_updated_by ON my_schema.messages_per_channel (last_updated_by);
