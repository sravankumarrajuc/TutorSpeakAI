# TutorSpeakAI - Voice-First AI Tutoring Platform

A comprehensive voice-first AI tutoring platform with course creation capabilities, real-time voice interaction, and personalized AI companions.

## 🚀 Features

- **Course Creation System**: Upload documents → AI-generated structured courses
- **AI Companion Management**: Personalized tutors with configurable personas
- **Real-time Voice Interaction**: Low-latency voice conversations with barge-in
- **Assessment System**: Auto-generated tests with voice guidance
- **Analytics & Progress Tracking**: Comprehensive learning analytics
- **Modular AI Providers**: Swappable LLM/STT/TTS services

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Prisma
- **Database**: PostgreSQL + Redis
- **AI**: Gemini API (expandable to OpenAI, Anthropic)
- **Real-time**: Socket.io + WebRTC
- **Infrastructure**: Docker + Docker Compose

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TutorSpeakAI
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration (especially GEMINI_API_KEY)
   ```

3. **Start infrastructure services**
   ```bash
   npm run docker:up
   ```

4. **Install dependencies**
   ```bash
   npm run install:all
   ```

5. **Setup database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

6. **Start development servers**
   ```bash
   npm run dev
   ```

### Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Database Admin**: http://localhost:8080 (Adminer)

## 📁 Project Structure

```
TutorSpeakAI/
├── frontend/          # React application
├── backend/           # Node.js API server
├── shared/            # Shared types and utilities
├── docs/              # Documentation
├── docker-compose.yml # Development infrastructure
└── package.json       # Root package configuration
```

## 🔧 Development Commands

```bash
# Start all services
npm run dev

# Start individual services
npm run dev:frontend
npm run dev:backend

# Database operations
npm run db:migrate     # Run database migrations
npm run db:seed        # Seed database with sample data
npm run db:reset       # Reset database

# Docker operations
npm run docker:up      # Start infrastructure
npm run docker:down    # Stop infrastructure

# Build for production
npm run build

# Run tests
npm run test
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Authentication and user profiles
- **Companions**: AI tutor configurations
- **Courses**: Course content and structure
- **Chapters**: Individual course sections
- **Assessments**: Tests and quizzes
- **Sessions**: Voice interaction sessions
- **Messages**: Conversation history
- **Analytics**: Performance tracking

## 🤖 AI Integration

### Gemini API Setup

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env` file:
   ```bash
   GEMINI_API_KEY="your-gemini-api-key"
   ```

### Supported AI Providers

- **Gemini**: Primary LLM provider
- **OpenAI**: GPT-4, Whisper STT, TTS (optional)
- **Anthropic**: Claude (optional)

## 🔐 Authentication

The platform uses JWT-based authentication with:
- Access tokens (15 minutes)
- Refresh tokens (7 days)
- Role-based access control
- Session management

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/me` - Get current user

### Companions
- `GET /api/companions` - List companions
- `POST /api/companions` - Create companion
- `PUT /api/companions/:id` - Update companion
- `DELETE /api/companions/:id` - Delete companion

### Courses
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course
- `POST /api/courses/:id/documents` - Upload documents
- `POST /api/courses/:id/generate` - Generate course content

### Sessions
- `POST /api/sessions` - Start voice session
- `GET /api/sessions/:id` - Get session details
- WebSocket events for real-time communication

## 🎯 Implementation Phases

### ✅ Phase 1: Foundation (Current)
- Project setup and infrastructure
- Authentication system
- Basic UI components
- Database schema

### 🔄 Phase 2: Course Creation (Next)
- Document upload and processing
- AI-powered content generation
- Course management interface

### 📋 Phase 3: Companion Management
- Companion creation and configuration
- AI provider abstraction
- Knowledge source management

### 📝 Phase 4: Assessment System
- Question generation
- Voice-guided assessments
- Automated grading

### 🎙️ Phase 5: Voice System
- Real-time voice interaction
- WebRTC integration
- Speech-to-text/text-to-speech

### 📈 Phase 6: Analytics
- Progress tracking
- Performance metrics
- Learning analytics

## 🧪 Testing

```bash
# Run all tests
npm run test

# Frontend tests
npm run test:frontend

# Backend tests
npm run test:backend
```

## 🚀 Deployment

### Development
```bash
docker-compose up -d
npm run dev
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in `/docs`
- Review the API documentation

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced RAG implementation
- [ ] Multi-language support
- [ ] AR/VR integration
- [ ] Enterprise features
