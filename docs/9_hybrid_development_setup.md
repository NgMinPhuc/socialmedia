# Social Media Microservices - Hybrid Development Setup Guide

## Overview

This project uses a **Hybrid Development Setup** where services run locally while databases run in Docker containers:

- **🐳 Infrastructure (Docker)**: Databases, cache, search engines
- **🚀 Services (Local)**: Backend microservices and frontend application  
- **📋 Management Scripts**: Automated startup and monitoring scripts

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LOCAL DEVELOPMENT                        │
├─────────────────┬───────────────────┬───────────────────────┤
│  Backend (Java) │   Backend (Go)    │    Frontend (React)   │
│                 │                   │                       │
│ • Auth Service  │ • Chat Service    │ • Web Application     │
│   (Port 8081)   │   (Port 8084)     │   (Port 5173)         │
│ • User Service  │                   │                       │
│   (Port 8082)   │                   │                       │
│ • Post Service  │                   │                       │
│   (Port 8083)   │                   │                       │
│ • Notification  │                   │                       │
│   (Port 8086)   │                   │                       │
│ • Search Service│                   │                       │
│   (Port 8085)   │                   │                       │
│ • API Gateway   │                   │                       │
│   (Port 8080)   │                   │                       │
│ • Eureka Server │                   │                       │
│   (Port 8761)   │                   │                       │
└─────────────────┴───────────────────┴───────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   DOCKER NETWORK  │
                    │  (localhost)      │
                    └─────────┬─────────┘
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                    INFRASTRUCTURE (DOCKER)                    │
├─────────────┬─────────────┬─────────────┬─────────────────────┤
│ Databases   │   Cache     │   Search    │   Optional          │
│             │             │   Engine    │                     │
│ PostgreSQL  │   Redis     │ Elasticsearch│   Kafka (Future)   │
│ (Port 5432) │ (Port 6379) │ (Port 9200) │   Neo4j Web UI      │
│ MongoDB     │             │             │   (Port 7474)       │
│ (Port 27017)│             │             │                     │
│ Neo4j       │             │             │                     │
│ (Port 7687) │             │             │                     │
└─────────────┴─────────────┴─────────────┴─────────────────────┘
```

## Prerequisites

- ✅ **Docker and Docker Compose** - For running infrastructure services
- ✅ **JDK 21** - For running Java Spring Boot services  
- ✅ **Go 1.20+** - For running the Chat service
- ✅ **Node.js 18+** - For running the React frontend
- ✅ **Git** - For version control
- ✅ **Maven** - Bundled with each service via Maven Wrapper (`./mvnw`)

## Quick Start (Automated)

The project includes management scripts for easy development:

### 🚀 Start All Services
```bash
cd /Users/blake/Desktop/socialmedia
./start-services.sh
```

This script will:
1. Start infrastructure services (databases) in Docker
2. Start backend services in the correct order with health checks
3. Display service URLs and status

### 🔍 Check Service Status  
```bash
./check-services.sh
```

### 🛑 Stop All Services
```bash
./stop-services.sh
```

### ⚠️ Force Stop (if needed)
```bash
./force-stop.sh
```

## Manual Setup (Step by Step)

If you prefer to start services manually or need to troubleshoot:

### Step 1: Clone the repository
```bash
git clone <repository-url>
cd socialmedia
```

### Step 2: Start Infrastructure Services

Create a `docker-compose.yml` file in the root directory:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: socialmedia-postgres
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: 123456
      POSTGRES_DB: authdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongodb:
    image: mongo:6
    container_name: socialmedia-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: 123456
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  neo4j:
    image: neo4j:5
    container_name: socialmedia-neo4j
    environment:
      NEO4J_AUTH: neo4j/password
    ports:
      - "7474:7474"  # HTTP
      - "7687:7687"  # Bolt
    volumes:
      - neo4j_data:/data

  redis:
    image: redis:7
    container_name: socialmedia-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  elasticsearch:
    image: elasticsearch:8.9.0
    container_name: socialmedia-elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
    ports:
      - "9200:9200"
      - "9300:9300"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

volumes:
  postgres_data:
  mongodb_data:
  neo4j_data:
  redis_data:
  elasticsearch_data:
```

