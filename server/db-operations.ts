import { v4 as uuidv4 } from 'uuid';
import { getCollection, getCluster } from './couchbase';
import {
  UserDocument,
  ConfigDocument,
  InterviewDocument,
  SessionDocument,
  MessageDocument,
  SummaryDocument,
  InsertUser,
  InsertConfig,
  InsertInterview,
  InsertSession,
  InsertMessage,
  InsertSummary,
} from './models';

/**
 * Helper to add timestamps
 */
function withTimestamps<T extends { createdAt?: string; updatedAt?: string }>(
  doc: T
): T & { createdAt: string; updatedAt: string } {
  const now = new Date().toISOString();
  return {
    ...doc,
    createdAt: doc.createdAt || now,
    updatedAt: now,
  };
}

/**
 * User operations
 */
export async function upsertUser(user: InsertUser): Promise<UserDocument> {
  const collection = getCollection();
  const docId = `user::${user.id}`;
  
  try {
    const existing = await collection.get(docId).catch(() => null);
    const doc = withTimestamps({
      ...user,
      createdAt: existing?.content?.createdAt,
    }) as UserDocument;
    
    await collection.upsert(docId, doc);
    return doc;
  } catch (error) {
    console.error('[DB] Failed to upsert user:', error);
    throw error;
  }
}

export async function getUser(userId: string): Promise<UserDocument | null> {
  const collection = getCollection();
  const docId = `user::${userId}`;
  
  try {
    const result = await collection.get(docId);
    return result.content as UserDocument;
  } catch (error: any) {
    if (error.name === 'DocumentNotFoundError') {
      return null;
    }
    console.error('[DB] Failed to get user:', error);
    throw error;
  }
}

/**
 * Config operations
 */
export async function upsertConfig(config: InsertConfig): Promise<ConfigDocument> {
  const collection = getCollection();
  const docId = `config::${config.userId}`;
  
  try {
    const existing = await collection.get(docId).catch(() => null);
    const doc = withTimestamps({
      ...config,
      createdAt: existing?.content?.createdAt,
    }) as ConfigDocument;
    
    await collection.upsert(docId, doc);
    return doc;
  } catch (error) {
    console.error('[DB] Failed to upsert config:', error);
    throw error;
  }
}

export async function getConfig(userId: string): Promise<ConfigDocument | null> {
  const collection = getCollection();
  const docId = `config::${userId}`;
  
  try {
    const result = await collection.get(docId);
    return result.content as ConfigDocument;
  } catch (error: any) {
    if (error.name === 'DocumentNotFoundError') {
      return null;
    }
    console.error('[DB] Failed to get config:', error);
    throw error;
  }
}

/**
 * Interview operations
 */
export async function createInterview(interview: InsertInterview): Promise<InterviewDocument> {
  const collection = getCollection();
  const docId = `interview::${interview.id}`;
  
  try {
    const doc = withTimestamps(interview as any) as InterviewDocument;
    await collection.insert(docId, doc);
    return doc;
  } catch (error) {
    console.error('[DB] Failed to create interview:', error);
    throw error;
  }
}

export async function getInterview(interviewId: string): Promise<InterviewDocument | null> {
  const collection = getCollection();
  const docId = `interview::${interviewId}`;
  
  try {
    const result = await collection.get(docId);
    return result.content as InterviewDocument;
  } catch (error: any) {
    if (error.name === 'DocumentNotFoundError') {
      return null;
    }
    console.error('[DB] Failed to get interview:', error);
    throw error;
  }
}

export async function getInterviewByLink(shareableLink: string): Promise<InterviewDocument | null> {
  const cluster = getCluster();
  const bucketName = process.env.COUCHBASE_BUCKET || 'interview-GPT';
  
  try {
    const query = `
      SELECT META().id, \`${bucketName}\`.*
      FROM \`${bucketName}\`
      WHERE type = 'interview' AND shareableLink = $shareableLink
      LIMIT 1
    `;
    
    const result = await cluster.query(query, { parameters: { shareableLink } });
    const rows = result.rows as any[];
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as InterviewDocument;
  } catch (error) {
    console.error('[DB] Failed to get interview by link:', error);
    throw error;
  }
}

