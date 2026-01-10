# Pokemon Users API

A RESTful API built with Express.js and Prisma for managing users and their Pokemon collections. This application integrates with the [PokeAPI](https://pokeapi.co/) to fetch Pokemon details.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Running with Docker](#running-with-docker)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Architecture Decisions](#architecture-decisions)
- [Areas for Improvement](#areas-for-improvement)

## ✨ Features

- **User Management**: Create, read, update, and delete users
- **Pokemon Integration**: Fetch Pokemon details from PokeAPI
- **User Pokemon Collections**: Associate Pokemon IDs with users and retrieve their details
- **API Documentation**: Interactive Swagger UI documentation
- **Database Migrations**: Prisma migrations for schema management
- **Docker Support**: Containerized application with separate production and testing databases
- **Comprehensive Testing**: Jest integration tests with database isolation

## 🛠 Tech Stack

- **Runtime**: Node.js 18.20.7
- **Framework**: Express.js 5.1.0
- **Database**: SQLite with Prisma ORM 6.19.0
- **Validation**: Joi 17.13.3
- **API Documentation**: Swagger (swagger-ui-express, swagger-jsdoc)
- **Testing**: Jest 30.2.0 with Supertest
- **Containerization**: Docker & Docker Compose
- **Code Quality**: ESLint & Prettier

## 📦 Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Docker and Docker Compose (for containerized deployment)
- Port 5173 available

## 🚀 Project Setup

### Local Development Setup

```bash
# Install dependencies
$ npm install

# Generate Prisma Client
$ npx prisma generate

# Run migrations
$ npx prisma migrate deploy
```

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```bash
# Application Configuration
NODE_ENV=development
PORT=5173

# Database Configuration
DATABASE_URL=file:./dev.db

# Pokemon API Configuration
POKEAPI_URL=https://pokeapi.co/api/v2
```

For testing, the configuration is handled automatically by the test scripts using `./test.db`.

## 🏃 Running the Application

### Development Mode (with hot-reload)

```bash
$ npm run dev
```

### Production Mode

```bash
$ npm run start
```

The API will be available at `http://localhost:5173`

## 🐳 Running with Docker

### Quick Start

```bash
# Build and start containers
$ docker compose up -d

# Initialize databases (first time only)
$ docker exec -it pokemon-app sh -c "chmod +x init-databases.sh && ./init-databases.sh"
```

### Docker Commands

```bash
# View logs
$ docker compose logs -f app

# Stop containers
$ docker compose down

# Rebuild after code changes
$ docker compose build
$ docker compose up -d

# Clean up (removes volumes and data)
$ docker compose down -v
```

For detailed Docker usage, see [README.DOCKER-MULTI.md](README.DOCKER-MULTI.md).

## 📚 API Documentation

Interactive API documentation is available via Swagger UI:

- **Local**: http://localhost:5173/api-docs
- **Docker**: http://localhost:5173/api-docs

### Available Endpoints

| Method | Endpoint             | Description                         |
| ------ | -------------------- | ----------------------------------- |
| GET    | `/users`             | Get all users                       |
| GET    | `/users/:id`         | Get user by ID with Pokemon details |
| POST   | `/users`             | Create a new user                   |
| PUT    | `/users/:id`         | Update user information             |
| PUT    | `/users/:id/pokemon` | Update user's Pokemon IDs           |
| DELETE | `/users/:id`         | Delete a user                       |

### Example Request

```bash
# Create a new user
curl -X POST http://localhost:5173/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ash",
    "email": "ash@pokemon.com",
    "password": "pikachu123",
    "pokemonIds": [25, 6, 143]
  }'

# Get user with Pokemon details
curl http://localhost:5173/users/1
```

## 🧪 Testing

### Run Tests Locally

```bash
# Run all tests
$ npm test

# Run tests with coverage
$ npm run test:cov
```

### Run Tests in Docker

```bash
# Execute tests in the container
$ docker exec -it pokemon-app sh -c "chmod +x run-tests.sh && ./run-tests.sh"
```

### Test Structure

Tests are organized in the `/test` directory:

- `users.spec.js` - Integration tests for user endpoints
- `setup.js` - Test environment setup
- `teardown.js` - Test cleanup
- `helpers.js` - Test utilities

All tests use a separate SQLite database (`test.db`) to ensure isolation from development data.

## 📁 Project Structure

```
.
├── src/
│   ├── app.js                     # Express app configuration
│   ├── clients/
│   │   └── pokemon.client.js      # PokeAPI client
│   ├── users/
│   │   ├── users.controller.js    # User routes
│   │   ├── users.service.js       # Business logic
│   │   ├── users.repository.js    # Database operations
│   │   └── dto/                   # Data Transfer Objects
│   ├── swagger/
│   │   ├── swagger.js             # Swagger configuration
│   │   └── swagger.yml            # API documentation
│   └── generated/
│       └── prisma/                # Generated Prisma Client
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Migration history
├── test/
│   ├── users.spec.js              # Integration tests
│   ├── setup.js                   # Test setup
│   ├── teardown.js                # Test cleanup
│   └── helpers.js                 # Test utilities
├── Dockerfile                     # Docker configuration
├── compose.yaml                   # Docker Compose configuration
├── init-databases.sh              # Database initialization script
├── run-tests.sh                   # Test execution script
└── README.md                      # This file
```

## 🏗 Architecture Decisions

### Why Express.js?

Lightweight and flexible framework perfect for RESTful APIs. Minimal boilerplate with excellent middleware support.

### Why Prisma?

Modern ORM with type-safe database access, excellent migration support, and great developer experience. Generated client provides autocomplete and type checking.

### Why SQLite?

- **Simplicity**: Zero configuration, single file database
- **Portability**: Easy to backup and move between environments
- **Performance**: Sufficient for the application scale
- **Development**: Fast setup for local development and testing

### Why Docker?

- **Consistency**: Same environment across all machines
- **Isolation**: Separate databases for production and testing
- **Portability**: Easy deployment to any Docker-enabled environment
- **Volume Persistence**: Data survives container restarts

### Clean Architecture Pattern

- **Separation of Concerns**: Controllers, Services, and Repositories are clearly separated
- **Testability**: Each layer can be tested independently
- **Maintainability**: Changes in one layer don't affect others
- **Scalability**: Easy to extend with new features

### DTOs (Data Transfer Objects)

Validation and data transformation logic is centralized, ensuring consistent data handling across the application.

## 🔧 Areas for Improvement

### Security

- [ ] Implement password hashing (bcrypt)
- [ ] Add JWT authentication
- [ ] Implement rate limiting
- [ ] Add CORS configuration
- [ ] Input sanitization

### Database

- [ ] Consider PostgreSQL for production
- [ ] Add database connection pooling
- [ ] Implement soft deletes
- [ ] Add database indexes for performance
- [ ] Create more comprehensive seed data

### Testing

- [ ] Add unit tests for services and repositories
- [ ] Increase test coverage (aim for >80%)
- [ ] Add performance tests
- [ ] Mock PokeAPI responses more comprehensively
- [ ] Add CI/CD pipeline tests

### API

- [ ] Implement pagination for user list
- [ ] Add filtering and sorting capabilities
- [ ] Implement API versioning
- [ ] Add request logging (Morgan/Winston)
- [ ] Implement GraphQL endpoint

### Documentation

- [ ] Add API usage examples
- [ ] Create contribution guidelines
- [ ] Add architecture diagrams
- [ ] Document error codes
- [ ] Add changelog

### DevOps

- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Add health check endpoint
- [ ] Implement monitoring (Prometheus/Grafana)
- [ ] Add logging aggregation
- [ ] Deploy to cloud platform (Heroku, AWS, or Railway)

## 📄 License

This project is [MIT licensed](LICENSE).

## 👤 Author

**Hernan**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!
