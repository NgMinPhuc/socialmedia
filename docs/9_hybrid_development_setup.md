# Social Media Microservices - Hybrid Development Setup Guide

## Overview

This project uses a **Hybrid Development Setup**:
- **Infrastructure (Docker)**: Databases, message brokers, and search engines
- **Services (Local)**: Backend microservices and Frontend application

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LOCAL DEVELOPMENT                        │
├─────────────────┬───────────────────┬───────────────────────┤
│  Backend (Java) │   Backend (Go)    │    Frontend (React)   │
│                 │                   │                       │
│ • Auth Service  │ • Chat Service    │ • Web Application     │
│ • User Service  │                   │                       │
│ • Post Service  │                   │                       │
│ • Notification  │                   │                       │
│ • Search Service│                   │                       │
│ • API Gateway   │                   │                       │
│ • Eureka Server │                   │                       │
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
│ Databases   │   Cache     │   Message   │   Search Engine     │
│             │             │   Queue     │                     │
│ PostgreSQL  │   Redis     │   Kafka     │   Elasticsearch     │
│ MongoDB     │             │   Zookeeper │                     │
│ Neo4j       │             │             │                     │
└─────────────┴─────────────┴─────────────┴─────────────────────┘
```

## Prerequisites

- Docker and Docker Compose installed
- JDK 21 installed for Java services
- Go 1.20+ installed for Chat service
- Node.js 18+ installed for Frontend
- Git

## Quick Start

### Step 1: Clone the repository
```bash
git clone https://github.com/yourusername/socialmedia.git
cd socialmedia
```

### Step 2: Start Infrastructure Services
```bash
docker-compose up -d
```

### Step 3: Verify Infrastructure
```bash
docker ps
```
You should see the following containers running:
- PostgreSQL
- MongoDB
- Neo4j
- Redis
- Elasticsearch
- Zookeeper
- Kafka

### Step 4: Start Backend Microservices
Open separate terminal windows for each service:

#### Start Eureka Server (Service Discovery)
```bash
cd backend/infrastructure/eureka-server
./mvnw spring-boot:run
```

#### Start API Gateway
```bash
cd backend/infrastructure/api-gateway-service
./mvnw spring-boot:run
```

#### Start Authentication Service
```bash
cd backend/services/authen-service
./mvnw spring-boot:run
```

#### Start User Service
```bash
cd backend/services/user-service
./mvnw spring-boot:run
```

#### Start Post Service
```bash
cd backend/services/post-service
./mvnw spring-boot:run
```

#### Start Notification Service
```bash
cd backend/services/notification-service
./mvnw spring-boot:run
```

#### Start Search Service
```bash
cd backend/services/search-service
./mvnw spring-boot:run
```

#### Start Chat Service (Go)
```bash
cd backend/services/chat-service
go run cmd/main.go
```

### Step 5: Start Frontend Application
```bash
cd frontend/web-app
npm install
npm run dev
```

## Detailed Infrastructure Setup

### Docker Network
```bash
# Create the network (if not already created)
docker network create socialmedia-network
```

### PostgreSQL Setup
```bash
docker run -d \
  --name socialmedia-postgres \
  --network socialmedia-network \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_MULTIPLE_DATABASES="authDB,userDB" \
  -v /Users/blake/Desktop/socialmedia/database/postgres:/docker-entrypoint-initdb.d \
  -p 5432:5432 \
  postgres:15
```

### MongoDB Setup
```bash
docker run -d \
  --name socialmedia-mongodb \
  --network socialmedia-network \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=123456 \
  -v /Users/blake/Desktop/socialmedia/database/mongo:/docker-entrypoint-initdb.d \
  -p 27017:27017 \
  mongo:6
```

### Neo4j Setup
```bash
docker run -d \
  --name socialmedia-neo4j \
  --network socialmedia-network \
  -e NEO4J_AUTH=neo4j/123456 \
  -v /Users/blake/Desktop/socialmedia/database/neo4j:/import \
  -p 7474:7474 \
  -p 7687:7687 \
  neo4j:5
```

### Redis Setup
```bash
docker run -d \
  --name socialmedia-redis \
  --network socialmedia-network \
  -p 6379:6379 \
  redis:7
