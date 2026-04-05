# 🎬 SHPE Video Translator - Complete System

## 🎯 Overview

This system integrates the SHPE website with a powerful video translation tool that can translate YouTube videos with AI-powered dubbing. The integration connects the main SHPE Next.js website with a hackathon-built React app that provides comprehensive video translation capabilities.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SHPE Complete System                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │ SHPE Website    │    │     Video Translator Stack     │ │
│  │ (Next.js)       │    │                                 │ │
│  │ Port 3000/3001  │◄──►│  ┌─────────────────────────────┐ │ │
│  │                 │    │  │ Frontend (React/Vite)       │ │ │
│  │ • Home          │    │  │ Port 5173/5174              │ │ │
│  │ • Directory     │    │  └─────────────────────────────┘ │ │
│  │ • Events        │    │              ▲                  │ │
│  │ • Video Translator───┼──────────────┘                  │ │
│  │ • Profile       │    │              ▼                  │ │
│  └─────────────────┘    │  ┌─────────────────────────────┐ │ │
│                         │  │ Backend (Spring Boot)       │ │ │
│                         │  │ Port 8080                   │ │ │
│                         │  └─────────────────────────────┘ │ │
│                         │              ▲                  │ │
│                         │              ▼                  │ │
│                         │  ┌─────────────────────────────┐ │ │
│                         │  │ LibreTranslate              │ │ │
│                         │  │ Port 5000                   │ │ │
│                         │  └─────────────────────────────┘ │ │
│                         └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start (One Command!)

```bash
# Start everything at once
./start-simple.sh

# Check if everything is running
./check-status.sh

# Stop everything when done
./stop-all-services.sh
```

## 📋 Services Details

### 1. SHPE Main Website (Next.js)
- **Purpose**: Main website with navigation and integration
- **Port**: 3000 or 3001 (auto-detected)
- **Features**: 
  - Authentication system with bypass for development
  - Member directory
  - Events management
  - Career planning
  - Scholarships
  - **Video Translator integration** (iframe embed)

### 2. Video Translator Frontend (React/Vite)
- **Purpose**: Interactive UI for video translation
- **Port**: 5173 or 5174 (auto-detected)
- **Features**:
  - YouTube URL processing
  - Multi-language subtitle translation
  - AI-powered dubbing with speech synthesis
  - Interactive timeline and subtitle navigation
  - Real-time progress tracking

### 3. Video Translator Backend (Spring Boot)
- **Purpose**: API server for translation processing
- **Port**: 8080
- **Endpoints**:
  - `/api/subtitles/translate/start` - Start translation job
  - `/api/subtitles/translate/progress/{jobId}` - Check progress
  - CORS enabled for frontend integration

### 4. LibreTranslate
- **Purpose**: Translation API service
- **Port**: 5000
- **Features**:
  - Support for 100+ languages
  - Offline translation (no external API keys needed)
  - REST API for programmatic access

## 🎯 User Experience Flow

1. **User visits SHPE website**: `http://localhost:3000`
2. **Clicks "Video Translator"** in left sidebar
3. **Gets embedded translator interface** within SHPE website context
4. **Pastes YouTube URL** (e.g., educational content)
5. **Selects target language** (Spanish, English, French, etc.)
6. **Clicks "Translate"** and watches real-time progress
7. **Enjoys synchronized dubbing** with video playback
8. **Can navigate timeline** by clicking subtitle timestamps

## 📁 File Structure

```
shpeproject-main/
├── start-simple.sh          # 🚀 Main startup script
├── stop-all-services.sh     # 🛑 Stop all services  
├── check-status.sh          # 📊 Status checker
├── SCRIPTS_README.md        # 📖 Script documentation
├── src/
│   ├── app/video-translator/
│   │   └── page.tsx         # Integration page with iframe
│   └── components/home/
│       └── home-sidebar.tsx # Navigation with Video Translator button
└── shpehackathon/shpehackathon/
    ├── frontend/            # React video translator app
    ├── backend/             # Spring Boot API
    └── restart_all.sh       # Original hackathon script
```

## 🔧 Configuration

