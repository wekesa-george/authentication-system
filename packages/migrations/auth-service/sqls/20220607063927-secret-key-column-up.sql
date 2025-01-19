ALTER TABLE auth.user_credentials
ADD IF NOT EXISTS secret_key text;
