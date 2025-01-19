# Developing Guide

This document provides guidelines for setting up a development environment and contributing to the **Monorepo Authentication System**. Follow these steps to ensure a smooth development process.

## Prerequisites

Make sure you have the following tools installed:

- **Node.js**: v16 or higher
- **npm** or **yarn**: For managing dependencies
- **Docker** and **Docker Compose**: For containerization
- **Redis**: For local caching and session management
- **PostgreSQL**: For database operations

## Repository Structure

```
monorepo-authentication-system/
├── .github/               # GitHub-specific configurations
├── .husky/                # Git hooks for enforcing standards
├── docs/                  # Documentation files (e.g., mkdocs)
├── node_modules/          # Node.js dependencies
├── packages/              # Shared libraries or utilities
├── services/              # Microservices (e.g., frontend, backend)
├── .cz-config.js          # Commitizen configuration
├── .gitignore             # Ignored files and directories
├── catalog-info.yml       # Backstage catalog information
├── commitlint.config.js   # Commit message linting configuration
├── DEVELOPING.md          # Development guide (this document)
├── lerna.json             # Lerna configuration for monorepo management
├── mkdocs.yml             # MkDocs configuration for documentation
├── package-lock.json      # Locked dependency tree
├── package.json           # Project metadata and scripts
├── README.md              # General project information
├── tsconfig.json          # TypeScript configuration
```

## Setting Up the Development Environment

### Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/your-repo/monorepo-authentication-system.git
```

### Step 2: Install Dependencies

Navigate to the root directory and install dependencies:

```bash
npm install
```

For specific services or packages, navigate to their respective directories under `services/` or `packages/` and install dependencies individually if necessary:

```bash
cd services/backend
npm install
```

### Step 3: Configure Environment Variables

Each service or package may have its own `.env` file. Create `.env` files based on the `.env.example` templates provided in the respective directories. Ensure the variables are updated to reflect your local setup.

### Step 4: Start Services

#### Using Docker Compose

Run the entire stack using Docker Compose:

```bash
docker-compose up --build
```

#### Running Locally

If you prefer to run each service separately:

- **Frontend**:
  ```bash
  cd services/frontend
  npm run dev
  ```
  The application will be available at `http://localhost:3000` by default.

- **Backend**:
  ```bash
  cd services/backend
  npm start
  ```
  The API will be available at `http://localhost:4000` by default.

## Code Standards

### Frontend

- Follow the Svelte best practices for component design.
- Use TypeScript for type safety.
- Run the linter before committing:
  ```bash
  npm run lint
  ```

### Backend

- Follow the LoopBack 4 coding standards.
- Use TypeScript and strict typing.
- Run tests before committing:
  ```bash
  npm test
  ```

## Debugging

### Frontend

Use the browser's developer tools for debugging. Enable Svelte DevTools for easier debugging of Svelte components.

### Backend

- Enable detailed logs by setting the `LOG_LEVEL` environment variable to `debug` in your `.env` file.
- Use a debugger by starting the backend with:
  ```bash
  npm run debug
  ```

## Writing Tests

- **Frontend**: Use `@testing-library/svelte` for component testing.
- **Backend**: Use `mocha` and `chai` for API tests.
- Run tests for both projects:
  - Frontend:
    ```bash
    npm run test
    ```
  - Backend:
    ```bash
    npm test
    ```

## Documentation

Documentation is managed using **MkDocs**. To view or update documentation:

1. Navigate to the `docs/` directory.
2. Run the development server:
   ```bash
   mkdocs serve
   ```
3. Open `http://127.0.0.1:8000` to view the documentation.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add description of your feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Submit a pull request.

## Additional Notes

- Ensure code coverage does not drop below the current level.
- Document any new features or changes in the respective `README.md` or code comments.

## Contact

For any questions or support during development, please contact [wekesa@truden.tech](mailto:wekesa@truden.tech).

