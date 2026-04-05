#!/bin/bash

echo "🚀 Starting SHPE Complete System..."

# Kill existing processes
echo "Cleaning up existing processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true  
pkill -f "spring-boot" 2>/dev/null || true
pkill -f "libretranslate" 2>/dev/null || true

# Kill by port
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
lsof -ti :3001 | xargs kill -9 2>/dev/null || true
lsof -ti :5173 | xargs kill -9 2>/dev/null || true
lsof -ti :5174 | xargs kill -9 2>/dev/null || true
lsof -ti :8080 | xargs kill -9 2>/dev/null || true
lsof -ti :5000 | xargs kill -9 2>/dev/null || true

sleep 3

echo "✅ Cleanup completed"

# Start LibreTranslate
echo "📡 Starting LibreTranslate..."
libretranslate --host 127.0.0.1 --port 5000 > /tmp/libretranslate.log 2>&1 &

# Start Spring Boot Backend
echo "☕ Starting Spring Boot backend..."
cd /Users/joeyv/Documents/shpeproject-main/shpehackathon/shpehackathon/backend
mvn spring-boot:run > /tmp/spring-boot.log 2>&1 &

# Start Hackathon Frontend
echo "⚛️  Starting Hackathon frontend..."
cd /Users/joeyv/Documents/shpeproject-main/shpehackathon/shpehackathon/frontend
npm install --silent
npm run dev > /tmp/vite-frontend.log 2>&1 &

# Start SHPE Main Website
echo "🌐 Starting SHPE main website..."  
cd /Users/joeyv/Documents/shpeproject-main
npm install --silent
npm run dev > /tmp/nextjs-main.log 2>&1 &

echo ""
echo "🎉 All services starting up!"
echo "⏰ Please wait 30-60 seconds for everything to be ready"
echo ""
echo "🔗 Expected URLs (check in a moment):"
echo "   • SHPE Website: http://localhost:3001"  
echo "   • Video Translator: http://localhost:3001/video-translator"
echo "   • Hackathon App: http://localhost:5174"
echo ""
echo "📊 Check status with: ./check-status.sh"
echo "🛑 Stop all with: ./stop-all-services.sh"
