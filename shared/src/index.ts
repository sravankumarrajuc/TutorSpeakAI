// Export all types
export * from './types/common';
export * from './types/api';
export * from './types/websocket';

// Export utilities
export * from './utils/constants';

// Re-export commonly used schemas for validation
export {
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
  AssessmentAttemptSchema,
  KnowledgeSourceSchema,
  AnalyticsSchema,
  UserSettingsSchema,
} from './types/common';

export {
  LoginRequestSchema,
  RegisterRequestSchema,
  AuthResponseSchema,
  CreateCompanionRequestSchema,
  UpdateCompanionRequestSchema,
  CreateCourseRequestSchema,
  UpdateCourseRequestSchema,
  GenerateCourseRequestSchema,
  CreateChapterRequestSchema,
  UpdateChapterRequestSchema,
  CreateAssessmentRequestSchema,
  UpdateAssessmentRequestSchema,
  CreateQuestionRequestSchema,
  UpdateQuestionRequestSchema,
  CreateSessionRequestSchema,
  SendMessageRequestSchema,
  PaginationQuerySchema,
  PaginatedResponseSchema,
  ErrorResponseSchema,
  SuccessResponseSchema,
} from './types/api';

export {
  WebSocketEventSchema,
  SessionJoinEventSchema,
  SessionLeaveEventSchema,
  SessionStartRecordingEventSchema,
  SessionStopRecordingEventSchema,
  SessionUserMessageEventSchema,
  AudioChunkEventSchema,
  AudioTranscriptPartialEventSchema,
  AudioTranscriptFinalEventSchema,
  AudioResponseStartEventSchema,
  AudioResponseChunkEventSchema,
  AudioResponseEndEventSchema,
  SessionUserJoinedEventSchema,
  SessionUserLeftEventSchema,
  SessionStatusUpdateEventSchema,
  CourseGenerationStartEventSchema,
  CourseGenerationProgressEventSchema,
  CourseGenerationCompleteEventSchema,
  NarrationGenerationStartEventSchema,
  NarrationGenerationCompleteEventSchema,
  ErrorEventSchema,
  ConnectionEventSchema,
} from './types/websocket';