### Environment Variables
```bash
# Main SHPE Website (.env.local)
DEV_BYPASS_AUTH=true              # Skip authentication in development
DATABASE_URL="file:./dev.db"      # SQLite database
NEXTAUTH_SECRET="dev-secret"      # Auth secret
NEXTAUTH_URL="http://localhost:3000"

# Video Translator
VITE_API_BASE_URL="http://localhost:8080/api"  # Backend API
LIBRETRANSLATE_URL="http://localhost:5000"     # Translation service
```

### Port Configuration
- **SHPE Website**: 3000 (or 3001 if 3000 is taken)
- **Video Translator Frontend**: 5173 (or 5174 if 5173 is taken)  
- **Video Translator Backend**: 8080 (fixed)
- **LibreTranslate**: 5000 (fixed)

## 🧪 Testing the Complete System

### Basic Integration Test
```bash
# 1. Start all services
./start-simple.sh

# 2. Wait for startup (30-60 seconds)
sleep 60

# 3. Check everything is running
./check-status.sh

# 4. Open SHPE website
open http://localhost:3000

# 5. Click "Video Translator" in sidebar
# 6. Test with any YouTube URL
```

### Test URLs
```
# Educational content (good for testing)
https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Tech talks (SHPE relevant)
https://www.youtube.com/watch?v=...

# Language learning content
https://www.youtube.com/watch?v=...
```

### Expected Results
- ✅ Seamless navigation from SHPE website to video translator
- ✅ Embedded translator interface within SHPE context
- ✅ Full video translation pipeline working
- ✅ Synchronized dubbing with video playback
- ✅ Multi-language support (14+ languages)
- ✅ Interactive subtitle timeline

## 🔍 Troubleshooting

### Common Issues

#### Services Won't Start
```bash
# Check what's using ports
lsof -i :3000,3001,5173,5174,8080,5000

# Force cleanup and restart
./stop-all-services.sh
sleep 10
./start-simple.sh
```

#### Translation Not Working
```bash
# Check backend logs
tail -f /tmp/spring-boot.log

# Check LibreTranslate
curl http://localhost:5000/languages

# Restart translation services only
pkill -f libretranslate
pkill -f spring-boot
# Then restart with start-simple.sh
```

#### Frontend Issues
```bash
# Check frontend logs
tail -f /tmp/vite-frontend.log
tail -f /tmp/nextjs-main.log

# Clear node modules and restart
cd shpehackathon/shpehackathon/frontend && rm -rf node_modules
cd ../../../ && rm -rf node_modules
./start-simple.sh
```

### Logs Location
```bash
/tmp/libretranslate.log    # Translation service
/tmp/spring-boot.log       # Backend API
/tmp/vite-frontend.log     # Video translator UI
/tmp/nextjs-main.log       # Main SHPE website
```

### Health Checks
```bash
# LibreTranslate
curl http://localhost:5000/languages

# Spring Boot Backend  
curl http://localhost:8080/api/subtitles/translate/start

# Frontend Services
curl http://localhost:3000
curl http://localhost:5173
```

## 🎉 Success Metrics

When everything is working correctly, you should see:

1. **All 4 services running** (check-status.sh shows 4/4)
2. **SHPE website loads** at http://localhost:3000
3. **Video Translator button** visible in left sidebar
4. **Embedded translator** loads when clicking the button
5. **Translation pipeline** works end-to-end
6. **Dubbing synchronizes** with video playback

## 🚀 Production Deployment

For production deployment, you'll need to:

1. **Configure environment variables** for production URLs
2. **Set up proper database** (PostgreSQL instead of SQLite)
3. **Deploy services** to separate containers/servers
4. **Configure reverse proxy** (nginx) for routing
5. **Set up SSL certificates** for HTTPS
6. **Configure CORS** for production domains

## 📞 Support

If you encounter issues:

1. **Check the logs** in `/tmp/` directory
2. **Run status checker**: `./check-status.sh`
3. **Try force restart**: `./stop-all-services.sh && ./start-simple.sh`
4. **Check port conflicts** with `lsof -i :PORT`

---

🎬 **Enjoy your complete SHPE Video Translator system!** 🚀
