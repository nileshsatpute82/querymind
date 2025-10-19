import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { publicProcedure, router } from './_core/trpc';
import {
  createInterview,
  getInterview,
  listInterviews,
  createSession,
  getSession,
  updateSession,
  listSessions,
  createMessage,
  listMessages,
  createSummary,
  getSummary,
  upsertConfig,
  getConfig,
  getInterviewByLink,
} from './db-operations';
import { OpenAIService } from './openai-service';
import { TRPCError } from '@trpc/server';

/**
 * Admin router - requires authentication
 */
export const adminRouter = router({
  // Save OpenAI API key
  saveConfig: publicProcedure
    .input(
      z.object({
        openaiApiKey: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const config = await upsertConfig({
        type: 'config',
        id: uuidv4(),
        userId: 'admin',
        openaiApiKey: input.openaiApiKey,
      });

      return { success: true };
    }),

  // Get config
  getConfig: publicProcedure.query(async () => {
    try {
      const config = await getConfig('admin');
      return {
        hasApiKey: !!config?.openaiApiKey,
        couchbaseConnected: true,
      };
    } catch (error: any) {
      if (error.message?.includes('Couchbase not initialized')) {
        return {
          hasApiKey: false,
          couchbaseConnected: false,
          error: 'Couchbase database not configured. Please set up environment variables.',
        };
      }
      throw error;
    }
  }),

  // Create new interview
  createInterview: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        prompt: z.string().min(1),
        questionLimit: z.number().min(1).max(50).default(10),
      })
    )
    .mutation(async ({ input }) => {
      const config = await getConfig('admin');
      
      if (!config?.openaiApiKey) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Please configure your OpenAI API key first',
        });
      }

      const interviewId = uuidv4();
      const shareableLink = `interview-${interviewId.split('-')[0]}`;

      const interview = await createInterview({
        type: 'interview',
        id: interviewId,
        title: input.title,
        prompt: input.prompt,
        questionLimit: input.questionLimit,
        createdBy: 'admin',
        status: 'active',
        shareableLink,
      });

      return {
        interview,
        shareableUrl: `/interview/${shareableLink}`,
      };
    }),

  // List all interviews
  listInterviews: publicProcedure.query(async () => {
    const interviews = await listInterviews('admin');
    return interviews;
  }),

  // Get interview details with sessions
  getInterviewDetails: publicProcedure
    .input(z.object({ interviewId: z.string() }))
    .query(async ({ input }) => {
      const interview = await getInterview(input.interviewId);
      
      if (!interview || interview.createdBy !== 'admin') {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Interview not found',
        });
      }

      const sessions = await listSessions(input.interviewId);

      return {
        interview,
        sessions,
      };
    }),

  // Get session messages (for real-time viewing)
  getSessionMessages: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const session = await getSession(input.sessionId);
      
      if (!session) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Session not found',
        });
      }

      const interview = await getInterview(session.interviewId);
      
      if (!interview || interview.createdBy !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        });
      }

      const messages = await listMessages(input.sessionId);
      const summary = await getSummary(input.sessionId);

      return {
        session,
        messages,
        summary,
      };
    }),
});

/**
 * Interview router - public access for interviewees
 */
