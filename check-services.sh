#!/bin/bash

# Service Status Check Script
echo "🔍 Checking Service Status..."
echo "=================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check each port
declare -A services=(
    [8761]="Eureka Server"
    [8080]="API Gateway"
    [8081]="Auth Service"
    [8082]="User Service"
    [8083]="Post Service"
    [8084]="Chat Service"
    [8085]="Search Service"
    [8086]="Notification Service"
)

running_count=0
total_count=${#services[@]}

for port in "${!services[@]}"; do
    service_name="${services[$port]}"
    if lsof -i :$port >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $service_name (Port $port): RUNNING${NC}"
        ((running_count++))
    else
        echo -e "${RED}❌ $service_name (Port $port): STOPPED${NC}"
    fi
done

echo "=================================="
if [ $running_count -eq 0 ]; then
    echo -e "${GREEN}🎉 All services are stopped!${NC}"
elif [ $running_count -eq $total_count ]; then
    echo -e "${GREEN}🚀 All services are running!${NC}"
else
    echo -e "${YELLOW}⚠️  $running_count out of $total_count services running${NC}"
fi
echo ""

# Check Eureka registered services if available
if lsof -i :8761 >/dev/null 2>&1; then
    echo "🗂️  Services registered with Eureka:"
    curl -s http://localhost:8761/eureka/apps 2>/dev/null | grep -o '<name>[^<]*</name>' | sed 's/<name>//g' | sed 's/<\/name>//g' | sort | uniq | while read service; do
        echo "   - $service"
    done || echo "   Unable to fetch Eureka services"
fi
