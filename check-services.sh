#!/bin/bash

# Social Media Application Service Status Check Script
# This script checks the status of selected microservices

echo "🔍 Checking Social Media Application Services Status..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get base directory
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOGS_DIR="$BASE_DIR/logs"

# Function to check service status
check_service() {
    local service_name=$1
    local port=$2
    local pid_file="$LOGS_DIR/${service_name}.pid"
    
    echo -e "\n${BLUE}📊 Checking $service_name...${NC}"
    
    # Check if PID file exists and process is running
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null; then
            echo -e "  ✅ Process Status: ${GREEN}Running (PID: $pid)${NC}"
        else
            echo -e "  ❌ Process Status: ${RED}Not Running (Stale PID file)${NC}"
            rm "$pid_file"
        fi
    else
        echo -e "  ❌ Process Status: ${RED}Not Running${NC}"
    fi
    
    # Check if service is responding on its port
    if nc -z localhost $port > /dev/null 2>&1; then
        echo -e "  ✅ Port Status: ${GREEN}Port $port is open${NC}"
    else
        echo -e "  ❌ Port Status: ${RED}Port $port is closed${NC}"
    fi
    
    # Check last 5 lines of log file
    local log_file="$LOGS_DIR/${service_name}.log"
    if [ -f "$log_file" ]; then
        echo -e "  📝 Recent Logs:"
        tail -n 5 "$log_file" | while read -r line; do
            echo -e "    $line"
        done
    else
        echo -e "  📝 Logs: ${YELLOW}No log file found${NC}"
    fi
}

# Function to check frontend status
check_frontend() {
    local service_name="frontend"
    local port=3000
    local pid_file="$LOGS_DIR/${service_name}.pid"
    
    echo -e "\n${BLUE}📊 Checking Frontend service...${NC}"
    
    # Check if PID file exists and process is running
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null; then
            echo -e "  ✅ Process Status: ${GREEN}Running (PID: $pid)${NC}"
        else
            echo -e "  ❌ Process Status: ${RED}Not Running (Stale PID file)${NC}"
            rm "$pid_file"
        fi
    else
        echo -e "  ❌ Process Status: ${RED}Not Running${NC}"
    fi
    
    # Check if service is responding on its port
    if nc -z localhost $port > /dev/null 2>&1; then
        echo -e "  ✅ Port Status: ${GREEN}Port $port is open${NC}"
    else
        echo -e "  ❌ Port Status: ${RED}Port $port is closed${NC}"
    fi
    
    # Check last 5 lines of log file
    local log_file="$LOGS_DIR/${service_name}.log"
    if [ -f "$log_file" ]; then
        echo -e "  📝 Recent Logs:"
        tail -n 5 "$log_file" | while read -r line; do
            echo -e "    $line"
        done
    else
        echo -e "  📝 Logs: ${YELLOW}No log file found${NC}"
    fi
}

# Check if logs directory exists
if [ ! -d "$LOGS_DIR" ]; then
    echo -e "${YELLOW}⚠️  Logs directory not found at $LOGS_DIR${NC}"
    echo -e "${YELLOW}⚠️  Creating logs directory...${NC}"
    mkdir -p "$LOGS_DIR"
fi

# Check services
echo "📋 Checking services status..."

# 1. Check Frontend service
check_frontend

# 2. Check Eureka Server
check_service "eureka-server" 8761

# 3. Check Auth Service
check_service "auth-service" 8081

# 4. Check User Service
check_service "user-service" 8082

# 5. Check Post Service
check_service "post-service" 8083

# 6. Check Search Service
check_service "search-service" 8084

# 7. Check Notification Service
check_service "notification-service" 8086

# 8. Check API Gateway
check_service "api-gateway" 8080

echo ""
echo -e "${BLUE}📋 Summary of Service Status:${NC}"
echo "   🌐 Frontend: http://localhost:3000"
echo "   🌐 API Gateway: http://localhost:8080"
echo "   🔐 Auth Service: http://localhost:8081"
echo "   👤 User Service: http://localhost:8082"
echo "   📝 Post Service: http://localhost:8083"
echo "   🔍 Search Service: http://localhost:8084"
echo "   🔔 Notification Service: http://localhost:8086"
echo "   🗂️  Eureka Dashboard: http://localhost:8761"
echo ""
echo "📁 Logs are available in: $LOGS_DIR"
