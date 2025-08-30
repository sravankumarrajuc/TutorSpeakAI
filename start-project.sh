#!/bin/bash

echo "========================================"
echo "TutorSpeakAI Project Startup Script"
echo "========================================"
echo

echo "Step 1: Checking prerequisites..."
echo "- Node.js version:"
node --version
echo "- Docker version:"
docker --version
echo "- Docker Compose version:"
docker-compose --version
echo

echo "Step 2: Setting up environment variables..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo ".env file created from .env.example"
        echo "IMPORTANT: Please edit .env file and add your GEMINI_API_KEY"
        read -p "Press Enter to continue after editing .env file..."
    else
        echo "WARNING: No .env.example file found. You may need to create .env manually."
    fi
else
    echo ".env file already exists"
fi
echo

echo "Step 3: Starting infrastructure services (PostgreSQL, Redis, Adminer)..."
npm run docker:up
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to start Docker services"
    exit 1
fi
echo "Waiting for services to be ready..."
sleep 10
echo

echo "Step 4: Installing dependencies for all packages..."
echo "NOTE: Running npm install:all (required every time for this system)"
npm run install:all
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo

echo "Step 5: Setting up database..."
echo "Running database migrations..."
npm run db:migrate
if [ $? -ne 0 ]; then
    echo "ERROR: Database migration failed"
    exit 1
fi

echo "Seeding database with sample data..."
npm run db:seed
if [ $? -ne 0 ]; then
    echo "ERROR: Database seeding failed"
    exit 1
fi
echo

echo "Step 6: Starting development servers..."
echo "Starting both frontend and backend servers..."
echo
echo "========================================"
echo "ACCESS POINTS:"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:3000"
echo "- Database Admin: http://localhost:8080"
echo "========================================"
echo
echo "Press Ctrl+C to stop all servers"
npm run dev
