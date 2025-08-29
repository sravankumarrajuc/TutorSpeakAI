import { z } from 'zod';
import { 
  UserSchema, 
  CompanionSchema, 
  CourseSchema, 
  ChapterSchema, 
  AssessmentSchema, 
  QuestionSchema, 
  SessionSchema, 
  MessageSchema,
  CourseDocumentSchema,
  UserCourseProgressSchema,
  AssessmentAttemptSchema
} from './common';

// Authentication API types
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const AuthResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

// Companion API types
export const CreateCompanionRequestSchema = CompanionSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateCompanionRequestSchema = CreateCompanionRequestSchema.partial();

export type CreateCompanionRequest = z.infer<typeof CreateCompanionRequestSchema>;
export type UpdateCompanionRequest = z.infer<typeof UpdateCompanionRequestSchema>;

// Course API types
export const CreateCourseRequestSchema = CourseSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateCourseRequestSchema = CreateCourseRequestSchema.partial();

export const GenerateCourseRequestSchema = z.object({
  courseId: z.string().uuid(),
  generateNarration: z.boolean().default(true),
  generateAssessments: z.boolean().default(true),
});

export type CreateCourseRequest = z.infer<typeof CreateCourseRequestSchema>;
export type UpdateCourseRequest = z.infer<typeof UpdateCourseRequestSchema>;
export type GenerateCourseRequest = z.infer<typeof GenerateCourseRequestSchema>;

// Chapter API types
export const CreateChapterRequestSchema = ChapterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  voiceNarrationUrl: true,
  narrationStatus: true,
});

export const UpdateChapterRequestSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  orderIndex: z.number().int().min(0).optional(),
  estimatedDuration: z.number().positive().optional(),
});

export type CreateChapterRequest = z.infer<typeof CreateChapterRequestSchema>;
export type UpdateChapterRequest = z.infer<typeof UpdateChapterRequestSchema>;

// Assessment API types
export const CreateAssessmentRequestSchema = AssessmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateAssessmentRequestSchema = CreateAssessmentRequestSchema.partial();

export const CreateQuestionRequestSchema = QuestionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  voiceInstructionUrl: true,
});

export const UpdateQuestionRequestSchema = CreateQuestionRequestSchema.partial();

export type CreateAssessmentRequest = z.infer<typeof CreateAssessmentRequestSchema>;
export type UpdateAssessmentRequest = z.infer<typeof UpdateAssessmentRequestSchema>;
export type CreateQuestionRequest = z.infer<typeof CreateQuestionRequestSchema>;
export type UpdateQuestionRequest = z.infer<typeof UpdateQuestionRequestSchema>;

// Session API types
export const CreateSessionRequestSchema = z.object({
  companionId: z.string().uuid(),
  title: z.string().optional(),
});

export const SendMessageRequestSchema = z.object({
  sessionId: z.string().uuid(),
  content: z.string().min(1),
  audioData: z.string().optional(), // Base64 encoded audio
});

export type CreateSessionRequest = z.infer<typeof CreateSessionRequestSchema>;
export type SendMessageRequest = z.infer<typeof SendMessageRequestSchema>;

// File Upload API types
export const FileUploadResponseSchema = z.object({
  id: z.string().uuid(),
  filename: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string(),
});

export type FileUploadResponse = z.infer<typeof FileUploadResponseSchema>;

// Analytics API types
export const DashboardAnalyticsSchema = z.object({
  totalStudyTime: z.number(), // in seconds
  completedCourses: z.number(),
  averageScore: z.number(),
  progressData: z.array(z.object({
    date: z.string(),
    studyTime: z.number(),
    sessions: z.number(),
  })),
  sessionStats: z.object({
    totalSessions: z.number(),
    averageSessionLength: z.number(),
    longestSession: z.number(),
  }),
  courseProgress: z.array(UserCourseProgressSchema),
});

export type DashboardAnalytics = z.infer<typeof DashboardAnalyticsSchema>;

// Pagination types
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }),
  });

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// Error response types
export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
  timestamp: z.string(),
  path: z.string().optional(),
  details: z.any().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// Success response types
export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean().default(true),
    data: dataSchema,
    message: z.string().optional(),
  });

export type SuccessResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};
