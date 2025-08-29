// Application Constants
export const APP_NAME = 'TutorSpeakAI';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Voice-First AI Tutoring Platform';

// API Configuration
export const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3000';
export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION}`;

// Authentication
export const JWT_EXPIRES_IN = '15m';
export const JWT_REFRESH_EXPIRES_IN = '7d';
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 128;

// Subscription Tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  BASIC: 'basic',
  PRO: 'pro',
  TEAM: 'team',
  ENTERPRISE: 'enterprise',
} as const;

export const SUBSCRIPTION_LIMITS = {
  [SUBSCRIPTION_TIERS.FREE]: {
    monthlyMinutes: 30,
    maxCompanions: 2,
    maxCourses: 5,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFilesPerCourse: 3,
  },
  [SUBSCRIPTION_TIERS.BASIC]: {
    monthlyMinutes: 300,
    maxCompanions: 10,
    maxCourses: 25,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxFilesPerCourse: 10,
  },
  [SUBSCRIPTION_TIERS.PRO]: {
    monthlyMinutes: -1, // Unlimited
    maxCompanions: -1, // Unlimited
    maxCourses: -1, // Unlimited
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxFilesPerCourse: 25,
  },
  [SUBSCRIPTION_TIERS.TEAM]: {
    monthlyMinutes: -1, // Unlimited
    maxCompanions: -1, // Unlimited
    maxCourses: -1, // Unlimited
    maxFileSize: 200 * 1024 * 1024, // 200MB
    maxFilesPerCourse: 50,
  },
  [SUBSCRIPTION_TIERS.ENTERPRISE]: {
    monthlyMinutes: -1, // Unlimited
    maxCompanions: -1, // Unlimited
    maxCourses: -1, // Unlimited
    maxFileSize: 500 * 1024 * 1024, // 500MB
    maxFilesPerCourse: 100,
  },
} as const;

// File Upload
export const SUPPORTED_FILE_TYPES = {
  DOCUMENTS: ['.pdf', '.docx', '.pptx', '.txt'],
  IMAGES: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  AUDIO: ['.mp3', '.wav', '.ogg', '.m4a'],
  VIDEO: ['.mp4', '.webm', '.mov'],
} as const;

export const MIME_TYPES = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'text/plain': '.txt',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'audio/mpeg': '.mp3',
  'audio/wav': '.wav',
  'audio/ogg': '.ogg',
  'audio/mp4': '.m4a',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/quicktime': '.mov',
} as const;

// Course Configuration
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export const COURSE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export const PROCESSING_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

// Assessment Configuration
export const ASSESSMENT_TYPES = {
  QUIZ: 'quiz',
  TEST: 'test',
  ASSIGNMENT: 'assignment',
} as const;

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
  ESSAY: 'essay',
} as const;

export const DEFAULT_PASSING_SCORE = 70;
export const MAX_QUESTION_POINTS = 10;

// Session Configuration
export const SESSION_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
} as const;

export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
} as const;

// Voice Configuration
export const VOICE_IDS = {
  ALLOY: 'alloy',
  ECHO: 'echo',
  FABLE: 'fable',
  ONYX: 'onyx',
  NOVA: 'nova',
  SHIMMER: 'shimmer',
} as const;

export const SPEAKING_STYLES = {
  CONVERSATIONAL: 'conversational',
  PROFESSIONAL: 'professional',
  FRIENDLY: 'friendly',
  ENTHUSIASTIC: 'enthusiastic',
  CALM: 'calm',
} as const;

// Audio Configuration
export const AUDIO_CONFIG = {
  SAMPLE_RATE: 16000,
  CHANNELS: 1,
  CHUNK_SIZE: 1024,
  MAX_RECORDING_DURATION: 300, // 5 minutes
  SILENCE_THRESHOLD: 0.01,
  SILENCE_DURATION: 2000, // 2 seconds
} as const;

// WebSocket Events
export const WS_EVENTS = {
  // Connection
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  
  // Session Management
  SESSION_JOIN: 'session:join',
  SESSION_LEAVE: 'session:leave',
  SESSION_START_RECORDING: 'session:start_recording',
  SESSION_STOP_RECORDING: 'session:stop_recording',
  SESSION_USER_MESSAGE: 'session:user_message',
  
  // Audio Streaming
  AUDIO_CHUNK: 'audio:chunk',
  AUDIO_TRANSCRIPT_PARTIAL: 'audio:transcript_partial',
  AUDIO_TRANSCRIPT_FINAL: 'audio:transcript_final',
  AUDIO_RESPONSE_START: 'audio:response_start',
  AUDIO_RESPONSE_CHUNK: 'audio:response_chunk',
  AUDIO_RESPONSE_END: 'audio:response_end',
  
  // Real-time Updates
  SESSION_USER_JOINED: 'session:user_joined',
  SESSION_USER_LEFT: 'session:user_left',
  SESSION_STATUS_UPDATE: 'session:status_update',
  
  // Course Generation
  COURSE_GENERATION_START: 'course:generation_start',
  COURSE_GENERATION_PROGRESS: 'course:generation_progress',
  COURSE_GENERATION_COMPLETE: 'course:generation_complete',
  
  // Narration Generation
  NARRATION_GENERATION_START: 'narration:generation_start',
  NARRATION_GENERATION_COMPLETE: 'narration:generation_complete',
  
  // Error Handling
  ERROR: 'error',
} as const;

// AI Provider Configuration
export const AI_PROVIDERS = {
  GEMINI: 'gemini',
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GOOGLE: 'google',
} as const;

export const AI_MODELS = {
  [AI_PROVIDERS.GEMINI]: {
    TEXT: 'gemini-pro',
    VISION: 'gemini-pro-vision',
  },
  [AI_PROVIDERS.OPENAI]: {
    TEXT: 'gpt-4',
    VISION: 'gpt-4-vision-preview',
    STT: 'whisper-1',
    TTS: 'tts-1',
  },
  [AI_PROVIDERS.ANTHROPIC]: {
    TEXT: 'claude-3-opus-20240229',
  },
  [AI_PROVIDERS.GOOGLE]: {
    STT: 'latest_long',
    TTS: 'en-US-Wavenet-D',
  },
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
  },
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
  },
  UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 uploads per hour
  },
  VOICE: {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 voice messages per minute
  },
} as const;

// Validation Rules
export const VALIDATION = {
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 254,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
  },
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255,
  },
  DESCRIPTION: {
    MAX_LENGTH: 2000,
  },
  CONTENT: {
    MAX_LENGTH: 50000,
  },
  SYSTEM_PROMPT: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000,
  },
} as const;

// Error Codes
export const ERROR_CODES = {
  // Authentication
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Permissions
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Limits
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  
  // Processing
  PROCESSING_ERROR: 'PROCESSING_ERROR',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  UPLOAD_ERROR: 'UPLOAD_ERROR',
  
  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  USER_LOGGED_IN: 'User logged in successfully',
  COMPANION_CREATED: 'Companion created successfully',
  COMPANION_UPDATED: 'Companion updated successfully',
  COMPANION_DELETED: 'Companion deleted successfully',
  COURSE_CREATED: 'Course created successfully',
  COURSE_UPDATED: 'Course updated successfully',
  COURSE_DELETED: 'Course deleted successfully',
  COURSE_GENERATED: 'Course content generated successfully',
  FILE_UPLOADED: 'File uploaded successfully',
  SESSION_STARTED: 'Session started successfully',
  SESSION_ENDED: 'Session ended successfully',
} as const;

// Default Values
export const DEFAULTS = {
  PAGINATION: {
    PAGE: 1,
    LIMIT: 10,
    MAX_LIMIT: 100,
  },
  COURSE: {
    DIFFICULTY: DIFFICULTY_LEVELS.BEGINNER,
    STATUS: COURSE_STATUS.DRAFT,
    ESTIMATED_DURATION: 60, // minutes
  },
  ASSESSMENT: {
    TYPE: ASSESSMENT_TYPES.QUIZ,
    PASSING_SCORE: DEFAULT_PASSING_SCORE,
    TIME_LIMIT: 30, // minutes
  },
  COMPANION: {
    VOICE_ID: VOICE_IDS.ALLOY,
    SPEAKING_STYLE: SPEAKING_STYLES.CONVERSATIONAL,
  },
} as const;
