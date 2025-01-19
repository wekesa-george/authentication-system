# Use an official Node.js image as the base
ARG nodeVer=20-alpine
FROM node:20-alpine AS BASE

# Set build-time variables
ARG SERVICE_NAME='auth-service'
ARG FROM_FOLDER='services'  

# Install build dependencies
RUN apk update && apk add --no-cache --virtual .gyp \
    python3 \
    py3-setuptools \
    make \
    g++ \
    bash \
    curl \
    && ln -sf /usr/bin/python3 /usr/bin/python

# Install node-prune to reduce image size
RUN curl -sfL https://gobinaries.com/tj/node-prune | bash -s -- -b /usr/local/bin

# Switch to non-root user
USER node

# Create and set working directory
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Copy package files and source code
COPY --chown=node package*.json ./
COPY --chown=node packages ./packages
COPY --chown=node services/auth-service ./services/auth-service

# Install dependencies
RUN npm install

# Build the application
WORKDIR /home/node/app/services/auth-service
RUN npm run build

# Prune development dependencies
RUN npm prune --production
RUN /usr/local/bin/node-prune

# Start a new stage for the final image
FROM node:$nodeVer

# Set build-time variables again
ARG SERVICE_NAME=auth-service
ARG FROM_FOLDER=services

# Create and set working directory
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Copy necessary files from the build stage
COPY --from=BASE --chown=node /home/node/app/node_modules ./node_modules
COPY --from=BASE --chown=node /home/node/app/package.json ./
COPY --from=BASE --chown=node /home/node/app/package-lock.json ./
COPY --from=BASE --chown=node /home/node/app/packages ./packages 
COPY --from=BASE --chown=node /home/node/app/services/auth-service ./services/auth-service

# Install Infisical CLI
USER root
RUN apk add --no-cache bash curl && \
    curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash && \
    apk add infisical

# Switch back to non-root user
USER node

# Add entrypoint script
COPY --chown=node services/auth-service/entrypoint.sh /home/node/app/services/auth-service/entrypoint.sh
RUN chmod +x /home/node/app/services/auth-service/entrypoint.sh

# Set the working directory to the service directory
WORKDIR /home/node/app/services/auth-service

# Set entrypoint
ENTRYPOINT ["/home/node/app/services/auth-service/entrypoint.sh"]