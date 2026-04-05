#!/bin/bash

# SHPE System Status Check
# Quick status check for all SHPE services

echo "📊 SHPE System Status Check"
echo "=========================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to check if port is in use
check_service() {
    local port=$1
    local service_name=$2
    local url=$3
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        if [ ! -z "$url" ] && curl -s --connect-timeout 2 "$url" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name${NC} - Running on port $port (Healthy)"
        else
            echo -e "${YELLOW}⚠️  $service_name${NC} - Running on port $port (Starting up...)"
        fi
        return 0
    else
        echo -e "${RED}❌ $service_name${NC} - Not running on port $port"
        return 1
    fi
}

services_running=0

# Check all services
if check_service 5000 "LibreTranslate" "http://localhost:5000/languages"; then
    services_running=$((services_running + 1))
fi

if check_service 8080 "Spring Boot Backend" "http://localhost:8080/api/subtitles/translate/start"; then
    services_running=$((services_running + 1))
fi

if check_service 5173 "Hackathon Frontend (5173)" "http://localhost:5173"; then
    services_running=$((services_running + 1))
elif check_service 5174 "Hackathon Frontend (5174)" "http://localhost:5174"; then
    services_running=$((services_running + 1))
fi

if check_service 3000 "SHPE Main Website (3000)" "http://localhost:3000"; then
    services_running=$((services_running + 1))
elif check_service 3001 "SHPE Main Website (3001)" "http://localhost:3001"; then
    services_running=$((services_running + 1))
fi

echo ""
echo "📈 Summary: $services_running/4 services running"

if [ $services_running -eq 4 ]; then
    echo -e "${GREEN}🚀 All systems operational!${NC}"
    
    # Determine URLs
    MAIN_URL=""
    VIDEO_URL=""
    
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        MAIN_URL="http://localhost:3000"
    elif lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
        MAIN_URL="http://localhost:3001"
    fi
    
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
        VIDEO_URL="http://localhost:5173"
    elif lsof -Pi :5174 -sTCP:LISTEN -t >/dev/null 2>&1; then
        VIDEO_URL="http://localhost:5174"
    fi
    
    echo ""
    echo "🔗 Quick Links:"
    [ ! -z "$MAIN_URL" ] && echo "   • SHPE Website: $MAIN_URL"
    [ ! -z "$MAIN_URL" ] && echo "   • Video Translator: $MAIN_URL/video-translator"
    [ ! -z "$VIDEO_URL" ] && echo "   • Direct Hackathon App: $VIDEO_URL"
    
elif [ $services_running -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Some services are running but not all${NC}"
    echo "Run: ./start-all-services.sh to start missing services"
else
    echo -e "${RED}❌ No services are running${NC}"
    echo "Run: ./start-all-services.sh to start all services"
fi

echo ""
echo "🔄 Available commands:"
echo "   • ./start-all-services.sh - Start all services"
echo "   • ./stop-all-services.sh  - Stop all services"
echo "   • ./check-status.sh       - Check this status"