export const interviewRouter = router({
  // Get interview by shareable link
  getByLink: publicProcedure
    .input(z.object({ link: z.string() }))
    .query(async ({ input }) => {
      const interview = await getInterviewByLink(input.link);
      
      if (!interview || interview.status !== 'active') {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Interview not found or no longer active',
        });
      }

      return {
        id: interview.id,
        title: interview.title,
        questionLimit: interview.questionLimit,
      };
    }),

  // Start new session
  startSession: publicProcedure
    .input(
      z.object({
        interviewId: z.string(),
        intervieweeInfo: z
          .object({
            name: z.string().optional(),
            email: z.string().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const interview = await getInterview(input.interviewId);
      
      if (!interview || interview.status !== 'active') {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Interview not found',
        });
      }

      const sessionId = uuidv4();
      const session = await createSession({
        type: 'session',
        id: sessionId,
        interviewId: input.interviewId,
        status: 'in_progress',
        currentQuestionNumber: 0,
        startedAt: new Date().toISOString(),
        intervieweeInfo: input.intervieweeInfo,
      });

      // Get admin config to access OpenAI
      const config = await getConfig(interview.createdBy);
      
      if (!config?.openaiApiKey) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Interview configuration error',
        });
      }

      // Generate first question
      const openai = new OpenAIService(config.openaiApiKey);
      const firstQuestion = await openai.generateNextQuestion(
        interview.prompt,
        [],
        1,
        interview.questionLimit
      );

      // Save first question
      await createMessage({
        type: 'message',
        id: uuidv4(),
        sessionId,
        role: 'bot',
        content: firstQuestion,
        questionNumber: 1,
        timestamp: new Date().toISOString(),
      });

      await updateSession(sessionId, { currentQuestionNumber: 1 });

      return {
        sessionId,
        firstQuestion,
      };
    }),

  // Submit answer and get next question
  submitAnswer: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        answer: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const session = await getSession(input.sessionId);
      
      if (!session) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Session not found',
        });
      }

      if (session.status !== 'in_progress') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Session is not active',
        });
      }

      const interview = await getInterview(session.interviewId);
      
      if (!interview) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Interview not found',
        });
      }

      // Save user's answer
      await createMessage({
        type: 'message',
        id: uuidv4(),
        sessionId: input.sessionId,
        role: 'user',
        content: input.answer,
        timestamp: new Date().toISOString(),
      });

      // Check if we've reached the question limit
      if (session.currentQuestionNumber >= interview.questionLimit) {
        // Generate summary
        const config = await getConfig(interview.createdBy);
        
        if (config?.openaiApiKey) {
          const messages = await listMessages(input.sessionId);
          const conversationHistory = messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

          const openai = new OpenAIService(config.openaiApiKey);
          const summaryData = await openai.generateSummary(
            interview.prompt,
            conversationHistory
          );

          await createSummary({
            type: 'summary',
            id: uuidv4(),
            sessionId: input.sessionId,
            interviewId: interview.id,
            summary: summaryData.summary,
            keyInsights: summaryData.keyInsights,
            structuredData: summaryData.structuredData,
          });
        }

        await updateSession(input.sessionId, {
          status: 'completed',
          completedAt: new Date().toISOString(),
        });

        return {
          completed: true,
          nextQuestion: null,
        };
      }

      // Generate next question
      const config = await getConfig(interview.createdBy);
      
      if (!config?.openaiApiKey) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Interview configuration error',
        });
      }

      const messages = await listMessages(input.sessionId);
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const openai = new OpenAIService(config.openaiApiKey);
      const nextQuestionNumber = session.currentQuestionNumber + 1;
      const nextQuestion = await openai.generateNextQuestion(
        interview.prompt,
        conversationHistory,
        nextQuestionNumber,
        interview.questionLimit
      );

      // Save next question
      await createMessage({
        type: 'message',
        id: uuidv4(),
        sessionId: input.sessionId,
        role: 'bot',
        content: nextQuestion,
        questionNumber: nextQuestionNumber,
        timestamp: new Date().toISOString(),
      });

      await updateSession(input.sessionId, {
        currentQuestionNumber: nextQuestionNumber,
      });

      return {
        completed: false,
        nextQuestion,
        questionNumber: nextQuestionNumber,
        totalQuestions: interview.questionLimit,
      };
    }),

  // Complete interview early
  completeEarly: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input }) => {
      const session = await getSession(input.sessionId);
      
      if (!session) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Session not found',
        });
      }

      const interview = await getInterview(session.interviewId);
      
      if (!interview) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Interview not found',
        });
      }

      // Generate summary
      const config = await getConfig(interview.createdBy);
      
      if (config?.openaiApiKey) {
        const messages = await listMessages(input.sessionId);
        const conversationHistory = messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        const openai = new OpenAIService(config.openaiApiKey);
        const summaryData = await openai.generateSummary(
          interview.prompt,
          conversationHistory
        );

        await createSummary({
          type: 'summary',
          id: uuidv4(),
          sessionId: input.sessionId,
          interviewId: interview.id,
          summary: summaryData.summary,
          keyInsights: summaryData.keyInsights,
          structuredData: summaryData.structuredData,
        });
      }

      await updateSession(input.sessionId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });

      return { success: true };
    }),

  // Get session summary
  getSummary: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const session = await getSession(input.sessionId);
      
      if (!session) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Session not found',
        });
      }

      const summary = await getSummary(input.sessionId);
      
      return {
        session,
        summary,
      };
    }),
});

