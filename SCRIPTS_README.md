# SHPE System Management Scripts

This directory contains scripts to easily manage the complete SHPE website + Video Translator system.

## 🚀 Quick Start

### Start Everything
```bash
./start-all-services.sh
```

### Check Status  
```bash
./check-status.sh
```

### Stop Everything
```bash
./stop-all-services.sh
```

## 📋 What Gets Started

The `start-all-services.sh` script launches all required services:

1. **LibreTranslate** (Port 5000) - Translation API service
2. **Spring Boot Backend** (Port 8080) - Hackathon app API  
3. **Hackathon Frontend** (Port 5173/5174) - React/Vite video translator UI
4. **SHPE Main Website** (Port 3000/3001) - Next.js main website with integration

## 🎯 Usage Flow

1. **Start all services**: `./start-all-services.sh`
2. **Wait for startup** (about 30-60 seconds)
3. **Open SHPE website**: Usually http://localhost:3001
4. **Click "Video Translator"** in the left sidebar
5. **Enjoy the full integration!**

## 🔍 Troubleshooting

### Check what's running:
```bash
./check-status.sh
```

### View logs if something fails:
```bash
# LibreTranslate
tail -f /tmp/libretranslate.log

# Spring Boot Backend  
tail -f /tmp/spring-boot.log

# Hackathon Frontend
tail -f /tmp/vite-frontend.log

# SHPE Main Website
tail -f /tmp/nextjs-main.log
```

### Force restart:
```bash
./stop-all-services.sh && sleep 5 && ./start-all-services.sh
```

## 📝 Notes

- Scripts automatically handle port conflicts (will use 3001 if 3000 is taken, etc.)
- All services run in background with proper logging
- PIDs are tracked for clean shutdown
- Includes health checks and startup verification
- Color-coded output for easy status reading

## 🛑 Emergency Stop

If anything gets stuck:
```bash
./stop-all-services.sh
# Or manual cleanup:
pkill -f "next dev"
pkill -f "vite"  
pkill -f "spring-boot"
pkill -f "libretranslate"
```
