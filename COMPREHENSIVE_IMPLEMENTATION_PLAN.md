# TutorSpeakAI - Comprehensive Implementation Plan
## Complete Step-by-Step Implementation Guide

### Executive Summary

This document provides a detailed, actionable implementation plan for TutorSpeakAI - a voice-first AI tutoring platform with course creation capabilities. The plan breaks down the development into manageable phases with specific tasks, technical specifications, and implementation details.

**Key Features to Implement:**
- 🎯 **Course Creation System**: Upload documents → AI-generated structured courses
- 🤖 **AI Companion Management**: Personalized tutors with configurable personas
- 🎙️ **Real-time Voice Interaction**: Low-latency voice conversations with barge-in
- 📊 **Assessment System**: Auto-generated tests with voice guidance
- 📈 **Analytics & Progress Tracking**: Comprehensive learning analytics
- 🔄 **Modular AI Providers**: Swappable LLM/STT/TTS services

---

## Phase 1: Foundation & Infrastructure Setup
**Duration:** 2 weeks | **Priority:** Critical

### 1.1 Project Initialization & Setup

#### Frontend Setup (React + TypeScript + Vite)
```bash
# Create frontend project
npm create vite@latest frontend -- --template react-ts
cd frontend

# Install core dependencies
npm install @tanstack/react-query axios zustand
npm install @headlessui/react @heroicons/react
npm install framer-motion react-router-dom
npm install socket.io-client
npm install @types/node

# Install development dependencies
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/react @types/react-dom
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Implementation Steps:**
1. **Initialize Vite Project**
   ```typescript
   // vite.config.ts
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import path from 'path'

   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
       },
     },
     server: {
       port: 5173,
       proxy: {
         '/api': {
           target: 'http://localhost:3000',
           changeOrigin: true,
         },
         '/socket.io': {
           target: 'http://localhost:3000',
           ws: true,
         },
       },
     },
   })
   ```

2. **Setup Tailwind CSS**
   ```bash
   npx tailwindcss init -p
   ```
   ```javascript
   // tailwind.config.js
   module.exports = {
     content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
     theme: {
       extend: {
         colors: {
           primary: {
             50: '#eff6ff',
             500: '#3b82f6',
             600: '#2563eb',
             700: '#1d4ed8',
           },
         },
       },
     },
     plugins: [],
   }
   ```

3. **Create Base Project Structure**
   ```
   frontend/src/
   ├── components/
   │   ├── ui/           # Reusable UI components
   │   ├── layout/       # Layout components
   │   ├── companion/    # Companion-related components
   │   ├── course/       # Course creation components
   │   ├── assessment/   # Assessment components
   │   └── session/      # Voice session components
   ├── pages/            # Page components
   ├── hooks/            # Custom React hooks
   ├── services/         # API services
   ├── stores/           # Zustand stores
   ├── types/            # TypeScript definitions
   ├── utils/            # Helper functions
   └── styles/           # Global styles
   ```

#### Backend Setup (Node.js + Express + TypeScript)
```bash
# Create backend project
mkdir backend && cd backend
npm init -y

# Install core dependencies
npm install express cors helmet morgan
npm install @prisma/client prisma
npm install bcryptjs jsonwebtoken
npm install socket.io redis ioredis
npm install multer aws-sdk
npm install express-rate-limit express-validator
npm install winston dotenv