Start infrastructure:
```bash
docker-compose up -d
```

### Step 3: Verify Infrastructure
```bash
docker ps
```
You should see 5 containers running:
- `socialmedia-postgres`
- `socialmedia-mongodb` 
- `socialmedia-neo4j`
- `socialmedia-redis`
- `socialmedia-elasticsearch`

### Step 4: Start Backend Services (In Order)

**🔧 1. Start Eureka Server (Service Discovery)**
```bash
cd backend/infrastructure/eureka-server
./mvnw spring-boot:run
```
Wait for: `Eureka Server ready at http://localhost:8761`

**🔐 2. Start Authentication Service**
```bash
cd backend/services/authen-service  
./mvnw spring-boot:run
```
Wait for: `Auth Service ready at http://localhost:8081`

**👤 3. Start User Service**
```bash
cd backend/services/user-service
./mvnw spring-boot:run
```
Wait for: `User Service ready at http://localhost:8082`

**📝 4. Start Post Service**
```bash
cd backend/services/post-service
./mvnw spring-boot:run
```
Wait for: `Post Service ready at http://localhost:8083`

**💬 5. Start Chat Service (Go)**
```bash
cd backend/services/chat-service
go run cmd/main.go
```
Wait for: `Chat Service ready at http://localhost:8084`

**🔍 6. Start Search Service**
```bash
cd backend/services/search-service
./mvnw spring-boot:run
```
Wait for: `Search Service ready at http://localhost:8085`

**🔔 7. Start Notification Service**
```bash
cd backend/services/notification-service
./mvnw spring-boot:run
```
Wait for: `Notification Service ready at http://localhost:8086`

**🌐 8. Start API Gateway (Last)**
```bash
cd backend/infrastructure/api-gateway-service
./mvnw spring-boot:run
```
Wait for: `API Gateway ready at http://localhost:8080`

### Step 5: Start Frontend Application
```bash
cd frontend/web-app
npm install
npm run dev
```
Frontend will be available at: `http://localhost:5173`

## Service Health Checks

After starting all services, verify they are running:

### Infrastructure Health Checks
```bash
# PostgreSQL
docker exec socialmedia-postgres pg_isready -U admin

# MongoDB  
docker exec socialmedia-mongodb mongosh --eval "db.adminCommand('ping')"

# Neo4j (Web UI)
open http://localhost:7474

# Redis
docker exec socialmedia-redis redis-cli ping

# Elasticsearch
curl http://localhost:9200/_health
```

### Service Health Checks
```bash
# Eureka Server
curl http://localhost:8761/actuator/health

# Auth Service
curl http://localhost:8081/auth/health

# User Service  
curl http://localhost:8082/users/health

# Post Service
curl http://localhost:8083/posts/health

# Chat Service
curl http://localhost:8084/chat/health

# Search Service
curl http://localhost:8085/search/health

# Notification Service
curl http://localhost:8086/notifications/health

# API Gateway
curl http://localhost:8080/actuator/health
```

## Service URLs & Ports

| Service | URL | Port | Purpose |
|---------|-----|------|---------|
| **API Gateway** | http://localhost:8080 | 8080 | Main entry point |
| **Auth Service** | http://localhost:8081 | 8081 | Authentication & JWT |
| **User Service** | http://localhost:8082 | 8082 | User profiles & social graph |
| **Post Service** | http://localhost:8083 | 8083 | Posts & comments |
| **Chat Service** | http://localhost:8084 | 8084 | Real-time messaging |
| **Search Service** | http://localhost:8085 | 8085 | Search & discovery |
| **Notification Service** | http://localhost:8086 | 8086 | Notifications |
| **Eureka Dashboard** | http://localhost:8761 | 8761 | Service registry |
| **Frontend App** | http://localhost:5173 | 5173 | React web application |

### Database URLs

| Database | URL | Port | Web UI |
|----------|-----|------|--------|
| **PostgreSQL** | localhost:5432 | 5432 | - |
| **MongoDB** | localhost:27017 | 27017 | - |
| **Neo4j** | bolt://localhost:7687 | 7687 | http://localhost:7474 |
| **Redis** | localhost:6379 | 6379 | - |
| **Elasticsearch** | http://localhost:9200 | 9200 | - |
  ## Development Workflow

