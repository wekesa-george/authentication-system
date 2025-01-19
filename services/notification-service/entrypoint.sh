#!/bin/sh
set -e

# Perform Infisical login and capture the token
INFISICAL_TOKEN=$(infisical login --method=universal-auth \
  --client-id="${CLIENT_ID}" \
  --client-secret="${CLIENT_SECRET}" \
  --domain="${INFISICAL_DOMAIN}" \
  --machine-identity-id="${INFISICAL_MACHINE_ID}"\
  --plain --silent)

# Export the INFISICAL_TOKEN so it's available to subsequent commands
export INFISICAL_TOKEN

# Start the application with Infisical
exec infisical run --projectId $PROJECT_ID --token $INFISICAL_TOKEN --path $FOLDER  --domain $INFISICAL_DOMAIN --env $INFISICAL_ENV -- node .