# Install development dependencies
npm install -D typescript @types/node @types/express
npm install -D @types/bcryptjs @types/jsonwebtoken
npm install -D @types/multer @types/cors
npm install -D nodemon ts-node jest @types/jest
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Implementation Steps:**
1. **Setup TypeScript Configuration**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "commonjs",
       "lib": ["ES2020"],
       "outDir": "./dist",
       "rootDir": "./src",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "resolveJsonModule": true,
       "declaration": true,
       "declarationMap": true,
       "sourceMap": true
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist"]
   }
   ```

2. **Create Base Server Structure**
   ```
   backend/src/
   ├── controllers/      # Route handlers
   ├── middleware/       # Express middleware
   ├── models/          # Database models
   ├── services/        # Business logic
   ├── ai-providers/    # AI integration layer
   ├── websocket/       # Real-time handlers
   ├── routes/          # API routes
   ├── utils/           # Helper functions
   ├── config/          # Configuration
   ├── app.ts           # Express app setup
   └── server.ts        # Server entry point
   ```

3. **Setup Basic Express Server**
   ```typescript
   // src/app.ts
   import express from 'express';
   import cors from 'cors';
   import helmet from 'helmet';
   import morgan from 'morgan';
   import { createServer } from 'http';
   import { Server } from 'socket.io';

   const app = express();
   const server = createServer(app);
   const io = new Server(server, {
     cors: {
       origin: process.env.FRONTEND_URL || "http://localhost:5173",
       methods: ["GET", "POST"]
     }
   });

   // Middleware
   app.use(helmet());
   app.use(cors());
   app.use(morgan('combined'));
   app.use(express.json({ limit: '10mb' }));
   app.use(express.urlencoded({ extended: true }));

   // Routes
   app.get('/health', (req, res) => {
     res.json({ status: 'OK', timestamp: new Date().toISOString() });
   });

   export { app, server, io };
   ```

### 1.2 Database Setup & Configuration

#### PostgreSQL + Prisma Setup
```bash
# Initialize Prisma
npx prisma init
```

**Implementation Steps:**
1. **Create Prisma Schema**
   ```prisma
   // prisma/schema.prisma
   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   model User {
     id               String   @id @default(cuid())
     email            String   @unique
     passwordHash     String   @map("password_hash")
     firstName        String?  @map("first_name")
     lastName         String?  @map("last_name")
     avatarUrl        String?  @map("avatar_url")
     subscriptionTier String   @default("free") @map("subscription_tier")
     createdAt        DateTime @default(now()) @map("created_at")
     updatedAt        DateTime @updatedAt @map("updated_at")

     companions       Companion[]
     courses          Course[]
     sessions         Session[]
     courseProgress   UserCourseProgress[]
     assessmentAttempts AssessmentAttempt[]
     settings         UserSettings?

     @@map("users")
   }

   model Companion {
     id            String   @id @default(cuid())
     userId        String   @map("user_id")
     name          String
     avatarUrl     String?  @map("avatar_url")
     subjectDomain String?  @map("subject_domain")
     systemPrompt  String   @map("system_prompt")
     voiceId       String?  @map("voice_id")
     speakingStyle String?  @map("speaking_style")
     isPublic      Boolean  @default(false) @map("is_public")
     createdAt     DateTime @default(now()) @map("created_at")
     updatedAt     DateTime @updatedAt @map("updated_at")

     user            User              @relation(fields: [userId], references: [id], onDelete: Cascade)
     courses         Course[]
     sessions        Session[]
     knowledgeSources KnowledgeSource[]

     @@map("companions")
   }

   model Course {
     id                String   @id @default(cuid())
     userId            String   @map("user_id")
     companionId       String?  @map("companion_id")
     title             String
     description       String?
     subjectDomain     String?  @map("subject_domain")
     difficultyLevel   String?  @map("difficulty_level")
     estimatedDuration Int?     @map("estimated_duration")
     isPublic          Boolean  @default(false) @map("is_public")
     status            String   @default("draft")
     createdAt         DateTime @default(now()) @map("created_at")
     updatedAt         DateTime @updatedAt @map("updated_at")

     user            User                 @relation(fields: [userId], references: [id], onDelete: Cascade)
     companion       Companion?           @relation(fields: [companionId], references: [id], onDelete: SetNull)
     documents       CourseDocument[]
     chapters        Chapter[]
     assessments     Assessment[]
     userProgress    UserCourseProgress[]

     @@map("courses")
   }

   // Add remaining models...
   ```

2. **Setup Database Connection**
   ```typescript
   // src/config/database.ts
   import { PrismaClient } from '@prisma/client';

   const prisma = new PrismaClient({
     log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
   });

   export default prisma;
   ```

3. **Create Migration and Seed**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

### 1.3 Authentication System Implementation

#### JWT Authentication Setup
```typescript
// src/services/authService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

export class AuthService {
  async register(email: string, password: string, firstName?: string, lastName?: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
      },
    });

    const tokens = this.generateTokens(user.id);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const tokens = this.generateTokens(user.id);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  private generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
```

#### Authentication Middleware
```typescript
// src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, firstName: true, lastName: true, subscriptionTier: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
```

### 1.4 Basic UI Components & Layout

#### Create Base UI Components
```typescript
// src/components/ui/Button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

export { Button, buttonVariants };
```

#### Create Layout Components
```typescript
// src/components/layout/Layout.tsx
import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
```

### 1.5 State Management Setup

#### Zustand Stores
```typescript
// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  subscriptionTier: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

