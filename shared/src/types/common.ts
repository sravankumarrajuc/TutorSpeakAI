import { z } from 'zod';

// Base entity schema
export const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BaseEntity = z.infer<typeof BaseEntitySchema>;

// User types
export const UserSchema = BaseEntitySchema.extend({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  subscriptionTier: z.enum(['free', 'basic', 'pro', 'team', 'enterprise']).default('free'),
});

export type User = z.infer<typeof UserSchema>;

// Companion types
export const CompanionSchema = BaseEntitySchema.extend({
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  avatarUrl: z.string().url().optional(),
  subjectDomain: z.string().optional(),
  systemPrompt: z.string().min(1),
  voiceId: z.string().optional(),
  speakingStyle: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export type Companion = z.infer<typeof CompanionSchema>;

// Course types
export const CourseSchema = BaseEntitySchema.extend({
  userId: z.string().uuid(),
  companionId: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  subjectDomain: z.string().optional(),
  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  estimatedDuration: z.number().positive().optional(),
  isPublic: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export type Course = z.infer<typeof CourseSchema>;

// Chapter types
export const ChapterSchema = BaseEntitySchema.extend({
  courseId: z.string().uuid(),
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  orderIndex: z.number().int().min(0),
  estimatedDuration: z.number().positive().optional(),
  voiceNarrationUrl: z.string().url().optional(),
  narrationStatus: z.enum(['pending', 'generating', 'completed', 'failed']).default('pending'),
});

export type Chapter = z.infer<typeof ChapterSchema>;

// Assessment types
export const AssessmentSchema = BaseEntitySchema.extend({
  courseId: z.string().uuid(),
  chapterId: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.enum(['quiz', 'test', 'assignment']),
  timeLimit: z.number().positive().optional(),
  passingScore: z.number().int().min(0).max(100).default(70),
  isVoiceGuided: z.boolean().default(true),
});

export type Assessment = z.infer<typeof AssessmentSchema>;

// Question types
export const QuestionSchema = BaseEntitySchema.extend({
  assessmentId: z.string().uuid(),
  questionText: z.string().min(1),
  questionType: z.enum(['multiple_choice', 'true_false', 'short_answer', 'essay']),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  explanation: z.string().optional(),
  points: z.number().int().positive().default(1),
  orderIndex: z.number().int().min(0),
  voiceInstructionUrl: z.string().url().optional(),
});

export type Question = z.infer<typeof QuestionSchema>;

// Session types
export const SessionSchema = BaseEntitySchema.extend({
  userId: z.string().uuid(),
  companionId: z.string().uuid(),
  title: z.string().optional(),
  status: z.enum(['active', 'completed', 'paused']).default('active'),
  startedAt: z.date(),
  endedAt: z.date().optional(),
  totalDuration: z.number().int().min(0).optional(),
  totalTurns: z.number().int().min(0).default(0),
  totalTokens: z.number().int().min(0).default(0),
});

export type Session = z.infer<typeof SessionSchema>;

// Message types
export const MessageSchema = BaseEntitySchema.extend({
  sessionId: z.string().uuid(),
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
  audioUrl: z.string().url().optional(),
  timestampStart: z.number().int().min(0).optional(),
  timestampEnd: z.number().int().min(0).optional(),
  tokensUsed: z.number().int().min(0).optional(),
  latencyMs: z.number().int().min(0).optional(),
});

export type Message = z.infer<typeof MessageSchema>;

// Course Document types
export const CourseDocumentSchema = BaseEntitySchema.extend({
  courseId: z.string().uuid(),
  originalFilename: z.string().min(1),
  filePath: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.number().int().positive(),
  processingStatus: z.enum(['pending', 'processing', 'completed', 'failed']).default('pending'),
  extractedContent: z.string().optional(),
});

export type CourseDocument = z.infer<typeof CourseDocumentSchema>;

// User Course Progress types
export const UserCourseProgressSchema = BaseEntitySchema.extend({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  currentChapterId: z.string().uuid().optional(),
  completionPercentage: z.number().min(0).max(100).default(0),
  startedAt: z.date(),
  completedAt: z.date().optional(),
  lastAccessedAt: z.date(),
});

export type UserCourseProgress = z.infer<typeof UserCourseProgressSchema>;

// Assessment Attempt types
export const AssessmentAttemptSchema = BaseEntitySchema.extend({
  userId: z.string().uuid(),
  assessmentId: z.string().uuid(),
  score: z.number().int().min(0).optional(),
  maxScore: z.number().int().positive().optional(),
  percentage: z.number().min(0).max(100).optional(),
  answers: z.record(z.any()),
  startedAt: z.date(),
  completedAt: z.date().optional(),
  timeTaken: z.number().int().min(0).optional(),
});

export type AssessmentAttempt = z.infer<typeof AssessmentAttemptSchema>;

// Knowledge Source types
export const KnowledgeSourceSchema = BaseEntitySchema.extend({
  companionId: z.string().uuid(),
  type: z.enum(['file', 'url']),
  sourceUrl: z.string().url().optional(),
  filePath: z.string().optional(),
  title: z.string().optional(),
  contentHash: z.string().optional(),
});

export type KnowledgeSource = z.infer<typeof KnowledgeSourceSchema>;

// Analytics types
export const AnalyticsSchema = BaseEntitySchema.extend({
  sessionId: z.string().uuid(),
  metricName: z.string().min(1),
  metricValue: z.number(),
  metadata: z.record(z.any()).optional(),
  recordedAt: z.date(),
});

export type Analytics = z.infer<typeof AnalyticsSchema>;

// User Settings types
export const UserSettingsSchema = BaseEntitySchema.extend({
  userId: z.string().uuid(),
  preferredVoice: z.string().optional(),
  autoSaveSessions: z.boolean().default(true),
  pushToTalk: z.boolean().default(false),
  noiseSuppression: z.boolean().default(true),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;