```

### Elasticsearch Setup
```bash
# Set VM max map count (for Elasticsearch)
# For macOS & Windows:
# Run this on your Docker VM

docker run -d \
  --name socialmedia-elasticsearch \
  --network socialmedia-network \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
  -p 9200:9200 \
  -p 9300:9300 \
  elasticsearch:8.9.0
```

### Zookeeper & Kafka Setup
```bash
# Start Zookeeper
docker run -d \
  --name socialmedia-zookeeper \
  --network socialmedia-network \
  -e ZOOKEEPER_CLIENT_PORT=2181 \
  -p 2181:2181 \
  confluentinc/cp-zookeeper:7.4.0

# Start Kafka (wait for Zookeeper to be ready)
docker run -d \
  --name socialmedia-kafka \
  --network socialmedia-network \
  -e KAFKA_ZOOKEEPER_CONNECT=socialmedia-zookeeper:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://socialmedia-kafka:9092,PLAINTEXT_HOST://localhost:29092 \
  -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT \
  -e KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  -p 9092:9092 \
  -p 29092:29092 \
  confluentinc/cp-kafka:7.4.0
```

## Docker Compose Setup

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
      POSTGRES_MULTIPLE_DATABASES: "authDB,userDB"
    volumes:
      - ./database/postgres:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - socialmedia-network

  mongodb:
    image: mongo:6
    container_name: socialmedia-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: 123456
    volumes:
      - ./database/mongo:/docker-entrypoint-initdb.d
    ports:
      - "27017:27017"
    networks:
      - socialmedia-network

  neo4j:
    image: neo4j:5
    container_name: socialmedia-neo4j
    environment:
      NEO4J_AUTH: neo4j/123456
    volumes:
      - ./database/neo4j:/import
    ports:
      - "7474:7474"
      - "7687:7687"
    networks:
      - socialmedia-network

  redis:
    image: redis:7
    container_name: socialmedia-redis
    ports:
      - "6379:6379"
    networks:
      - socialmedia-network

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
    networks:
      - socialmedia-network

  zookeeper:
    image: confluentinc/cp-zookeeper:7.4.0
    container_name: socialmedia-zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"
    networks:
      - socialmedia-network

  kafka:
    image: confluentinc/cp-kafka:7.4.0
    container_name: socialmedia-kafka
    depends_on:
      - zookeeper
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    ports:
      - "9092:9092"
      - "29092:29092"
    networks:
      - socialmedia-network

networks:
  socialmedia-network:
    driver: bridge
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Make sure all containers are running: `docker ps`
   - Check container logs: `docker logs socialmedia-postgres`

2. **Port Conflicts**
   - If a port is already in use, modify the Docker port mapping
   - Look for EADDRINUSE errors in logs

3. **Memory Issues with Elasticsearch**
   - Increase Docker memory allocation in Docker Desktop settings
   - Reduce Elasticsearch memory: `-e "ES_JAVA_OPTS=-Xms256m -Xmx256m"`

4. **Kafka Connection Issues**
   - Ensure Zookeeper is running before Kafka
   - Check Kafka logs: `docker logs socialmedia-kafka`

5. **Database Initialization Failures**
   - Check init scripts permissions
   - Examine database logs: `docker logs socialmedia-postgres`

### Cleanup Commands

```bash
# Stop all containers
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# Remove specific container
docker rm -f socialmedia-postgres

# Check logs
docker logs socialmedia-kafka
```

## Resources

- [PostgreSQL Docker Documentation](https://hub.docker.com/_/postgres)
- [MongoDB Docker Documentation](https://hub.docker.com/_/mongo)
- [Neo4j Docker Documentation](https://hub.docker.com/_/neo4j)
- [Redis Docker Documentation](https://hub.docker.com/_/redis)
- [Elasticsearch Docker Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)
- [Kafka Docker Documentation](https://docs.confluent.io/platform/current/installation/docker/installation.html)

## Next Steps

After setting up the infrastructure and starting all services:

1. Test if Eureka Server is running: http://localhost:8761
2. Test if API Gateway is running: http://localhost:8080
3. Access Neo4j Browser: http://localhost:7474
4. Access Elasticsearch: http://localhost:9200
5. Access the frontend application: http://localhost:5173
