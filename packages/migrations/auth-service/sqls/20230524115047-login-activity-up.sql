/* Replace with your SQL commands */

SET search_path TO auth,public;
GRANT ALL ON SCHEMA auth TO public;

CREATE TABLE auth.login_activity (
		id 						uuid DEFAULT md5(random()::text || clock_timestamp()::text)::uuid NOT NULL ,
		actor                   text NOT NULL,
		tenant_id				text,
		login_time				timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
		token_payload			text NOT NULL,
		login_type				text NOT NULL,
		device_info				text,
		ip_address				text,
		CONSTRAINT pk_login_activity PRIMARY KEY ( id )
);
