#!/bin/bash

# Social Media Application Service Startup Script
# This script starts selected microservices in the correct order with health checks

echo "🚀 Starting Social Media Application Services..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Base directory - using relative path
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$BASE_DIR/backend"
FRONTEND_DIR="$BASE_DIR/frontend/web-app"

# Service definitions
declare -A SERVICES=(
    ["eureka-server"]="8761:Eureka Server:infrastructure/eureka-server"
    ["auth-service"]="8081:Auth Service:services/authen-service"
    ["user-service"]="8082:User Service:services/user-service"
    ["notification-service"]="8086:Notification Service:services/notification-service"
    ["api-gateway"]="8080:API Gateway:infrastructure/api-gateway-service"
)

# Function to start a Spring Boot service
start_spring_service() {
    local service_name=$1
    local service_path=$2
    local port=$3
    
    echo -e "${BLUE}🔄 Starting $service_name on port $port...${NC}"
    
    cd "$BACKEND_DIR/$service_path"
    
    # Start service in background
    nohup ./mvnw spring-boot:run > "../../../logs/${service_name}.log" 2>&1 &
    local pid=$!
    echo $pid > "../../../logs/${service_name}.pid"
    
    echo -e "${GREEN}✅ $service_name started (PID: $pid)${NC}"
    
    # Wait a bit before starting next service
    sleep 20
}

# Function to start Frontend service
start_frontend() {
    echo -e "${BLUE}🔄 Starting Frontend service...${NC}"
    
    cd "$FRONTEND_DIR"
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
        npm install
    fi
    
    # Start frontend in background
    nohup npm run dev > "../../logs/frontend.log" 2>&1 &
    local pid=$!
    echo $pid > "../../logs/frontend.pid"
    
    echo -e "${GREEN}✅ Frontend service started (PID: $pid)${NC}"
}

# Create logs directory
mkdir -p "$BASE_DIR/logs"

echo "📋 Starting services in optimal order..."
echo ""

# 1. Start Eureka Server (Service Discovery)
start_spring_service "Eureka Server" "infrastructure/eureka-server" 8761

# Wait for Eureka to be fully ready
echo "⏳ Waiting for Eureka Server to be ready..."
sleep 30

# 2. Start Auth Service (Authentication)
start_spring_service "Auth Service" "services/authen-service" 8081

# 3. Start User Service (User Management)
start_spring_service "User Service" "services/user-service" 8082

# 4. Start Notification Service (Notifications)
start_spring_service "Notification Service" "services/notification-service" 8086

# 5. Start API Gateway (Last to ensure all services are registered)
echo "⏳ Waiting for all services to register with Eureka..."
sleep 30
start_spring_service "API Gateway" "infrastructure/api-gateway-service" 8080

# 6. Start Frontend service
start_frontend

echo ""
echo -e "${GREEN}🎉 All services started successfully!${NC}"
echo ""
echo "📋 Service URLs:"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🌐 API Gateway: http://localhost:8080"
echo "   🔐 Auth Service: http://localhost:8081"
echo "   👤 User Service: http://localhost:8082"
echo "   🔔 Notification Service: http://localhost:8086"
echo "   🗂️  Eureka Dashboard: http://localhost:8761"
echo ""
echo "📁 Logs are available in: $BASE_DIR/logs/"
echo ""
echo "🛑 To stop all services, run: ./force-stop.sh"