---

## Phase 2: Course Creation System
**Duration:** 2 weeks | **Priority:** High

### 2.1 Document Upload & Processing

#### File Upload Component
```typescript
// src/components/course/DocumentUpload.tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline';

interface DocumentUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onFilesSelected,
  maxFiles = 10,
  acceptedTypes = ['.pdf', '.docx', '.pptx', '.txt']
}) => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
    
    // Simulate upload progress
    acceptedFiles.forEach(file => {
      const fileName = file.name;
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({ ...prev, [fileName]: progress }));
        
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    });
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt']
    }
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports: PDF, DOCX, PPTX, TXT (max {maxFiles} files)
        </p>
      </div>

      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploading files...</h4>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="flex items-center space-x-3">
              <DocumentIcon className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span className="truncate">{fileName}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
      )}
    </div>
  );
};
```

#### Backend Document Processing
```typescript
// src/services/documentProcessor.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { PDFExtract } from 'pdf.js-extract';
import mammoth from 'mammoth';

export class DocumentProcessor {
  private pdfExtract = new PDFExtract();

  async processDocument(filePath: string, fileType: string): Promise<string> {
    switch (fileType) {
      case 'application/pdf':
        return this.processPDF(filePath);
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return this.processDOCX(filePath);
      case 'text/plain':
        return this.processTXT(filePath);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  private async processPDF(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.pdfExtract.extract(filePath, {}, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        const text = data.pages
          .map(page => page.content.map(item => item.str).join(' '))
          .join('\n\n');
        
        resolve(text);
      });
    });
  }

  private async processDOCX(filePath: string): Promise<string> {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  private async processTXT(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8');
  }
}
```

### 2.2 AI-Powered Course Generation

