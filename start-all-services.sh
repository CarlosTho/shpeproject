#!/bin/bash

# SHPE Complete System Startup Script
# This script starts all services needed for the full SHPE website + Video Translator integration

echo "🚀 Starting SHPE Complete System..."

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pids=$(lsof -ti :$port)
    if [ ! -z "$pids" ]; then
        print_info "Killing processes on port $port..."
        kill -9 $pids 2>/dev/null
        sleep 2
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    print_info "Waiting for $service_name to be ready at $url..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s --connect-timeout 2 "$url" >/dev/null 2>&1; then
            print_success "$service_name is ready!"
            return 0
        fi
        
        printf "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start within $(($max_attempts * 2)) seconds"
    return 1
}

print_step "Step 1: Cleaning up any existing processes..."

# Kill existing processes on our ports
kill_port 3000  # Next.js main
kill_port 3001  # Next.js alternate
kill_port 5173  # Vite original
kill_port 5174  # Vite alternate
kill_port 8080  # Spring Boot
kill_port 5000  # LibreTranslate

# Kill by process name
print_info "Cleaning up processes by name..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "spring-boot" 2>/dev/null || true
pkill -f "libretranslate" 2>/dev/null || true
pkill -f "java.*VideoTranslatorApplication" 2>/dev/null || true

sleep 3
print_success "Cleanup completed"

print_step "Step 2: Starting LibreTranslate service..."

# Check if libretranslate is installed
if ! command -v libretranslate &> /dev/null; then
    print_warning "LibreTranslate not found. Installing..."
    pip install libretranslate
fi

# Start LibreTranslate in background
print_info "Starting LibreTranslate on port 5000..."
nohup libretranslate --host 127.0.0.1 --port 5000 > /tmp/libretranslate.log 2>&1 &
LIBRETRANSLATE_PID=$!

# Wait for LibreTranslate to be ready
if wait_for_service "http://127.0.0.1:5000/languages" "LibreTranslate"; then
    print_success "LibreTranslate started successfully (PID: $LIBRETRANSLATE_PID)"
else
    print_error "Failed to start LibreTranslate"
fi

print_step "Step 3: Starting Spring Boot backend..."

# Navigate to backend directory and start Spring Boot
cd /Users/joeyv/Documents/shpeproject-main/shpehackathon/shpehackathon/backend

print_info "Starting Spring Boot application..."
nohup mvn spring-boot:run > /tmp/spring-boot.log 2>&1 &
SPRING_PID=$!

# Wait for Spring Boot to be ready
if wait_for_service "http://localhost:8080/api/subtitles/translate/start" "Spring Boot Backend"; then
    print_success "Spring Boot backend started successfully (PID: $SPRING_PID)"
else
    print_warning "Spring Boot may still be starting up. Check logs: tail -f /tmp/spring-boot.log"
fi

print_step "Step 4: Starting Hackathon Frontend (React/Vite)..."

# Navigate to frontend directory and start Vite
cd /Users/joeyv/Documents/shpeproject-main/shpehackathon/shpehackathon/frontend

print_info "Installing frontend dependencies..."
npm install --silent

print_info "Starting Vite development server..."
nohup npm run dev > /tmp/vite-frontend.log 2>&1 &
VITE_PID=$!

# Wait a bit for Vite to start
sleep 5

# Check which port Vite is using (5173 or 5174)
VITE_PORT=""
if check_port 5173; then
    VITE_PORT="5173"
elif check_port 5174; then
    VITE_PORT="5174"
else
    print_warning "Vite port not detected, checking logs..."
    VITE_PORT=$(grep -o "localhost:[0-9]*" /tmp/vite-frontend.log | head -1 | cut -d: -f2)
fi

if [ ! -z "$VITE_PORT" ]; then
    print_success "Hackathon Frontend started on port $VITE_PORT (PID: $VITE_PID)"
else
    print_error "Failed to detect Vite frontend port"
fi

print_step "Step 5: Starting SHPE Main Website (Next.js)..."

# Navigate to main project directory and start Next.js
cd /Users/joeyv/Documents/shpeproject-main

