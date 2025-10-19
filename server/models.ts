/**
 * Document types for Couchbase collections
 */

export type DocumentType = 'user' | 'interview' | 'session' | 'message' | 'summary' | 'config';

export interface BaseDocument {
  type: DocumentType;
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User document
 */
export interface UserDocument extends BaseDocument {
  type: 'user';
  name?: string;
  email?: string;
  loginMethod?: string;
  role: 'user' | 'admin';
  lastSignedIn?: string;
}

/**
 * Admin configuration (OpenAI API key, etc.)
 */
export interface ConfigDocument extends BaseDocument {
  type: 'config';
  userId: string; // Admin user ID
  openaiApiKey?: string;
}

/**
 * Interview template created by admin
 */
export interface InterviewDocument extends BaseDocument {
  type: 'interview';
  title: string;
  prompt: string; // The instruction for what to interview about
  questionLimit: number; // Max number of questions (default 10)
  createdBy: string; // Admin user ID
  status: 'active' | 'archived';
  shareableLink: string; // Unique link for interviewees
}

/**
 * Interview session (one interviewee's responses)
 */
export interface SessionDocument extends BaseDocument {
  type: 'session';
  interviewId: string; // Reference to InterviewDocument
  status: 'in_progress' | 'completed' | 'abandoned';
  currentQuestionNumber: number;
  startedAt: string;
  completedAt?: string;
  intervieweeInfo?: {
    name?: string;
    email?: string;
    metadata?: Record<string, any>;
  };
}

/**
 * Individual message in a session (question or answer)
 */
export interface MessageDocument extends BaseDocument {
  type: 'message';
  sessionId: string; // Reference to SessionDocument
  role: 'bot' | 'user';
  content: string;
  questionNumber?: number; // For bot messages
  timestamp: string;
}

/**
 * Final summary of an interview session
 */
export interface SummaryDocument extends BaseDocument {
  type: 'summary';
  sessionId: string; // Reference to SessionDocument
  interviewId: string; // Reference to InterviewDocument
  summary: string; // AI-generated summary
  keyInsights: string[]; // Extracted key points
  structuredData?: Record<string, any>; // Parsed preferences/data
}

/**
 * Insert types (without auto-generated fields)
 */
export type InsertUser = Omit<UserDocument, 'createdAt' | 'updatedAt'>;
export type InsertConfig = Omit<ConfigDocument, 'createdAt' | 'updatedAt'>;
export type InsertInterview = Omit<InterviewDocument, 'createdAt' | 'updatedAt'>;
export type InsertSession = Omit<SessionDocument, 'createdAt' | 'updatedAt'>;
export type InsertMessage = Omit<MessageDocument, 'createdAt' | 'updatedAt'>;
export type InsertSummary = Omit<SummaryDocument, 'createdAt' | 'updatedAt'>;

