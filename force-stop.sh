#!/bin/bash

# Force Stop All Services - Emergency Script
echo "⚠️  FORCE STOPPING ALL SERVICES..."

# Get base directory
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOGS_DIR="$BASE_DIR/logs"

# Kill by process name
echo "🔪 Killing Spring Boot processes..."
pkill -f "spring-boot:run" 2>/dev/null || echo "No spring-boot processes found"

echo "🔪 Killing Maven wrapper processes..."
pkill -f "mvnw" 2>/dev/null || echo "No mvnw processes found"

echo "🔪 Killing Java processes..."
pkill -f "java.*eureka" 2>/dev/null || echo "No Eureka processes found"
pkill -f "java.*auth" 2>/dev/null || echo "No Auth service processes found"
pkill -f "java.*user" 2>/dev/null || echo "No User service processes found"
pkill -f "java.*post" 2>/dev/null || echo "No Post service processes found"
pkill -f "java.*search" 2>/dev/null || echo "No Search service processes found"
pkill -f "java.*notification" 2>/dev/null || echo "No Notification service processes found"
pkill -f "java.*gateway" 2>/dev/null || echo "No Gateway processes found"

echo "🔪 Killing Node.js processes..."
pkill -f "node.*vite" 2>/dev/null || echo "No Vite processes found"
pkill -f "node.*webpack" 2>/dev/null || echo "No Webpack processes found"

# Kill by ports
echo "🔪 Killing processes by ports..."
for port in 3000 8761 8080 8081 8082 8083 8084 8085 8086; do
    pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "Killing process on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null || true
    fi
done

# Clean up PID files
echo "🧹 Cleaning up PID files..."
if [ -d "$LOGS_DIR" ]; then
    rm -f "$LOGS_DIR"/*.pid
else
    echo "No logs directory found at $LOGS_DIR"
fi

echo "✅ Force stop completed!"
echo "Run './check-services.sh' to verify all services are stopped."
