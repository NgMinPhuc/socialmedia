# System Diagrams & Component Explanations

## High-Level Architecture Diagram

```
┌─────────────┐     ┌─────────────┐      ┌─────────────┐
│   Frontend  │────►│ API Gateway │◄────►│ Eureka      │
│  (Web/App)  │     │ (8080)      │      │ Server(8761)│
└─────────────┘     └──────┬──────┘      └─────────────┘
                           │
         ┌────────────┬────┴─────┬────────────┬────────────┬────────────┐
         ▼            ▼          ▼            ▼            ▼            ▼
┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐
│  Auth       ││  User       ││  Post       ││  Chat       ││  Search     ││ Notification│
│Service(8081)││Service(8082)││Service(8083)││Service(8084)││Service(8085)││Service(8086)│
└──────┬──────┘└──────┬──────┘└──────┬──────┘└──────┬──────┘└──────┬──────┘└──────┬──────┘
       │              │              │              │              │              │
       ▼              ▼              ▼              ▼              ▼              ▼
┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐
│ PostgreSQL  ││ PostgreSQL  ││  MongoDB    ││  MongoDB    ││Elasticsearch ││  MongoDB    │
│  Database   ││  Database   ││  Database   ││  Database   ││  Database    ││  Database   │
└─────────────┘└─────────────┘└─────────────┘└─────────────┘└─────────────┘└─────────────┘
```

## Project Folder Structure

```
socialmedia/
│
├── backend/
│   ├── infrastructure/
│   │   ├── api-gateway-service/     # API Gateway (Spring Cloud Gateway)
│   │   │   ├── pom.xml
│   │   │   └── src/
│   │   │       └── main/
│   │   │           ├── java/        # Gateway filters, routes, security
│   │   │           └── resources/   # Configuration
│   │   │
│   │   └── eureka-server/           # Service Discovery (Netflix Eureka)
│   │       ├── pom.xml
│   │       └── src/
│   │           └── main/
│   │               ├── java/        # Eureka server configuration
│   │               └── resources/   # Properties
│   │
│   └── services/
│       ├── authen-service/          # Authentication Service (Spring Boot)
│       │   ├── pom.xml
│       │   └── src/
│       │       ├── main/            # JWT creation/validation, user auth
│       │       └── test/            # Unit tests
│       │
│       ├── chat-service/            # Chat Service (Golang)
│       │   ├── go.mod
│       │   ├── go.sum
│       │   ├── cmd/                 # Entry points and executable files
│       │   └── internal/            # Private application code
│       │       ├── config/
│       │       ├── handlers/        # HTTP and WebSocket handlers
│       │       ├── middleware/      # Auth middleware
│       │       ├── models/          # Data structures
│       │       ├── repository/      # Database interactions
│       │       └── service/         # Business logic
│       │
│       ├── notification-service/    # Notification Service (Spring Boot)
│       │   ├── pom.xml
│       │   └── src/
│       │       ├── main/            # Notification logic
│       │       └── test/            # Unit tests
│       │
│       ├── post-service/            # Post Service (Spring Boot)
│       │   ├── pom.xml
│       │   └── src/
│       │       ├── main/            # Post CRUD, comments, likes
│       │       └── test/            # Unit tests
│       │
│       ├── search-service/          # Search Service (Spring Boot)
│       │   ├── pom.xml
│       │   └── src/
│       │       ├── main/            # Elasticsearch integration
│       │       └── test/            # Unit tests
│       │
│       └── user-service/            # User Service (Spring Boot)
│           ├── pom.xml
│           └── src/
│               ├── main/            # User profiles, following
│               └── test/            # Unit tests
│
├── docs/                            # Documentation
│
└── frontend/
    └── web-app/                     # React Web Application
        ├── package.json             # Dependencies and scripts
        ├── vite.config.ts           # Vite configuration
        └── src/                     # Source code
            ├── components/          # Reusable UI components
            ├── contexts/            # React contexts
            ├── hooks/               # Custom React hooks
            ├── layout/              # Layout components
            ├── pages/               # Page components
            ├── services/            # API client services
            ├── utils/               # Utilities and helpers
            ├── App.jsx              # Main application component
            └── main.jsx             # Entry point
```

## Detailed Component Explanations

