#!/bin/bash

# Social Media Application Service Stop Script
# This script stops all running microservices

echo "🛑 Stopping Social Media Application Services..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to stop a service by PID file
stop_service_by_pid() {
    local service_name=$1
    local pid_file="/Users/blake/Desktop/socialmedia/logs/${service_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p "$pid" > /dev/null 2>&1; then
            echo -e "${BLUE}🔄 Stopping $service_name (PID: $pid)...${NC}"
            kill "$pid" 2>/dev/null
            sleep 3
            
            # Check if still running and force kill
            if ps -p "$pid" > /dev/null 2>&1; then
                echo -e "${YELLOW}⚠️  Force stopping $service_name...${NC}"
                kill -9 "$pid" 2>/dev/null
                sleep 1
            fi
            
            echo -e "${GREEN}✅ $service_name stopped${NC}"
        else
            echo -e "${YELLOW}⚠️  $service_name was not running${NC}"
        fi
        rm -f "$pid_file"
    else
        echo -e "${YELLOW}⚠️  No PID file found for $service_name${NC}"
    fi
}

# Function to stop service by port
stop_service_by_port() {
    local port=$1
    local service_name=$2
    
    local pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        echo -e "${BLUE}🔄 Stopping $service_name on port $port...${NC}"
        for pid in $pids; do
            kill "$pid" 2>/dev/null
            sleep 2
            if ps -p "$pid" > /dev/null 2>&1; then
                kill -9 "$pid" 2>/dev/null
            fi
        done
        echo -e "${GREEN}✅ $service_name stopped${NC}"
    fi
}

# Stop services in reverse order
echo "📋 Stopping services by PID files..."

stop_service_by_pid "API Gateway"
stop_service_by_pid "Notification Service"
stop_service_by_pid "Search Service"
stop_service_by_pid "chat-service"
stop_service_by_pid "Post Service"
stop_service_by_pid "User Service"
stop_service_by_pid "Auth Service"
stop_service_by_pid "Eureka Server"

echo ""
echo "📋 Stopping services by port (backup method)..."

# Stop by port as backup
stop_service_by_port 8080 "API Gateway"
stop_service_by_port 8086 "Notification Service"
stop_service_by_port 8085 "Search Service"
stop_service_by_port 8084 "Chat Service"
stop_service_by_port 8083 "Post Service"
stop_service_by_port 8082 "User Service"
stop_service_by_port 8081 "Auth Service"
stop_service_by_port 8761 "Eureka Server"

echo ""
echo "🧹 Final cleanup - killing any remaining Java processes..."

# Kill any remaining Spring Boot or Java processes
pkill -f "spring-boot" 2>/dev/null || true
pkill -f "mvnw" 2>/dev/null || true
pkill -f "eureka" 2>/dev/null || true

# Wait a moment
sleep 2

echo ""
echo -e "${GREEN}🎉 All services stopped successfully!${NC}"
echo ""

# Check final status
echo "🔍 Final status check:"
declare -A service_ports=(
    [8761]="Eureka Server"
    [8080]="API Gateway"
    [8081]="Auth Service"
    [8082]="User Service"
    [8083]="Post Service"
    [8084]="Chat Service"
    [8085]="Search Service"
    [8086]="Notification Service"
)

all_stopped=true
for port in "${!service_ports[@]}"; do
    if lsof -i :$port >/dev/null 2>&1; then
        echo -e "${RED}❌ ${service_ports[$port]} still running on port $port${NC}"
        all_stopped=false
    else
        echo -e "${GREEN}✅ ${service_ports[$port]} stopped${NC}"
    fi
done

if [ "$all_stopped" = true ]; then
    echo -e "${GREEN}🎉 All services are completely stopped!${NC}"
else
    echo -e "${YELLOW}⚠️  Some services may still be running. You may need to manually kill them.${NC}"
fi

echo ""
echo "📁 Log files are preserved in: /Users/blake/Desktop/socialmedia/logs/"
echo "   Use 'rm -rf /Users/blake/Desktop/socialmedia/logs/*' to clean them up"