export async function listInterviews(userId: string): Promise<InterviewDocument[]> {
  const cluster = getCluster();
  const bucketName = process.env.COUCHBASE_BUCKET || 'interview-GPT';
  
  try {
    const query = `
      SELECT META().id, \`${bucketName}\`.*
      FROM \`${bucketName}\`
      WHERE type = 'interview' AND createdBy = $userId
      ORDER BY createdAt DESC
    `;
    
    const result = await cluster.query(query, { parameters: { userId } });
    return result.rows as InterviewDocument[];
  } catch (error) {
    console.error('[DB] Failed to list interviews:', error);
    throw error;
  }
}

/**
 * Session operations
 */
export async function createSession(session: InsertSession): Promise<SessionDocument> {
  const collection = getCollection();
  const docId = `session::${session.id}`;
  
  try {
    const doc = withTimestamps(session as any) as SessionDocument;
    await collection.insert(docId, doc);
    return doc;
  } catch (error) {
    console.error('[DB] Failed to create session:', error);
    throw error;
  }
}

export async function getSession(sessionId: string): Promise<SessionDocument | null> {
  const collection = getCollection();
  const docId = `session::${sessionId}`;
  
  try {
    const result = await collection.get(docId);
    return result.content as SessionDocument;
  } catch (error: any) {
    if (error.name === 'DocumentNotFoundError') {
      return null;
    }
    console.error('[DB] Failed to get session:', error);
    throw error;
  }
}

export async function updateSession(sessionId: string, updates: Partial<SessionDocument>): Promise<void> {
  const collection = getCollection();
  const docId = `session::${sessionId}`;
  
  try {
    const existing = await collection.get(docId);
    const updated = {
      ...existing.content,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await collection.replace(docId, updated);
  } catch (error) {
    console.error('[DB] Failed to update session:', error);
    throw error;
  }
}

export async function listSessions(interviewId: string): Promise<SessionDocument[]> {
  const cluster = getCluster();
  const bucketName = process.env.COUCHBASE_BUCKET || 'interview-GPT';
  
  try {
    const query = `
      SELECT META().id, \`${bucketName}\`.*
      FROM \`${bucketName}\`
      WHERE type = 'session' AND interviewId = $interviewId
      ORDER BY createdAt DESC
    `;
    
    const result = await cluster.query(query, { parameters: { interviewId } });
    return result.rows as SessionDocument[];
  } catch (error) {
    console.error('[DB] Failed to list sessions:', error);
    throw error;
  }
}

/**
 * Message operations
 */
export async function createMessage(message: InsertMessage): Promise<MessageDocument> {
  const collection = getCollection();
  const docId = `message::${message.id}`;
  
  try {
    const doc = withTimestamps(message as any) as MessageDocument;
    await collection.insert(docId, doc);
    return doc;
  } catch (error) {
    console.error('[DB] Failed to create message:', error);
    throw error;
  }
}

export async function listMessages(sessionId: string): Promise<MessageDocument[]> {
  const cluster = getCluster();
  const bucketName = process.env.COUCHBASE_BUCKET || 'interview-GPT';
  
  try {
    const query = `
      SELECT META().id, \`${bucketName}\`.*
      FROM \`${bucketName}\`
      WHERE type = 'message' AND sessionId = $sessionId
      ORDER BY timestamp ASC
    `;
    
    const result = await cluster.query(query, { parameters: { sessionId } });
    return result.rows as MessageDocument[];
  } catch (error) {
    console.error('[DB] Failed to list messages:', error);
    throw error;
  }
}

/**
 * Summary operations
 */
export async function createSummary(summary: InsertSummary): Promise<SummaryDocument> {
  const collection = getCollection();
  const docId = `summary::${summary.id}`;
  
  try {
    const doc = withTimestamps(summary as any) as SummaryDocument;
    await collection.insert(docId, doc);
    return doc;
  } catch (error) {
    console.error('[DB] Failed to create summary:', error);
    throw error;
  }
}

export async function getSummary(sessionId: string): Promise<SummaryDocument | null> {
  const cluster = getCluster();
  const bucketName = process.env.COUCHBASE_BUCKET || 'interview-GPT';
  
  try {
    const query = `
      SELECT META().id, \`${bucketName}\`.*
      FROM \`${bucketName}\`
      WHERE type = 'summary' AND sessionId = $sessionId
      LIMIT 1
    `;
    
    const result = await cluster.query(query, { parameters: { sessionId } });
    const rows = result.rows as any[];
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0] as SummaryDocument;
  } catch (error) {
    console.error('[DB] Failed to get summary:', error);
    throw error;
  }
}