### 1. Infrastructure Components

#### API Gateway (Port: 8080)
- **Technology**: Spring Cloud Gateway
- **Purpose**: Entry point for all client requests
- **Key Functions**:
  - Request routing to appropriate services
  - JWT authentication validation
  - Rate limiting
  - Request/response transformation
  - Circuit breaking
  - CORS handling
- **Dependencies**: 
  - Eureka Server (for service discovery)
  - Auth Service (for token validation)
  - Redis (for rate limiting)

#### Eureka Server (Port: 8761)
- **Technology**: Spring Cloud Netflix Eureka
- **Purpose**: Service registration and discovery
- **Key Functions**:
  - Maintain registry of available service instances
  - Health monitoring of registered services
  - Load balancing support
  - Service deregistration on shutdown
- **Dependencies**: None (other services depend on it)

### 2. Core Services

#### Authentication Service (Port: 8081)
- **Technology**: Spring Boot
- **Purpose**: User authentication and authorization
- **Key Functions**:
  - User registration and login
  - JWT token generation and validation
  - Password encryption and verification
  - Token refresh and revocation
  - OAuth provider integration
- **Database**: PostgreSQL
  - Tables: users, roles, refresh_tokens
- **Endpoints**:
  - `POST /auth/register` - New user registration
  - `POST /auth/login` - User login and token generation
  - `POST /auth/validate-token` - JWT validation
  - `POST /auth/refresh-token` - Generate new JWT from refresh token
  - `POST /auth/logout` - Invalidate tokens

#### User Service (Port: 8082)
- **Technology**: Spring Boot
- **Purpose**: User profile management
- **Key Functions**:
  - User profile CRUD operations
  - Follow/unfollow relationships
  - User search
  - Avatar management
  - User preferences
- **Database**: PostgreSQL
  - Tables: user_profiles, followers, user_preferences
- **Endpoints**:
  - `GET /users/{id}` - Get user profile
  - `PUT /users/{id}` - Update user profile
  - `GET /users/{id}/followers` - List user followers
  - `GET /users/{id}/following` - List users being followed
  - `POST /users/{id}/follow` - Follow a user
  - `DELETE /users/{id}/follow` - Unfollow a user

#### Post Service (Port: 8083)
- **Technology**: Spring Boot
- **Purpose**: Content management
- **Key Functions**:
  - Create/read/update/delete posts
  - Comment management
  - Like/unlike functionality
  - Feed generation
  - Content recommendations
- **Database**: MongoDB
  - Collections: posts, comments, likes, media
- **Endpoints**:
  - `GET /posts` - Get post feed
  - `POST /posts` - Create a new post
  - `GET /posts/{id}` - Get specific post
  - `PUT /posts/{id}` - Update post
  - `DELETE /posts/{id}` - Delete post
  - `POST /posts/{id}/like` - Like a post
  - `DELETE /posts/{id}/like` - Unlike a post
  - `GET /posts/{id}/comments` - Get post comments
  - `POST /posts/{id}/comments` - Add comment to post

#### Chat Service (Port: 8084)
- **Technology**: Go (Golang)
- **Purpose**: Real-time messaging
- **Key Functions**:
  - Direct messaging
  - Group chats
  - Message status tracking
  - Online presence detection
  - Message history
- **Database**: MongoDB
  - Collections: conversations, messages, participants
- **Endpoints**:
  - `GET /chat/conversations` - List user conversations
  - `POST /chat/conversations` - Create new conversation
  - `GET /chat/conversations/{id}/messages` - Get messages
  - `POST /chat/conversations/{id}/messages` - Send message
  - `WS /chat/ws` - WebSocket endpoint for real-time messages

#### Search Service (Port: 8085)
- **Technology**: Spring Boot
- **Purpose**: Full-text search across services
- **Key Functions**:
  - User search
  - Content search
  - Hashtag search
  - Trending topics
  - Search suggestions
- **Database**: Elasticsearch
  - Indices: users, posts, hashtags
- **Endpoints**:
  - `GET /search/users?q={query}` - Search users
  - `GET /search/posts?q={query}` - Search posts
  - `GET /search/hashtags?q={query}` - Search hashtags
  - `GET /search/trending` - Get trending topics

