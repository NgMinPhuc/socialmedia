# Social Media Platform

A microservices-based social media platform built with Spring Boot, featuring user authentication, post management, and search functionality.

## System Architecture

The platform consists of the following microservices:

1. **Authentication Service** (Port 8081)
   - User registration and login
   - JWT token management
   - Password management
   - Role-based access control

2. **User Service** (Port 8082)
   - User profile management
   - Avatar upload and management
   - User information CRUD operations

3. **Post Service** (Port 8083)
   - Post creation and management
   - Comment system
   - Media file handling
   - Privacy settings

4. **Search Service** (Port 8085)
   - Full-text search for posts and users
   - Elasticsearch integration
   - Search result pagination and sorting

5. **API Gateway** (Port 8080)
   - Request routing
   - Load balancing
   - Rate limiting
   - CORS configuration

6. **Eureka Server** (Port 8761)
   - Service discovery
   - Service registration
   - Health monitoring

## Technology Stack

- **Backend Framework**: Spring Boot 3.x
- **Database**: MongoDB
- **Search Engine**: Elasticsearch
- **Service Discovery**: Spring Cloud Eureka
- **API Gateway**: Spring Cloud Gateway
- **Security**: Spring Security, JWT
- **File Storage**: Local file system
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Java 17 or higher
- Maven 3.8.x
- MongoDB 6.x
- Elasticsearch 8.x

## Getting Started

1. **Clone the repository**
   ```bash

   ```

2. **Configure MongoDB**
   - Install MongoDB
   - Create a database named `socialmedia`
   - Update MongoDB connection settings in each service's `application.yaml`

3. **Configure Elasticsearch**
   - Install Elasticsearch
   - Start Elasticsearch service
   - Update Elasticsearch connection settings in search service

4. **Build the project**
   ```bash
   mvn clean install
   ```

5. **Start the services**
   ```bash
   # Start Eureka Server first
   cd eureka-server
   mvn spring-boot:run

   # Start other services
   cd ../api-gateway-service
   mvn spring-boot:run

   # Start remaining services in any order
   cd ../authen-service
   mvn spring-boot:run
   # ... repeat for other services
   ```

## API Documentation

API documentation is available through Swagger UI at:
- API Gateway:
- Individual Services:

## Service Details

### Authentication Service
- Handles user authentication and authorization
- JWT token generation and validation
- Password encryption and validation
- User registration and login
- Token refresh mechanism

### User Service
- User profile management
- Avatar upload and retrieval
- User information updates
- Profile privacy settings
- User search functionality

### Post Service
- Post creation and management
- Media file upload and storage
- Comment system
- Post privacy settings
- Post search and filtering

### Search Service
- Full-text search for posts and users
- Search result pagination
- Search result sorting
- Search result highlighting

## Security

- JWT-based authentication
- Role-based access control
- Password encryption
- CORS configuration
- Rate limiting
- Input validation
- XSS protection
- CSRF protection

## Development Guidelines

1. **Code Style**
   - Follow Google Java Style Guide
   - Use meaningful variable and method names
   - Add proper documentation
   - Write unit tests

2. **Git Workflow**
   - Use feature branches
   - Write meaningful commit messages
   - Create pull requests for code review
   - Keep commits atomic and focused

3. **Testing**
   - Write unit tests for all services
   - Write integration tests
   - Maintain test coverage above 80%
   - Use test containers for integration tests

4. **Documentation**
   - Keep API documentation up to date
   - Document all configuration changes
   - Maintain changelog
   - Document deployment procedures

## Deployment

1. **Development**
   - Run services locally
   - Use local MongoDB and Elasticsearch
   - Use local file system for storage

2. **Production**
   - Deploy to production environment
   - Use production databases
   - Configure production-specific settings
   - Set up monitoring and alerting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
