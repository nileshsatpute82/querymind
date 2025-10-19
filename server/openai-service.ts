/**
 * OpenAI service for generating interview questions and summaries
 */

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenAIService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generate initial interview questions based on prompt
   */
  async generateInitialQuestions(prompt: string, questionLimit: number): Promise<string[]> {
    const systemMessage = `You are an expert interviewer. Based on the given interview prompt, generate ${questionLimit} thoughtful, open-ended questions that will help gather comprehensive information about the topic. Return ONLY a JSON array of questions, nothing else.`;

    const userMessage = `Interview prompt: "${prompt}"\n\nGenerate ${questionLimit} questions to ask during this interview. Return as a JSON array of strings.`;

    try {
      const response = await this.callChatCompletion([
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ]);

      // Parse the response as JSON array
      const questions = JSON.parse(response);
      
      if (Array.isArray(questions)) {
        return questions.slice(0, questionLimit);
      }
      
      throw new Error('Invalid response format from OpenAI');
    } catch (error) {
      console.error('[OpenAI] Failed to generate initial questions:', error);
      throw error;
    }
  }

  /**
   * Generate next question based on conversation history
   */
  async generateNextQuestion(
    interviewPrompt: string,
    conversationHistory: Array<{ role: 'bot' | 'user'; content: string }>,
    questionNumber: number,
    totalQuestions: number
  ): Promise<string> {
    const systemMessage = `You are an expert interviewer conducting an interview based on this prompt: "${interviewPrompt}". 

You are currently on question ${questionNumber} of ${totalQuestions}. Based on the conversation so far, generate the next question that:
1. Follows naturally from the previous answers
2. Digs deeper into interesting points mentioned by the interviewee
3. Helps achieve the interview goals
4. Is open-ended and encourages detailed responses

Return ONLY the question text, nothing else.`;

    const conversationText = conversationHistory
      .map((msg) => `${msg.role === 'bot' ? 'Interviewer' : 'Interviewee'}: ${msg.content}`)
      .join('\n\n');

    const userMessage = `Conversation so far:\n\n${conversationText}\n\nGenerate the next question (${questionNumber} of ${totalQuestions}):`;

    try {
      const response = await this.callChatCompletion([
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ]);

      return response.trim();
    } catch (error) {
      console.error('[OpenAI] Failed to generate next question:', error);
      throw error;
    }
  }

  /**
   * Generate summary from interview conversation
   */
  async generateSummary(
    interviewPrompt: string,
    conversationHistory: Array<{ role: 'bot' | 'user'; content: string }>
  ): Promise<{
    summary: string;
    keyInsights: string[];
    structuredData: Record<string, any>;
  }> {
    const systemMessage = `You are analyzing an interview that was conducted based on this prompt: "${interviewPrompt}".

Analyze the conversation and provide:
1. A comprehensive summary of the interview (2-3 paragraphs)
2. Key insights extracted (5-10 bullet points)
3. Structured data extracted from the conversation (as a JSON object with relevant fields)

Return your response as a JSON object with this structure:
{
  "summary": "...",
  "keyInsights": ["...", "..."],
  "structuredData": { ... }
}`;

    const conversationText = conversationHistory
      .map((msg) => `${msg.role === 'bot' ? 'Interviewer' : 'Interviewee'}: ${msg.content}`)
      .join('\n\n');

    const userMessage = `Analyze this interview conversation:\n\n${conversationText}\n\nProvide the summary, key insights, and structured data as specified.`;

    try {
      const response = await this.callChatCompletion([
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ]);

      const result = JSON.parse(response);
      
      return {
        summary: result.summary || '',
        keyInsights: result.keyInsights || [],
        structuredData: result.structuredData || {},
      };
    } catch (error) {
      console.error('[OpenAI] Failed to generate summary:', error);
      throw error;
    }
  }

  /**
   * Call OpenAI Chat Completion API
   */
  private async callChatCompletion(messages: OpenAIMessage[]): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from OpenAI');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('[OpenAI] API call failed:', error);
      throw error;
    }
  }
}

