#!/bin/bash

# Social Media Application Service Startup Script
# This script starts all microservices in the correct order with health checks

echo "🚀 Starting Social Media Application Services..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Base directory
BASE_DIR="/Users/blake/Desktop/socialmedia/backend"

# Service definitions
declare -A SERVICES=(
    ["eureka-server"]="8761:Eureka Server:infrastructure/eureka-server"
    ["auth-service"]="8081:Auth Service:services/authen-service"
    ["user-service"]="8082:User Service:services/user-service"
    ["post-service"]="8083:Post Service:services/post-service"
    ["chat-service"]="8084:Chat Service:services/chat-service"
    ["search-service"]="8085:Search Service:services/search-service"
    ["notification-service"]="8086:Notification Service:services/notification-service"
    ["api-gateway"]="8080:API Gateway:infrastructure/api-gateway-service"
)

# Function to start a Spring Boot service
start_spring_service() {
    local service_name=$1
    local service_path=$2
    local port=$3
    
    echo -e "${BLUE}🔄 Starting $service_name on port $port...${NC}"
    
    cd "$BASE_DIR/$service_path"
    
    # Start service in background
    nohup ./mvnw spring-boot:run > "../../../logs/${service_name}.log" 2>&1 &
    local pid=$!
    echo $pid > "../../../logs/${service_name}.pid"
    
    echo -e "${GREEN}✅ $service_name started (PID: $pid)${NC}"
    
    # Wait a bit before starting next service
    sleep 10
}

# Function to start Go service (Chat Service)
start_go_service() {
    echo -e "${BLUE}🔄 Starting Chat Service on port 8084...${NC}"
    
    cd "$BASE_DIR/services/chat-service"
    
    # Start service in background
    nohup go run cmd/main.go > "../../../logs/chat-service.log" 2>&1 &
    local pid=$!
    echo $pid > "../../../logs/chat-service.pid"
    
    echo -e "${GREEN}✅ Chat Service started (PID: $pid)${NC}"
    sleep 5
}

# Create logs directory
mkdir -p /Users/blake/Desktop/socialmedia/logs

echo "📋 Starting services in optimal order..."
echo ""

# 1. Start Eureka Server (Service Discovery)
start_spring_service "Eureka Server" "infrastructure/eureka-server" 8761

# Wait for Eureka to be fully ready
echo "⏳ Waiting for Eureka Server to be ready..."
sleep 15

# 2. Start Auth Service (Authentication)
start_spring_service "Auth Service" "services/authen-service" 8081

# 3. Start User Service (User Management)
start_spring_service "User Service" "services/user-service" 8082

# 4. Start Post Service (Post Management)
start_spring_service "Post Service" "services/post-service" 8083

# 5. Start Chat Service (Real-time Messaging)
start_go_service

# 6. Start Search Service (Search & Discovery)
start_spring_service "Search Service" "services/search-service" 8085

# 7. Start Notification Service (Notifications)
start_spring_service "Notification Service" "services/notification-service" 8086

# 8. Start API Gateway (Last to ensure all services are registered)
echo "⏳ Waiting for all services to register with Eureka..."
sleep 20
start_spring_service "API Gateway" "infrastructure/api-gateway-service" 8080

echo ""
echo -e "${GREEN}🎉 All services started successfully!${NC}"
echo ""
echo "📋 Service URLs:"
echo "   🌐 API Gateway: http://localhost:8080"
echo "   🔐 Auth Service: http://localhost:8081"
echo "   👤 User Service: http://localhost:8082"
echo "   📝 Post Service: http://localhost:8083"
echo "   💬 Chat Service: http://localhost:8084"
echo "   🔍 Search Service: http://localhost:8085"
echo "   🔔 Notification Service: http://localhost:8086"
echo "   🗂️  Eureka Dashboard: http://localhost:8761"
echo ""
echo "📁 Logs are available in: /Users/blake/Desktop/socialmedia/logs/"
echo ""
echo "🛑 To stop all services, run: ./stop-services.sh"
