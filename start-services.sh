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
LOGS_DIR="$BASE_DIR/logs"

# Ensure logs directory exists
mkdir -p "$LOGS_DIR"

# Function to check if a port is in use (service is listening)
wait_for_port() {
    local port=$1
    local service_name=$2
    local timeout=180 # seconds
    local start_time=$(date +%s)

    echo -e "${YELLOW}⏳ Waiting for $service_name to start on port $port...${NC}"
    while ! nc -z localhost "$port" >/dev/null 2>&1; do
        current_time=$(date +%s)
        elapsed=$((current_time - start_time))
        if [ "$elapsed" -ge "$timeout" ]; then
            echo -e "${RED}❌ $service_name did not start within $timeout seconds. Exiting.${NC}"
            exit 1
        fi
        echo -n "."
        sleep 2
    done
    echo ""
    echo -e "${GREEN}✅ $service_name is listening on port $port.${NC}"
}

# Function to start a Spring Boot service
start_spring_service() {
    local service_id=$1
    local service_name=$2
    local service_path=$3
    local port=$4

    echo -e "${BLUE}🔄 Starting $service_name on port $port...${NC}"

    cd "$BACKEND_DIR/$service_path" || { echo -e "${RED}❌ Error: Directory $BACKEND_DIR/$service_path not found.${NC}"; exit 1; }

    # Start service in background, redirecting output to a specific log file
    nohup ./mvnw spring-boot:run > "$LOGS_DIR/${service_id}.log" 2>&1 &
    local pid=$!
    echo "$pid" > "$LOGS_DIR/${service_id}.pid" # Save PID for later stopping

    echo -e "${GREEN}✅ $service_name started (PID: $pid)${NC}"
}

# Function to start Frontend service
start_frontend() {
    echo -e "${BLUE}🔄 Starting Frontend service...${NC}"

    cd "$FRONTEND_DIR" || { echo -e "${RED}❌ Error: Directory $FRONTEND_DIR not found.${NC}"; exit 1; }

    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
        npm install || { echo -e "${RED}❌ Error: npm install failed for frontend.${NC}"; exit 1; }
    fi

    # Start frontend in background
    nohup npm run dev > "$LOGS_DIR/frontend.log" 2>&1 &
    local pid=$!
    echo "$pid" > "$LOGS_DIR/frontend.pid"

    echo -e "${GREEN}✅ Frontend service started (PID: $pid)${NC}"
}

echo "📋 Starting services in optimal order..."
echo ""

# --- PHASE 1: Start Eureka Server (Critical First) ---
start_spring_service "eureka-server" "Eureka Server" "infrastructure/eureka-server" 8761
wait_for_port 8761 "Eureka Server"

# --- PHASE 2: Start User Service (Next Critical, often depends on Eureka) ---
start_spring_service "user-service" "User Service" "services/user-service" 8082
wait_for_port 8082 "User Service"

# --- PHASE 3: Start Remaining Backend Services in Parallel ---
echo -e "${BLUE}🚀 Starting Authentication, Notification, and API Gateway services in parallel...${NC}"

# Start Auth Service in background
start_spring_service "auth-service" "Auth Service" "services/authen-service" 8081 &
AUTH_PID=$!

# Start Post Service in background
start_spring_service "post-service" "Post Service" "services/post-service" 8083 &
POST_PID=$!

# Start Notification Service in background
start_spring_service "notification-service" "Notification Service" "services/notification-service" 8086 &
NOTIFICATION_PID=$!

# Start API Gateway in background (can typically start before other services fully register,
# as it will discover them via Eureka)
start_spring_service "api-gateway" "API Gateway" "infrastructure/api-gateway-service" 8080 &
API_GATEWAY_PID=$!

# Wait for all parallel backend services to start listening on their ports
wait_for_port 8081 "Auth Service" &
WAIT_AUTH_PID=$!

# Wait for Post Service in background
wait_for_port 8083 "Post Service" &
WAIT_POST_PID=$!

wait_for_port 8086 "Notification Service" &
WAIT_NOTIFICATION_PID=$!

wait_for_port 8080 "API Gateway" &
WAIT_API_GATEWAY_PID=$!

# Wait for all background wait_for_port processes to complete
wait $WAIT_AUTH_PID $WAIT_POST_PID $WAIT_NOTIFICATION_PID $WAIT_API_GATEWAY_PID

echo -e "${GREEN}✅ All critical backend services are up and running.${NC}"

# --- PHASE 4: Start Frontend Service ---
start_frontend

echo ""
echo -e "${GREEN}🎉 All services started successfully!${NC}"
echo ""
echo "📋 Service URLs:"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🌐 API Gateway: http://localhost:8080"
echo "   🔐 Auth Service: http://localhost:8081"
echo "   👤 User Service: http://localhost:8082"
echo "   📝 Post Service: http://localhost:8083"
echo "   🔍 Search Service: http://localhost:8084"
echo "   🔔 Notification Service: http://localhost:8086"
echo "   🗂️  Eureka Dashboard: http://localhost:8761"
echo ""
echo "📁 Logs are available in: $LOGS_DIR/"
echo ""
echo "🛑 To stop all services, run: ./force-stop.sh"