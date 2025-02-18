/* Replace with your SQL commands */
ALTER TABLE auth.roles
ADD IF NOT EXISTS tenant_id uuid  NOT NULL,
ADD IF NOT EXISTS allowed_clients text[],
ADD IF NOT EXISTS description varchar(500);

ALTER TABLE auth.tenants
ADD IF NOT EXISTS website varchar(100);

ALTER TABLE auth.users
ADD IF NOT EXISTS photo_url text,
ADD IF NOT EXISTS designation  varchar(50);
