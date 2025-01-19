ALTER TABLE auth.auth_clients
ADD IF NOT EXISTS created_by varchar(100),
ADD IF NOT EXISTS modified_by varchar(100);

ALTER TABLE auth.user_credentials
ADD IF NOT EXISTS created_by varchar(100),
ADD IF NOT EXISTS modified_by varchar(100);

ALTER TABLE auth.user_tenants
ADD IF NOT EXISTS created_by varchar(100),
ADD IF NOT EXISTS modified_by varchar(100);