### 🔄 Daily Development Flow

1. **Start Development Environment**
   ```bash
   ./start-services.sh
   ```

2. **Check All Services**
   ```bash  
   ./check-services.sh
   ```

3. **Start Coding** 
   - Services auto-reload on code changes
   - Check logs in `/logs/` directory

4. **Stop When Done**
   ```bash
   ./stop-services.sh
   ```

### 📝 Service Logs

Logs are automatically created in the `logs/` directory:
- `eureka-server.log`
- `auth-service.log` 
- `user-service.log`
- `post-service.log`
- `chat-service.log`
- `search-service.log`
- `notification-service.log`
- `api-gateway.log`

View real-time logs:
```bash
tail -f logs/auth-service.log
```

### 🔧 Development Tips

1. **Service Dependencies**: Services start in order to handle dependencies
2. **Database Auto-Init**: Sample data is automatically loaded
3. **Hot Reload**: Spring Boot services support hot reload via Spring DevTools
4. **Frontend**: React app has hot reload enabled by default

## Database Management

### 📊 Sample Data

The system comes pre-loaded with sample data:

**Users (5 sample users):**
- alice_nguyen (Ho Chi Minh City)
- bob_tran (Hanoi) 
- charlie_le (Da Nang)
- diana_pham (Can Tho)
- ethan_vo (Hue)

**Sample Data Includes:**
- User profiles and relationships
- Posts with images and captions
- Chat conversations and messages
- Notifications and preferences

### 🔄 Database Reset

To reset databases with fresh sample data:

```bash
# Stop services
./stop-services.sh

# Remove existing database volumes
docker-compose down -v

# Restart infrastructure
docker-compose up -d

# Restart services  
./start-services.sh
```

## Troubleshooting

### Common Issues & Solutions

#### 🔌 Connection Issues

**1. Database Connection Refused**
```bash
# Check if containers are running
docker ps

# Check specific container logs
docker logs socialmedia-postgres
docker logs socialmedia-mongodb
docker logs socialmedia-neo4j

# Restart specific container
docker restart socialmedia-postgres
```

**2. Port Already in Use**
```bash
# Find process using the port
lsof -ti:8080  # Replace 8080 with your port

# Kill the process
kill -9 $(lsof -ti:8080)

# Or use the force-stop script
./force-stop.sh
```

**3. Service Registration Issues**
```bash
# Check Eureka dashboard
open http://localhost:8761

# Verify service health
curl http://localhost:8081/auth/health
```

#### 💾 Database Issues

**1. PostgreSQL Connection Failed**
```bash
# Check PostgreSQL logs
docker logs socialmedia-postgres

# Test connection
docker exec -it socialmedia-postgres psql -U admin -d authdb

# Reset PostgreSQL
docker stop socialmedia-postgres
docker rm socialmedia-postgres
docker-compose up -d postgres
```

**2. MongoDB Connection Issues**
```bash
# Check MongoDB logs
docker logs socialmedia-mongodb

# Test connection
docker exec -it socialmedia-mongodb mongosh

# Reset MongoDB
docker stop socialmedia-mongodb
docker rm socialmedia-mongodb
docker-compose up -d mongodb
```

**3. Neo4j Authentication Failed**
```bash
# Check Neo4j logs
docker logs socialmedia-neo4j

# Access Neo4j browser
open http://localhost:7474
# Use credentials: neo4j/password

# Reset Neo4j
docker stop socialmedia-neo4j
docker rm socialmedia-neo4j
docker-compose up -d neo4j
```

#### 🏗️ Build & Compilation Issues

**1. Maven Build Failures**
```bash
# Clean and rebuild
cd backend/services/auth-service
./mvnw clean compile

# Skip tests if needed
./mvnw spring-boot:run -DskipTests

# Check for dependency issues
./mvnw dependency:tree
```

**2. Go Build Issues**
```bash
# Update dependencies
cd backend/services/chat-service
go mod tidy
go mod download

# Build manually
go build -o chat-service cmd/main.go
```

**3. Node.js Issues**
```bash
# Clear npm cache
cd frontend/web-app
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 🔍 Performance Issues

**1. High Memory Usage**
```bash
# Check Docker resource usage
docker stats