#### Notification Service (Port: 8086)
- **Technology**: Spring Boot
- **Purpose**: User notifications
- **Key Functions**:
  - Generate and store notifications
  - Retrieve user notifications
  - Mark notifications as read
  - Real-time notification delivery
  - Notification preferences
- **Database**: MongoDB
  - Collections: notifications, user_preferences
- **Endpoints**:
  - `GET /notifications` - Get user notifications
  - `PUT /notifications/{id}/read` - Mark notification as read
  - `PUT /notifications/read-all` - Mark all as read
  - `PUT /notifications/preferences` - Update notification preferences

## Communication Patterns

### REST API Communication
```
┌─────────┐     HTTP Request      ┌─────────┐
│ Service │───────────────────────►│ Service │
│    A    │                       │    B    │
│         │◄───────────────────────│         │
└─────────┘     HTTP Response      └─────────┘
```

### Event-Based Communication
```
┌─────────┐  Publish   ┌─────────┐  Subscribe  ┌─────────┐
│ Service │───────────►│  Kafka  │◄────────────│ Service │
│Producer │            │ Topic   │             │Consumer │
└─────────┘            └─────────┘             └─────────┘
```

### WebSocket Communication
```
┌─────────┐  Connect   ┌─────────────┐
│  Client │───────────►│ WebSocket   │
│         │◄───────────│   Server    │
└─────────┘  Messages  └─────────────┘
                            │
                            ▼
                       ┌─────────┐
                       │ Service │
                       │ Logic   │
                       └─────────┘
```

## Security Model

```
┌─────────┐       ┌─────────────────┐      ┌────────────┐
│  Login  │──────►│  Auth Service   │─────►│  Generate  │
│ Request │       │  (Validate)     │      │    JWT     │
└─────────┘       └─────────────────┘      └─────┬──────┘
                                                 │
                                                 ▼
┌─────────────┐   ┌─────────────────┐      ┌────────────┐
│ API Request │──►│   API Gateway   │─────►│  Validate  │
│ with JWT    │   │   (Intercept)   │      │    JWT     │
└─────────────┘   └───────────┬─────┘      └─────┬──────┘
                              │                  │
                              ▼                  ▼
                     ┌─────────────────┐  ┌────────────┐
                     │  Target Service │  │   Access   │
                     │  (Process)      │  │  Granted   │
                     └─────────────────┘  └────────────┘
```

## Data Flow for Key Operations

### User Registration Flow
```
┌─────────┐  1. Register   ┌─────────────┐  2. Create User  ┌─────────────┐
│  Client │───────────────►│     API     │────────────────►│    Auth     │
│         │                │   Gateway   │                 │   Service    │
└─────────┘                └─────────────┘                 └──────┬──────┘
                                                                 │
    ┌───────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────┐  4. Return    ┌─────────────┐  3. Create    ┌─────────────┐
│   Client    │◄──────────────│     API     │◄───────────────│    User     │
│             │   Response    │   Gateway   │   Profile     │   Service    │
└─────────────┘               └─────────────┘               └─────────────┘
```

### Post Creation Flow
```
┌─────────┐  1. Create Post  ┌─────────────┐  2. Validate   ┌─────────────┐
│  Client │────────────────►│     API     │────────────────►│    Auth     │
│         │                 │   Gateway   │     Token      │   Service    │
└─────────┘                 └──────┬──────┘                └─────────────┘
                                   │
                                   ▼
┌─────────┐  5. Response    ┌─────────────┐  3. Create     ┌─────────────┐
│ Client  │◄────────────────│     API     │◄───────────────│    Post     │
│         │                 │   Gateway   │     Post       │   Service    │
└─────────┘                 └─────────────┘                └──────┬──────┘
                                                                 │
                                                                 ▼
                                                          ┌─────────────┐
                                                          │  4. Publish │
                                                          │ Post Event  │
                                                          └─────────────┘
                                                                 │
                            ┌────────────────────────────────────┼─────────────────────┐
                            ▼                                    ▼                     ▼
                     ┌─────────────┐                     ┌─────────────┐        ┌─────────────┐
                     │    Search   │                     │Notification │        │   Feed      │
                     │   Service   │                     │   Service   │        │  Generator  │
                     └─────────────┘                     └─────────────┘        └─────────────┘
```
