# TutorSpeakAI - Quick Start Guide

## 🚀 One-Command Startup

### For Unix/Linux/macOS:
```bash
chmod +x start-project.sh
./start-project.sh
```

### For Windows (PowerShell/CMD):
Run these commands one by one:

```bash
# Step 1: Check prerequisites
node --version
docker --version
docker-compose --version

# Step 2: Setup environment (if .env doesn't exist)
copy .env.example .env
# Edit .env file and add your GEMINI_API_KEY

# Step 3: Start infrastructure
npm run docker:up

# Step 4: Install dependencies (REQUIRED EVERY TIME)
npm run install:all

# Step 5: Setup database
npm run db:migrate
npm run db:seed

# Step 6: Start development servers
npm run dev
```

### ⚠️ Important Note:
**You need to run `npm run install:all` every time before starting the project** due to your system configuration.

## 📋 Prerequisites

Before running the startup script, ensure you have:
- **Node.js 18+** installed
- **Docker & Docker Compose** installed
- **Git** installed

## 🔑 Environment Setup

1. **Get Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Edit .env file**: Add your `GEMINI_API_KEY` to the .env file

## 🌐 Access Points

Once the startup script completes successfully:

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:3000  
- **Database Admin (Adminer)**: http://localhost:8080
  - Server: `postgres`
  - Username: `tutorspeakai`
  - Password: `tutorspeakai_password`
  - Database: `tutorspeakai`

## 🛠️ Individual Commands (Alternative)

If you prefer to run commands individually:

```bash
# Start infrastructure only
npm run docker:up

# Install dependencies only
npm run install:all

# Database operations
npm run db:migrate    # Run migrations
npm run db:seed       # Seed sample data
npm run db:reset      # Reset database

# Start servers
npm run dev           # Both frontend & backend
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only

# Stop infrastructure
npm run docker:down
```

## 🔧 Troubleshooting

### Port Conflicts
Ensure these ports are available:
- 3000 (Backend API)
- 5173 (Frontend)
- 5432 (PostgreSQL)
- 6379 (Redis)
- 8080 (Adminer)

### Docker Issues
- Ensure Docker Desktop is running
- Check Docker permissions
- Try `docker-compose down` then `docker-compose up -d`

### Database Connection Issues
- Wait 10-15 seconds after starting Docker services
- Check container health: `docker ps`
- Verify .env database credentials match docker-compose.yml

### Missing Dependencies
- Delete node_modules folders and run `npm run install:all` again
- Ensure Node.js version is 18+

## 📁 Project Structure

```
TutorSpeakAI/
├── frontend/          # React + Vite + TypeScript
├── backend/           # Node.js + Express + Prisma
├── shared/            # Shared TypeScript types
├── docker-compose.yml # Infrastructure services
├── start-project.sh   # Automated startup script
└── package.json       # Root workspace config
```

## 🎯 What the Startup Script Does

1. **Checks Prerequisites**: Verifies Node.js, Docker, and Docker Compose
2. **Environment Setup**: Creates .env from .env.example if needed
3. **Infrastructure**: Starts PostgreSQL, Redis, and Adminer containers
4. **Dependencies**: Installs all npm packages for frontend, backend, and shared
5. **Database**: Runs migrations and seeds sample data
6. **Development**: Starts both frontend and backend development servers

## 🚪 Stopping the Project

Press `Ctrl+C` in the terminal to stop the development servers.

To stop infrastructure services:
```bash
npm run docker:down
```

## 📝 Quick Command Reference

For your system (requires npm install:all every time):
```bash
npm run docker:up
npm run install:all
npm run db:migrate
npm run db:seed
npm run dev
```