# Reduce Elasticsearch memory
# Edit docker-compose.yml:
# ES_JAVA_OPTS=-Xms256m -Xmx256m
```

**2. Slow Service Startup**
```bash
# Check available system resources
htop  # or Activity Monitor on macOS

# Increase Docker memory in Docker Desktop
# Settings > Resources > Memory: 8GB recommended
```

### Recovery Commands

**Complete Reset (Nuclear Option)**
```bash
# Stop everything
./force-stop.sh

# Remove all Docker containers and volumes
docker-compose down -v
docker system prune -a

# Remove log files
rm -rf logs/*

# Start fresh
docker-compose up -d
./start-services.sh
```

**Partial Reset (Infrastructure Only)**
```bash
# Keep services running, reset databases
docker-compose down -v
docker-compose up -d
```

**Service-Only Reset**
```bash
# Keep databases, restart services
./stop-services.sh
./start-services.sh
```

## Environment Validation

### Pre-flight Check Script

Create a `validate-environment.sh` script:

```bash
#!/bin/bash

echo "🔍 Validating Development Environment..."

# Check Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker installed: $(docker --version)"
else
    echo "❌ Docker not found"
    exit 1
fi

# Check Java
if command -v java &> /dev/null; then
    echo "✅ Java installed: $(java --version | head -n1)"
else
    echo "❌ Java not found"
    exit 1
fi

# Check Go
if command -v go &> /dev/null; then
    echo "✅ Go installed: $(go version)"
else
    echo "❌ Go not found"
    exit 1
fi

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js installed: $(node --version)"
else
    echo "❌ Node.js not found"
    exit 1
fi

# Check available ports
for port in 5432 27017 7474 7687 6379 9200 8761 8080 8081 8082 8083 8084 8085 8086 5173; do
    if lsof -ti:$port &> /dev/null; then
        echo "⚠️  Port $port is in use"
    else
        echo "✅ Port $port available"
    fi
done

echo "🎉 Environment validation complete!"
```

Run validation:
```bash
chmod +x validate-environment.sh
./validate-environment.sh
```

## Resources & References

### Documentation Links
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Cloud Netflix Eureka](https://spring.io/projects/spring-cloud-netflix)
- [Neo4j Spring Data](https://spring.io/projects/spring-data-neo4j)
- [Go Documentation](https://golang.org/doc/)
- [React Documentation](https://react.dev/)

### Docker Images Used
- [PostgreSQL 15](https://hub.docker.com/_/postgres)
- [MongoDB 6](https://hub.docker.com/_/mongo) 
- [Neo4j 5](https://hub.docker.com/_/neo4j)
- [Redis 7](https://hub.docker.com/_/redis)
- [Elasticsearch 8.9.0](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)

### Development Tools
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Postman](https://www.postman.com/) - For API testing
- [Neo4j Browser](http://localhost:7474) - Graph database UI
- [MongoDB Compass](https://www.mongodb.com/products/compass) - MongoDB GUI

## Next Steps

After successfully setting up the development environment:

### 🧪 1. Test the System
```bash
# Run the validation script
./validate-environment.sh

# Test API endpoints
curl http://localhost:8080/auth/health
curl http://localhost:8080/users/health
curl http://localhost:8080/posts/health
```

### 📱 2. Access the Applications
- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:8080  
- **Eureka Dashboard**: http://localhost:8761
- **Neo4j Browser**: http://localhost:7474

### 🔧 3. Development Workflow
1. Make code changes in your IDE
2. Services auto-reload (Spring DevTools enabled)
3. Test via frontend or API calls
4. Check logs in `logs/` directory
5. Use health check endpoints for debugging

### 📚 4. Explore the Codebase
- Review service configurations in `application.yml` files
- Examine database schemas and sample data
- Check API documentation (Swagger UI available on each service)
- Study the microservice communication patterns

### 🚀 5. Start Development
You're now ready to start developing features! The system is fully functional with:
- ✅ User authentication and authorization  
- ✅ User profiles and social relationships
- ✅ Posts and comments functionality
- ✅ Real-time chat system
- ✅ Search and discovery features
- ✅ Notification system
- ✅ Sample data for testing

Happy coding! 🎉
