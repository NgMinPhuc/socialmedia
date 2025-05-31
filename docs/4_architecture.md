# System Architecture

## Microservices Architecture Overview

The Social Media Platform implements a microservices architecture to ensure scalability, maintainability, and flexibility. Each service is responsible for a specific domain and can be developed, deployed, and scaled independently.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                     │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────────┐  │
│  │ Web App  │   │Mobile App│   │  Admin   │   │3rd Party Services│  │
│  │(React.js)│   │(Flutter) │   │Dashboard │   │     (APIs)       │  │
│  └────┬─────┘   └────┬─────┘   └────┬─────┘   └────────┬─────────┘  │
└───────┼───────────────┼───────────────┼────────────────┼────────────┘
        │               │               │                │
        └───────────────┼───────────────┼────────────────┘
                        │               │
                        ▼               ▼
┌────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (port 8080)                       │
│  ┌────────────────┐  ┌─────────────┐  ┌────────────┐  ┌─────────┐  │
│  │Request Routing │  │Authentication│  │Rate Limiting│  │Logging │  │
│  └────────────────┘  └─────────────┘  └────────────┘  └─────────┘  │
└───────────┬──────────────────┬───────────────┬───────────┬─────────┘
            │                  │               │           │
            ▼                  ▼               ▼           ▼
┌────────────────┐  ┌───────────────┐  ┌─────────────┐  ┌────────────┐
│                │  │ SERVICE       │  │             │  │            │
│ Auth Service   │  │ DISCOVERY     │  │User Service │  │Post Service│
│ (port 8081)    │◄─┤ Eureka Server │◄─┤(port 8082)  │  │(port 8083) │
│                │  │ (port 8761)   │  │             │  │            │
└────────┬───────┘  └───────────────┘  └──────┬──────┘  └─────┬──────┘
         │                                    │               │
         │        ┌────────────────┐          │               │
         │        │                │          │               │
         └───────►│   Redis Cache  │◄─────────┘               │
                  │                │                          │
                  └────────────────┘                          │
            ┌───────────────┐                ┌────────────────┴──────┐
            │               │                │                       │
┌───────────▼──────┐  ┌─────▼─────┐    ┌─────▼───────┐    ┌──────────▼────┐
│                  │  │           │    │             │    │               │
│Chat Service      │  │Notification│    │Search Service│    │Elasticsearch   │
│(port 8084, Go)   │  │Service     │    │(port 8085)   │    │(port 9200)    │
│                  │  │(port 8086) │    │             │    │               │
└──────────────────┘  └───────────┘    └─────────────┘    └───────────────┘
```

## Core Architectural Principles

1. **Service Independence**: Each microservice operates independently with its own database
2. **API Gateway Pattern**: Centralized entry point for all client requests
3. **Service Discovery**: Dynamic service registration and discovery
4. **Database-per-Service**: Each service manages its own data
5. **Eventual Consistency**: Asynchronous updates across services
6. **Authentication Delegation**: Centralized auth service with token validation

## Request Flow

1. **Client Request**: Client sends request to API Gateway (port 8080)
2. **Authentication**: Gateway validates JWT token with Auth Service
3. **Request Routing**: Gateway routes request to appropriate service
4. **Service Processing**: Target service processes request, communicating with other services if needed
5. **Response**: Response flows back through gateway to client

## Service Interactions

### Synchronous Communication (REST)
- Used for direct service-to-service calls requiring immediate response
- Implemented via RestTemplate and WebClient
- Protected by circuit breakers to prevent cascading failures

### Asynchronous Communication (Kafka)
- Used for events that don't require immediate processing
- Enables eventual consistency across service boundaries
- Services publish events when state changes occur
- Interested services subscribe to relevant events

### Service Discovery
- Netflix Eureka used for service registry
- Services register on startup with health endpoint
- Clients discover services by logical name, not hardcoded URLs
- Enables dynamic scaling and failover

## JWT Authentication Flow

1. **Registration/Login**: User authenticates with Auth Service
2. **Token Generation**: Auth Service generates JWT with user claims
3. **Token Storage**: Client stores JWT in secure storage
4. **Request Authentication**: JWT included in request headers
5. **Token Validation**: API Gateway validates token structure and signature
6. **Claims Extraction**: Services extract user claims from validated token

## Database Strategy

### Polyglot Persistence
- Different database technologies selected based on service needs:
  - **PostgreSQL**: User data, authentication (ACID transactions)
  - **MongoDB**: Content storage, comments, notifications (document flexibility)
  - **Neo4j**: Social graph (relationship optimization)
  - **Redis**: Caching, session storage, real-time features
  - **Elasticsearch**: Search indexing (full-text search)

### Data Consistency
- Each service owns its data exclusively
- Cross-service data access via API calls only
- Eventual consistency maintained via event publishing

## Scalability Approach

### Horizontal Scaling
- Stateless services designed for horizontal scaling
- API Gateway routes to available instances
- Eureka handles service registration/deregistration

### Vertical Scaling
- Database services benefit from vertical scaling
- Sharding strategy prepared for data growth

### Caching Strategy
- Redis used for distributed caching
- Multiple cache levels:
  - Application-level caching
  - API response caching
  - Database query caching

## Fault Tolerance

### Circuit Breakers
- Prevent cascading failures across services
- Automatically detect and handle service outages
- Graceful degradation when dependencies fail

### Retry Mechanisms
- Automatic retry for transient failures
- Exponential backoff to prevent overloading

### Fallbacks
- Default behaviors when services are unavailable
- Cached data served when live data unavailable

## API Gateway Functions

1. **Routing**: Routes requests to appropriate services
2. **Authentication**: Validates JWT tokens
3. **Rate Limiting**: Prevents API abuse
4. **Response Transformation**: Formats responses consistently
5. **Circuit Breaking**: Prevents cascading failures
6. **Request Logging**: Captures request metadata
7. **CORS Handling**: Manages cross-origin requests

## Deployment Model

- Containerized deployment with Docker
- Service-specific configuration via environment variables
- Independent scaling per service
- Blue/green deployment capability
