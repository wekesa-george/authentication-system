/* Replace with your SQL commands */

SET search_path TO auth,public;
GRANT ALL ON SCHEMA auth TO public;
drop table auth.login_activity;
