/* Replace with your SQL commands */

ALTER TABLE auth.auth_clients
ADD IF NOT EXISTS client_type varchar(100) DEFAULT 'public';
