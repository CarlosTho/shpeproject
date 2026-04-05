#!/bin/bash

# SHPE Complete System Stop Script
# This script stops all services started by start-all-services.sh

echo "🛑 Stopping SHPE Complete System..."

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to kill process on port
kill_port() {
    local port=$1
    local service_name=$2
    local pids=$(lsof -ti :$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        print_info "Stopping $service_name on port $port..."
        kill -15 $pids 2>/dev/null
        sleep 2
        
        # Force kill if still running
        pids=$(lsof -ti :$port 2>/dev/null)
        if [ ! -z "$pids" ]; then
            print_warning "Force killing $service_name..."
            kill -9 $pids 2>/dev/null
        fi
        print_success "$service_name stopped"
    else
        print_info "$service_name was not running on port $port"
    fi
}

# Kill processes by PID if available
if [ -f "/tmp/shpe-service-pids.txt" ]; then
    print_info "Stopping services by PID..."
    source /tmp/shpe-service-pids.txt
    
    [ ! -z "$LIBRETRANSLATE_PID" ] && kill -15 $LIBRETRANSLATE_PID 2>/dev/null
    [ ! -z "$SPRING_PID" ] && kill -15 $SPRING_PID 2>/dev/null  
    [ ! -z "$VITE_PID" ] && kill -15 $VITE_PID 2>/dev/null
    [ ! -z "$NEXTJS_PID" ] && kill -15 $NEXTJS_PID 2>/dev/null
    
    sleep 3
    
    # Force kill if needed
    [ ! -z "$LIBRETRANSLATE_PID" ] && kill -9 $LIBRETRANSLATE_PID 2>/dev/null
    [ ! -z "$SPRING_PID" ] && kill -9 $SPRING_PID 2>/dev/null
    [ ! -z "$VITE_PID" ] && kill -9 $VITE_PID 2>/dev/null
    [ ! -z "$NEXTJS_PID" ] && kill -9 $NEXTJS_PID 2>/dev/null
    
    rm /tmp/shpe-service-pids.txt
fi

# Kill by port as backup
kill_port 3000 "Next.js (main)"
kill_port 3001 "Next.js (alternate)"
kill_port 5173 "Vite (original)"  
kill_port 5174 "Vite (alternate)"
kill_port 8080 "Spring Boot Backend"
kill_port 5000 "LibreTranslate"

# Kill by process name as final cleanup
print_info "Final cleanup by process name..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "vite.*dev" 2>/dev/null || true
pkill -f "spring-boot:run" 2>/dev/null || true
pkill -f "libretranslate" 2>/dev/null || true
pkill -f "java.*VideoTranslatorApplication" 2>/dev/null || true
pkill -f "mvn.*spring-boot" 2>/dev/null || true

# Clean up log files
print_info "Cleaning up log files..."
rm -f /tmp/libretranslate.log
rm -f /tmp/spring-boot.log  
rm -f /tmp/vite-frontend.log
rm -f /tmp/nextjs-main.log

print_success "All SHPE services have been stopped!"

echo ""
echo "🔄 To restart all services, run: ./start-all-services.sh"
