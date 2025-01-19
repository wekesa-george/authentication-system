ALTER TABLE auth.auth_clients
DROP COLUMN  created_by,
DROP COLUMN  modified_by;

ALTER TABLE auth.user_credentials
DROP COLUMN  created_by,
DROP COLUMN  modified_by;

ALTER TABLE auth.user_tenants
DROP COLUMN  created_by,
DROP COLUMN  modified_by;
