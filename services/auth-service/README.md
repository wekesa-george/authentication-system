# Authentication Service

This project is a backend authentication service built using the [SourceFuse Authentication Microservice](https://github.com/sourcefuse/loopback4-authentication). It relies on **Infisical** for secrets management, **PostgREST** for database interactions, and **Redis** for caching. The service is containerized using Docker, with environment variables injected at runtime using an `entrypoint.sh` script.

## Features

- Secure user authentication and management
- Environment variables managed via Infisical
- PostgREST integration for PostgreSQL database access
- Redis caching for improved performance
- Docker containerization for portability

## Environment Variables

The application requires the following environment variables to be set. Below is the structure of the `.env.example` file:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Infisical Configuration
INFISICAL_TOKEN=your_infisical_service_token
INFISICAL_PROJECT_ID=your_project_id

# Application Configuration
APP_PORT=3000
JWT_SECRET=your_jwt_secret
LOG_LEVEL=info
```

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Access to an Infisical account
- PostgreSQL database
- Redis server

### Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/authentication-service.git
   ```

2. Navigate to the project directory:

   ```bash
   cd authentication-service
   ```

3. Create a `.env` file by copying the `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your environment-specific values.

4. Run the service using Docker:

   ```bash
   docker build -t authentication-service .
   docker run --env-file .env -p 3000:3000 authentication-service
   ```

## Docker Configuration

The `Dockerfile` is configured to build the authentication service. Environment variables are injected at runtime using the `entrypoint.sh` script to fetch secrets from Infisical.

## Usage

Once the service is running, you can access the API on `http://localhost:3000`.

### Sample Endpoints

- `POST /auth/login` - Authenticate a user
- `POST /auth/register` - Register a new user
- `GET /auth/profile` - Fetch the authenticated user's profile


## Contact

For any questions or support, please contact [wekesa@truden.tech](mailto:wekesa@truden.tech).