#### Content Generation Service
```typescript
// src/services/contentGenerator.ts
import { OpenAI } from 'openai';

export class ContentGenerator {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateCourseStructure(content: string, metadata: any) {
    const prompt = `Create a structured course from the following content:
    
    Content: ${content}
    Metadata: ${JSON.stringify(metadata)}
    
    Generate a course structure with:
    1. Course title and description
    2. 5-8 chapters with titles and learning objectives
    3. Estimated duration for each chapter
    4. Key concepts for each chapter
    
    Format as JSON.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  async generateChapterContent(chapterTitle: string, objectives: string[], sourceContent: string) {
    const prompt = `Create detailed chapter content for: "${chapterTitle}"
    
    Learning Objectives: ${objectives.join(', ')}
    Source Material: ${sourceContent}
    
    Generate comprehensive chapter content with clear explanations and examples.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content || '';
  }
}
```

---

## Phase 3: AI Companion Management
**Duration:** 2 weeks | **Priority:** High

### 3.1 Companion Configuration System

#### Companion Creation Interface
```typescript
// src/components/companion/CompanionForm.tsx
import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface CompanionFormProps {
  onSubmit: (companion: CompanionData) => void;
  initialData?: Partial<CompanionData>;
}

interface CompanionData {
  name: string;
  subjectDomain: string;
  systemPrompt: string;
  voiceId: string;
  speakingStyle: string;
}

export const CompanionForm: React.FC<CompanionFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<CompanionData>({
    name: initialData?.name || '',
    subjectDomain: initialData?.subjectDomain || '',
    systemPrompt: initialData?.systemPrompt || '',
    voiceId: initialData?.voiceId || 'alloy',
    speakingStyle: initialData?.speakingStyle || 'conversational',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Companion Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Subject Domain
        </label>
        <select
          value={formData.subjectDomain}
          onChange={(e) => setFormData({ ...formData, subjectDomain: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="">Select a domain</option>
          <option value="mathematics">Mathematics</option>
          <option value="science">Science</option>
          <option value="language">Language Arts</option>
          <option value="history">History</option>
          <option value="programming">Programming</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          System Prompt
        </label>
        <textarea
          value={formData.systemPrompt}
          onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Define the companion's personality and teaching style..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Voice Style
        </label>
        <select
          value={formData.voiceId}
          onChange={(e) => setFormData({ ...formData, voiceId: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="alloy">Alloy (Neutral)</option>
          <option value="echo">Echo (Male)</option>
          <option value="fable">Fable (British)</option>
          <option value="onyx">Onyx (Deep)</option>
          <option value="nova">Nova (Female)</option>
          <option value="shimmer">Shimmer (Soft)</option>
        </select>
      </div>

      <Button type="submit" className="w-full">
        Create Companion
      </Button>
    </form>
  );
};
```

### 3.2 AI Provider Abstraction Layer

#### Base AI Provider Interface
```typescript
// src/ai-providers/base/LLMProvider.ts
export abstract class LLMProvider {
  abstract generateResponse(
    messages: Array<{ role: string; content: string }>,
    options?: {
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    }
  ): Promise<string | AsyncIterable<string>>;

  abstract generateStructuredContent(
    prompt: string,
    schema: any
  ): Promise<any>;
}

// src/ai-providers/openai/OpenAILLM.ts
import { OpenAI } from 'openai';
import { LLMProvider } from '../base/LLMProvider';

export class OpenAILLM extends LLMProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    super();
    this.client = new OpenAI({ apiKey });
  }

  async generateResponse(
    messages: Array<{ role: string; content: string }>,
    options = {}
  ): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: messages as any,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
    });

    return response.choices[0].message.content || '';
  }

  async generateStructuredContent(prompt: string, schema: any): Promise<any> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }
}
```

---

## Phase 4: Assessment System
**Duration:** 2 weeks | **Priority:** High

### 4.1 Assessment Builder

#### Question Editor Component
```typescript
// src/components/assessment/QuestionEditor.tsx
import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
}

interface QuestionEditorProps {
  question?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<Question>>(
    question || {
      type: 'multiple_choice',
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      points: 1,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Question);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Question Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="multiple_choice">Multiple Choice</option>
          <option value="true_false">True/False</option>
          <option value="short_answer">Short Answer</option>
          <option value="essay">Essay</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Question Text
        </label>
        <textarea
          value={formData.questionText}
          onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      {formData.type === 'multiple_choice' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Answer Options
          </label>
          {formData.options?.map((option, index) => (
            <div key={index} className="mt-2 flex items-center space-x-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm"
                placeholder={`Option ${index + 1}`}
              />
              <input
                type="radio"
                name="correctAnswer"
                checked={formData.correctAnswer === option}
                onChange={() => setFormData({ ...formData, correctAnswer: option })}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex space-x-4">
        <Button type="submit">Save Question</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
```

### 4.2 Automated Assessment Generation

#### Assessment Service
```typescript
// src/services/assessmentService.ts
import { ContentGenerator } from './contentGenerator';

export class AssessmentService {
  private contentGenerator: ContentGenerator;

  constructor() {
    this.contentGenerator = new ContentGenerator();
  }

  async generateQuestionsFromContent(
    content: string,
    questionCount: number = 5,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ) {
    const prompt = `Generate ${questionCount} ${difficulty} level questions from this content:

    ${content}

    Create a mix of question types:
    - Multiple choice (with 4 options)
    - True/false
    - Short answer

    Format as JSON array with this structure:
    {
      "questions": [
        {
          "type": "multiple_choice",
          "questionText": "Question text here",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A",
          "explanation": "Why this is correct",
          "points": 1
        }
      ]
    }`;

    return await this.contentGenerator.generateStructuredContent(prompt, {});
  }

  async gradeEssayResponse(question: string, studentAnswer: string, rubric?: string) {
    const prompt = `Grade this essay response:

    Question: ${question}
    Student Answer: ${studentAnswer}
    ${rubric ? `Rubric: ${rubric}` : ''}

    Provide:
    1. Score (0-100)
    2. Detailed feedback
    3. Areas for improvement
    4. Strengths identified

    Format as JSON.`;

    return await this.contentGenerator.generateStructuredContent(prompt, {});
  }
}
```

---

## Phase 5: Real-time Voice System
**Duration:** 2 weeks | **Priority:** Critical

### 5.1 WebRTC Audio Implementation

#### Voice Interface Component
```typescript
// src/components/session/VoiceInterface.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useSocket } from '../../hooks/useSocket';
import { Button } from '../ui/Button';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/outline';

interface VoiceInterfaceProps {
  sessionId: string;
  companionId: string;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  sessionId,
  companionId
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const { startRecording, stopRecording, audioLevel } = useWebRTC();
  const { socket, sendMessage } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('audio:transcript_partial', (data) => {
        setTranscript(data.text);
      });

      socket.on('audio:transcript_final', (data) => {
        setTranscript(data.text);
        // Send to AI for processing
        sendMessage('session:user_message', {
          sessionId,
          companionId,
          message: data.text,
          timestamp: Date.now()
        });
      });

      socket.on('audio:response_start', () => {
        setIsPlaying(true);
      });

      socket.on('audio:response_end', () => {
        setIsPlaying(false);
      });
    }

    return () => {
      if (socket) {
        socket.off('audio:transcript_partial');
        socket.off('audio:transcript_final');
        socket.off('audio:response_start');
        socket.off('audio:response_end');
      }
    };
  }, [socket, sessionId, companionId, sendMessage]);

  const handleStartRecording = async () => {
    try {
      await startRecording();
      setIsRecording(true);
      sendMessage('session:start_recording', { sessionId });
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    setIsRecording(false);
    sendMessage('session:stop_recording', { sessionId });
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Audio Level Indicator */}
      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-100"
          style={{ width: `${audioLevel * 100}%` }}
        />
      </div>

      {/* Recording Button */}
      <Button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        variant={isRecording ? 'destructive' : 'default'}
        size="lg"
        className="w-16 h-16 rounded-full"
        disabled={isPlaying}
      >
        {isRecording ? (
          <StopIcon className="h-8 w-8" />
        ) : (
          <MicrophoneIcon className="h-8 w-8" />
        )}
      </Button>

      {/* Status */}
      <div className="text-center">
        {isRecording && (
          <p className="text-sm text-gray-600">Listening...</p>
        )}
        {isPlaying && (
          <p className="text-sm text-gray-600">AI is responding...</p>
        )}
        {!isRecording && !isPlaying && (
          <p className="text-sm text-gray-600">Click to start talking</p>
        )}
      </div>

      {/* Live Transcript */}
      {transcript && (
        <div className="w-full max-w-md p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{transcript}</p>
        </div>
      )}
    </div>
  );
};
```

### 5.2 WebSocket Audio Streaming

#### Audio Handler
```typescript
// src/websocket/audioHandler.ts
import { Server, Socket } from 'socket.io';
import { OpenAI } from 'openai';

export class AudioHandler {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  handleConnection(io: Server, socket: Socket) {
    socket.on('session:start_recording', (data) => {
      console.log(`Recording started for session: ${data.sessionId}`);
    });

    socket.on('session:stop_recording', (data) => {
      console.log(`Recording stopped for session: ${data.sessionId}`);
    });

    socket.on('audio:chunk', async (data) => {
      try {
        // Process audio chunk with Whisper STT
        const transcript = await this.processAudioChunk(data.audioData);
        
        if (transcript) {
          socket.emit('audio:transcript_partial', { text: transcript });
        }
      } catch (error) {
        console.error('Audio processing error:', error);
      }
    });

    socket.on('session:user_message', async (data) => {
      try {
        // Generate AI response
        const response = await this.generateAIResponse(
          data.message,
          data.companionId
        );

        // Convert to speech
        const audioBuffer = await this.textToSpeech(response);

        socket.emit('audio:response_start');
        
        // Stream audio response
        this.streamAudioResponse(socket, audioBuffer);
        
        socket.emit('audio:response_end');
      } catch (error) {
        console.error('Response generation error:', error);
      }
    });
  }

  private async processAudioChunk(audioData: Buffer): Promise<string> {
    // Implement Whisper STT processing
    const response = await this.openai.audio.transcriptions.create({
      file: audioData as any,
      model: 'whisper-1',
    });

    return response.text;
  }

  private async generateAIResponse(message: string, companionId: string): Promise<string> {
    // Get companion configuration and generate response
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful AI tutor.' },
        { role: 'user', content: message }
      ],
    });

    return response.choices[0].message.content || '';
  }

  private async textToSpeech(text: string): Promise<Buffer> {
    const response = await this.openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
    });

    return Buffer.from(await response.arrayBuffer());
  }

  private streamAudioResponse(socket: Socket, audioBuffer: Buffer) {
    const chunkSize = 1024;
    for (let i = 0; i < audioBuffer.length; i += chunkSize) {
      const chunk = audioBuffer.slice(i, i + chunkSize);
      socket.emit('audio:response_chunk', { chunk });
    }
  }
}
```

---

## Phase 6: Analytics & Progress Tracking
**Duration:** 2 weeks | **Priority:** Medium

### 6.1 Analytics Dashboard

#### Progress Dashboard Component
```typescript
// src/components/analytics/ProgressDashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProgressChart } from './ProgressChart';
import { SessionStats } from './SessionStats';
import { CourseProgress } from './CourseProgress';

export const ProgressDashboard: React.FC = () => {
  const { data: analytics } = useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => fetch('/api/analytics/dashboard').then(res => res.json())
  });

  if (!analytics) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Learning Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Study Time</h3>
          <p className="text-3xl font-bold text-primary">
            {Math.round(analytics.totalStudyTime / 60)} hrs
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Courses Completed</h3>
          <p className="text-3xl font-bold text-green-600">
            {analytics.completedCourses}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Average Score</h3>
          <p className="text-3xl font-bold text-blue-600">
            {Math.round(analytics.averageScore)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart data={analytics.progressData} />
        <SessionStats data={analytics.sessionStats} />
      </div>

      <CourseProgress courses={analytics.courseProgress} />
    </div>
  );
};
```

### 6.2 Analytics Service

#### Analytics Collection
```typescript
// src/services/analyticsService.ts
import prisma from '../config/database';

export class AnalyticsService {
  async recordSessionMetrics(sessionId: string, metrics: {
    duration: number;
    messageCount: number;
    tokensUsed: number;
    averageLatency: number;
  }) {
    await prisma.analytics.createMany({
      data: [
        {
          sessionId,
          metricName: 'session_duration',
          metricValue: metrics.duration,
          recordedAt: new Date()
        },
        {
          sessionId,
          metricName: 'message_count',
          metricValue: metrics.messageCount,
          recordedAt: new Date()
        },
        {
          sessionId,
          metricName: 'tokens_used',
          metricValue: metrics.tokensUsed,
          recordedAt: new Date()
        },
        {
          sessionId,
          metricName: 'average_latency',
          metricValue: metrics.averageLatency,
          recordedAt: new Date()
        }
      ]
    });
  }

  async getUserDashboardData(userId: string) {
    const [sessions, courseProgress, assessmentAttempts] = await Promise.all([
      prisma.session.findMany({
        where: { userId },
        include: { messages: true }
      }),
      prisma.userCourseProgress.findMany({
        where: { userId },
        include: { course: true }
      }),
      prisma.assessmentAttempt.findMany({
        where: { userId },
        include: { assessment: true }
      })
    ]);

    const totalStudyTime = sessions.reduce((total, session) => 
      total + (session.totalDuration || 0), 0
    );

    const completedCourses = courseProgress.filter(
      progress => progress.completionPercentage >= 100
    ).length;

    const averageScore = assessmentAttempts.length > 0
      ? assessmentAttempts.reduce((sum, attempt) => 
          sum + (attempt.percentage || 0), 0
        ) / assessmentAttempts.length
      : 0;

    return {
      totalStudyTime,
      completedCourses,
      averageScore,
      progressData: this.generateProgressData(sessions),
      sessionStats: this.generateSessionStats(sessions),
      courseProgress: courseProgress
    };
  }

  private generateProgressData(sessions: any[]) {
    // Generate time-series data for progress charts
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last30Days.map(date => {
      const daysSessions = sessions.filter(session => 
        session.startedAt.toISOString().split('T')[0] === date
      );
      
      return {
        date,
        studyTime: daysSessions.reduce((total, session) => 
          total + (session.totalDuration || 0), 0
        ) / 60, // Convert to minutes
        sessions: daysSessions.length
      };
    });
  }

  private generateSessionStats(sessions: any[]) {
    return {
      totalSessions: sessions.length,
      averageSessionLength: sessions.length > 0
        ? sessions.reduce((sum, session) => 
            sum + (session.totalDuration || 0), 0
          ) / sessions.length / 60
        : 0,
      longestSession: Math.max(
        ...sessions.map(session => session.totalDuration || 0)
      ) / 60
    };
  }
}
```

---

## Phase 7: Advanced Features & Polish
**Duration:** 2 weeks | **Priority:** Medium

### 7.1 Advanced UI/UX Features

#### Theme System
```typescript
// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### 7.2 Performance Optimization

#### Lazy Loading Implementation
```typescript
// src/utils/lazyComponents.ts
import { lazy } from 'react';

export const LazyDashboard = lazy(() => import('../pages/Dashboard'));
export const LazyCompanionStudio = lazy(() => import('../pages/CompanionStudio'));
export const LazyCourseCreator = lazy(() => import('../pages/CourseCreator'));
export const LazySessionView = lazy(() => import('../pages/SessionView'));
export const LazyAnalytics = lazy(() => import('../pages/Analytics'));

// src/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/layout/Layout';
      )}
    </div>

