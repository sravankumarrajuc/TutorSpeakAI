import { z } from 'zod';

// WebSocket Event Types
export const WebSocketEventSchema = z.object({
  type: z.string(),
  payload: z.any(),
  timestamp: z.number(),
  sessionId: z.string().uuid().optional(),
});

export type WebSocketEvent = z.infer<typeof WebSocketEventSchema>;

// Session Management Events
export const SessionJoinEventSchema = z.object({
  type: z.literal('session:join'),
  payload: z.object({
    sessionId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
});

export const SessionLeaveEventSchema = z.object({
  type: z.literal('session:leave'),
  payload: z.object({
    sessionId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
});

export const SessionStartRecordingEventSchema = z.object({
  type: z.literal('session:start_recording'),
  payload: z.object({
    sessionId: z.string().uuid(),
  }),
});

export const SessionStopRecordingEventSchema = z.object({
  type: z.literal('session:stop_recording'),
  payload: z.object({
    sessionId: z.string().uuid(),
  }),
});

export const SessionUserMessageEventSchema = z.object({
  type: z.literal('session:user_message'),
  payload: z.object({
    sessionId: z.string().uuid(),
    companionId: z.string().uuid(),
    message: z.string(),
    timestamp: z.number(),
  }),
});

// Audio Streaming Events
export const AudioChunkEventSchema = z.object({
  type: z.literal('audio:chunk'),
  payload: z.object({
    sessionId: z.string().uuid(),
    audioData: z.string(), // Base64 encoded audio chunk
    sequence: z.number(),
  }),
});

export const AudioTranscriptPartialEventSchema = z.object({
  type: z.literal('audio:transcript_partial'),
  payload: z.object({
    sessionId: z.string().uuid(),
    text: z.string(),
    confidence: z.number().optional(),
  }),
});

export const AudioTranscriptFinalEventSchema = z.object({
  type: z.literal('audio:transcript_final'),
  payload: z.object({
    sessionId: z.string().uuid(),
    text: z.string(),
    confidence: z.number().optional(),
  }),
});

export const AudioResponseStartEventSchema = z.object({
  type: z.literal('audio:response_start'),
  payload: z.object({
    sessionId: z.string().uuid(),
    messageId: z.string().uuid(),
  }),
});

export const AudioResponseChunkEventSchema = z.object({
  type: z.literal('audio:response_chunk'),
  payload: z.object({
    sessionId: z.string().uuid(),
    messageId: z.string().uuid(),
    chunk: z.string(), // Base64 encoded audio chunk
    sequence: z.number(),
  }),
});

export const AudioResponseEndEventSchema = z.object({
  type: z.literal('audio:response_end'),
  payload: z.object({
    sessionId: z.string().uuid(),
    messageId: z.string().uuid(),
  }),
});

// Real-time Update Events
export const SessionUserJoinedEventSchema = z.object({
  type: z.literal('session:user_joined'),
  payload: z.object({
    sessionId: z.string().uuid(),
    userId: z.string().uuid(),
    userName: z.string(),
  }),
});

export const SessionUserLeftEventSchema = z.object({
  type: z.literal('session:user_left'),
  payload: z.object({
    sessionId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
});

export const SessionStatusUpdateEventSchema = z.object({
  type: z.literal('session:status_update'),
  payload: z.object({
    sessionId: z.string().uuid(),
    status: z.enum(['active', 'completed', 'paused']),
    metadata: z.record(z.any()).optional(),
  }),
});

// Course Generation Events
export const CourseGenerationStartEventSchema = z.object({
  type: z.literal('course:generation_start'),
  payload: z.object({
    courseId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
});

export const CourseGenerationProgressEventSchema = z.object({
  type: z.literal('course:generation_progress'),
  payload: z.object({
    courseId: z.string().uuid(),
    progress: z.number().min(0).max(100),
    currentStep: z.string(),
  }),
});

export const CourseGenerationCompleteEventSchema = z.object({
  type: z.literal('course:generation_complete'),
  payload: z.object({
    courseId: z.string().uuid(),
    success: z.boolean(),
    error: z.string().optional(),
  }),
});

// Narration Generation Events
export const NarrationGenerationStartEventSchema = z.object({
  type: z.literal('narration:generation_start'),
  payload: z.object({
    chapterId: z.string().uuid(),
    courseId: z.string().uuid(),
  }),
});

export const NarrationGenerationCompleteEventSchema = z.object({
  type: z.literal('narration:generation_complete'),
  payload: z.object({
    chapterId: z.string().uuid(),
    success: z.boolean(),
    audioUrl: z.string().url().optional(),
    error: z.string().optional(),
  }),
});

// Error Events
export const ErrorEventSchema = z.object({
  type: z.literal('error'),
  payload: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});

// Connection Events
export const ConnectionEventSchema = z.object({
  type: z.literal('connection'),
  payload: z.object({
    status: z.enum(['connected', 'disconnected', 'reconnecting']),
    userId: z.string().uuid().optional(),
  }),
});

// Type exports
export type SessionJoinEvent = z.infer<typeof SessionJoinEventSchema>;
export type SessionLeaveEvent = z.infer<typeof SessionLeaveEventSchema>;
export type SessionStartRecordingEvent = z.infer<typeof SessionStartRecordingEventSchema>;
export type SessionStopRecordingEvent = z.infer<typeof SessionStopRecordingEventSchema>;
export type SessionUserMessageEvent = z.infer<typeof SessionUserMessageEventSchema>;

export type AudioChunkEvent = z.infer<typeof AudioChunkEventSchema>;
export type AudioTranscriptPartialEvent = z.infer<typeof AudioTranscriptPartialEventSchema>;
export type AudioTranscriptFinalEvent = z.infer<typeof AudioTranscriptFinalEventSchema>;
export type AudioResponseStartEvent = z.infer<typeof AudioResponseStartEventSchema>;
export type AudioResponseChunkEvent = z.infer<typeof AudioResponseChunkEventSchema>;
export type AudioResponseEndEvent = z.infer<typeof AudioResponseEndEventSchema>;

export type SessionUserJoinedEvent = z.infer<typeof SessionUserJoinedEventSchema>;
export type SessionUserLeftEvent = z.infer<typeof SessionUserLeftEventSchema>;
export type SessionStatusUpdateEvent = z.infer<typeof SessionStatusUpdateEventSchema>;

export type CourseGenerationStartEvent = z.infer<typeof CourseGenerationStartEventSchema>;
export type CourseGenerationProgressEvent = z.infer<typeof CourseGenerationProgressEventSchema>;
export type CourseGenerationCompleteEvent = z.infer<typeof CourseGenerationCompleteEventSchema>;

export type NarrationGenerationStartEvent = z.infer<typeof NarrationGenerationStartEventSchema>;
export type NarrationGenerationCompleteEvent = z.infer<typeof NarrationGenerationCompleteEventSchema>;

export type ErrorEvent = z.infer<typeof ErrorEventSchema>;
export type ConnectionEvent = z.infer<typeof ConnectionEventSchema>;

// Union type for all WebSocket events
export type AllWebSocketEvents = 
  | SessionJoinEvent
  | SessionLeaveEvent
  | SessionStartRecordingEvent
  | SessionStopRecordingEvent
  | SessionUserMessageEvent
  | AudioChunkEvent
  | AudioTranscriptPartialEvent
  | AudioTranscriptFinalEvent
  | AudioResponseStartEvent
  | AudioResponseChunkEvent
  | AudioResponseEndEvent
  | SessionUserJoinedEvent
  | SessionUserLeftEvent
  | SessionStatusUpdateEvent
  | CourseGenerationStartEvent
  | CourseGenerationProgressEvent
  | CourseGenerationCompleteEvent
  | NarrationGenerationStartEvent
  | NarrationGenerationCompleteEvent
  | ErrorEvent
  | ConnectionEvent;
