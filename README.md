# Monorepo Authentication System

This repository contains a showcase of a multitenant authentication system, including both the front-end and back-end components. It demonstrates advanced technical skills using **Svelte** for the front-end and **LoopBack 4** for the back-end, with **Redis** and **PostgreSQL** as supporting technologies.

## Purpose

This project is a demonstration of technical expertise in building authentication systems. It is not fully configured for reuse or production environments but serves as a showcase of capabilities in creating:

- A multitenant authentication architecture.
- Seamless integration between front-end and back-end.
- Efficient caching with Redis.
- Scalable database management with PostgreSQL.

## Technologies Used

### Front-End
- **Svelte**: A modern, fast, and lightweight JavaScript framework for building user interfaces.

### Back-End
- **LoopBack 4**: A flexible Node.js framework for building APIs and handling multitenancy.
- **Redis**: Used for caching and session management to improve system performance.
- **PostgreSQL**: A powerful open-source database used for secure and scalable data storage.

## Features

- **Multitenancy**: Designed to handle multiple tenants with isolated authentication logic and data.
- **Modular Design**: Separation of front-end and back-end for better maintainability.
- **Scalable Architecture**: Uses Redis and PostgreSQL to support high-performance operations.

## Limitations

This project is not ready for production use as it lacks:
- Comprehensive error handling.
- Deployment pipelines.
- Complete security hardening.
- Documentation for customizations.

## Getting Started

### Prerequisites
- Node.js (v16 or higher) and npm/yarn.
- Docker and Docker Compose.
- Redis server.
- PostgreSQL database.

### Setup
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/monorepo-authentication-system.git
   ```

2. **Install Dependencies**
   Navigate to the respective folders and install dependencies:
   - For the front-end:
     ```bash
     cd frontend
     npm install
     ```
   - For the back-end:
     ```bash
     cd backend
     npm install
     ```

3. **Environment Variables**
   Create `.env` files for both front-end and back-end based on the provided `.env.example` templates. Update values according to your setup.

4. **Run with Docker**
   Use Docker Compose to build and run the system:
   ```bash
   docker-compose up --build
   ```

## Usage

### Front-End
The front-end application can be accessed at `http://localhost:3000` (default port).

### Back-End
The back-end API can be accessed at `http://localhost:4000` (default port).

### Sample API Endpoints
- `POST /api/auth/login` - Authenticate a user.
- `POST /api/auth/register` - Register a new user.
- `GET /api/auth/tenants` - List tenants.

## Contributions

This repository is primarily a technical showcase. Contributions are welcome, but note that the system is not designed for immediate production use. If you wish to contribute, please open an issue or submit a pull request.

## License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

## Contact

For any questions or inquiries, please contact [your-email@example.com](mailto:your-email@example.com).

