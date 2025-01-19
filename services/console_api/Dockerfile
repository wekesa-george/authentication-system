# Use the official Node.js 20 image with Alpine Linux
FROM node:20-alpine

# Install Infisical CLI as root
USER root 
RUN apk add --no-cache bash curl && \
    curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash && \
    apk add infisical

# Switch back to the node user
USER node

# Create and set the working directory
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Copy package files and set ownership to node
COPY --chown=node package*.json ./

# Copy entrypoint.sh and set ownership to node
COPY --chown=node entrypoint.sh ./

# **Set execute permissions on entrypoint.sh as node user**
RUN chmod +x entrypoint.sh

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY --chown=node . .
RUN chmod +x /home/node/app/entrypoint.sh
# Build the application
RUN npm run build

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3031

# Expose the application port
EXPOSE ${PORT}

# Define the entrypoint
ENTRYPOINT ["/home/node/app/entrypoint.sh"]