print_info "Installing main website dependencies..."
npm install --silent

print_info "Starting Next.js development server..."
nohup npm run dev > /tmp/nextjs-main.log 2>&1 &
NEXTJS_PID=$!

# Wait for Next.js to start
sleep 5

# Check which port Next.js is using
NEXTJS_PORT=""
if check_port 3000; then
    NEXTJS_PORT="3000"
elif check_port 3001; then
    NEXTJS_PORT="3001"
else
    print_warning "Next.js port not detected, checking logs..."
    NEXTJS_PORT=$(grep -o "localhost:[0-9]*" /tmp/nextjs-main.log | head -1 | cut -d: -f2)
fi

if [ ! -z "$NEXTJS_PORT" ]; then
    print_success "SHPE Main Website started on port $NEXTJS_PORT (PID: $NEXTJS_PID)"
else
    print_error "Failed to detect Next.js port"
fi

print_step "Step 6: Verification and Summary..."

sleep 3

echo ""
echo "🎉 SHPE Complete System Status:"
echo "=================================="

# Check all services
services_ok=0
total_services=4

if check_port 5000; then
    print_success "✅ LibreTranslate: http://localhost:5000"
    services_ok=$((services_ok + 1))
else
    print_error "❌ LibreTranslate: Not running"
fi

if check_port 8080; then
    print_success "✅ Spring Boot Backend: http://localhost:8080"
    services_ok=$((services_ok + 1))
else
    print_error "❌ Spring Boot Backend: Not running"
fi

if [ ! -z "$VITE_PORT" ] && check_port $VITE_PORT; then
    print_success "✅ Hackathon Frontend: http://localhost:$VITE_PORT"
    services_ok=$((services_ok + 1))
else
    print_error "❌ Hackathon Frontend: Not running"
fi

if [ ! -z "$NEXTJS_PORT" ] && check_port $NEXTJS_PORT; then
    print_success "✅ SHPE Main Website: http://localhost:$NEXTJS_PORT"
    services_ok=$((services_ok + 1))
else
    print_error "❌ SHPE Main Website: Not running"
fi

echo ""
echo "📊 Services Status: $services_ok/$total_services running"

if [ $services_ok -eq $total_services ]; then
    echo -e "${GREEN}🚀 ALL SYSTEMS GO! 🚀${NC}"
    echo ""
    echo "🎯 Quick Start Guide:"
    echo "1. Open: http://localhost:$NEXTJS_PORT"
    echo "2. Click 'Video Translator' in the sidebar"
    echo "3. Paste any YouTube URL and translate!"
    echo ""
    echo "🔧 Direct Access:"
    echo "   • SHPE Website: http://localhost:$NEXTJS_PORT"
    echo "   • Video Translator: http://localhost:$NEXTJS_PORT/video-translator"
    echo "   • Hackathon App: http://localhost:$VITE_PORT"
else
    echo -e "${YELLOW}⚠️  Some services may still be starting up${NC}"
    echo ""
    echo "🔍 Check logs if needed:"
    echo "   • LibreTranslate: tail -f /tmp/libretranslate.log"
    echo "   • Spring Boot: tail -f /tmp/spring-boot.log"
    echo "   • Hackathon Frontend: tail -f /tmp/vite-frontend.log"
    echo "   • SHPE Website: tail -f /tmp/nextjs-main.log"
fi

echo ""
echo "🛑 To stop all services, run: ./stop-all-services.sh"

# Save PIDs for stop script
echo "LIBRETRANSLATE_PID=$LIBRETRANSLATE_PID" > /tmp/shpe-service-pids.txt
echo "SPRING_PID=$SPRING_PID" >> /tmp/shpe-service-pids.txt
echo "VITE_PID=$VITE_PID" >> /tmp/shpe-service-pids.txt
echo "NEXTJS_PID=$NEXTJS_PID" >> /tmp/shpe-service-pids.txt
echo "VITE_PORT=$VITE_PORT" >> /tmp/shpe-service-pids.txt
echo "NEXTJS_PORT=$NEXTJS_PORT" >> /tmp/shpe-service-pids.txt

print_success "Startup script completed!"
