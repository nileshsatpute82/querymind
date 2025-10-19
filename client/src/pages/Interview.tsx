import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Loader2, Send, CheckCircle2, Brain, Sparkles } from 'lucide-react';

type InterviewState = 'loading' | 'info' | 'interview' | 'completed' | 'error';

export default function Interview() {
  const [, params] = useRoute('/interview/:link');
  const link = params?.link || '';

  const [state, setState] = useState<InterviewState>('loading');
  const [intervieweeInfo, setIntervieweeInfo] = useState({
    name: '',
    email: '',
  });
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const { data: interviewInfo, error: interviewError } =
    trpc.interview.getByLink.useQuery(
      { link },
      { enabled: !!link }
    );

  const startSession = trpc.interview.startSession.useMutation({
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      setCurrentQuestion(data.firstQuestion);
      setQuestionNumber(1);
      setState('interview');
    },
    onError: (error) => {
      toast.error(error.message);
      setState('error');
    },
  });

  const submitAnswer = trpc.interview.submitAnswer.useMutation({
    onSuccess: (data) => {
      setCurrentAnswer('');
      if (data.completed) {
        setState('completed');
      } else {
        setCurrentQuestion(data.nextQuestion || '');
        setQuestionNumber(data.questionNumber || 0);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const completeEarly = trpc.interview.completeEarly.useMutation({
    onSuccess: () => {
      setState('completed');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: summaryData } = trpc.interview.getSummary.useQuery(
    { sessionId: sessionId || '' },
    { enabled: state === 'completed' && !!sessionId }
  );

  useEffect(() => {
    if (interviewInfo) {
      setTotalQuestions(interviewInfo.questionLimit);
      setState('info');
    }
  }, [interviewInfo]);

  useEffect(() => {
    if (interviewError) {
      setState('error');
    }
  }, [interviewError]);

  const handleStart = () => {
    if (!interviewInfo) return;
    startSession.mutate({
      interviewId: interviewInfo.id,
      intervieweeInfo: intervieweeInfo.name || intervieweeInfo.email
        ? intervieweeInfo
        : undefined,
    });
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) {
      toast.error('Please provide an answer');
      return;
    }
    if (!sessionId) return;
    submitAnswer.mutate({
      sessionId,
      answer: currentAnswer,
    });
  };

  const handleCompleteEarly = () => {
    if (!sessionId) return;
    completeEarly.mutate({ sessionId });
  };

  const progress = totalQuestions > 0 ? (questionNumber / totalQuestions) * 100 : 0;

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md border-2">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <p className="text-muted-foreground">Loading interview...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-2">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">❌</span>
            </div>
            <CardTitle className="text-2xl">Interview Not Found</CardTitle>
            <CardDescription className="text-base">
              This interview link is invalid or no longer active.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (state === 'info') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg border-2">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mx-auto mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Powered by QueryMind</span>
            </div>
            <CardTitle className="text-2xl mb-2">{interviewInfo?.title}</CardTitle>
            <CardDescription className="text-base">
              This interview will ask you approximately {totalQuestions} questions.
              Your thoughtful responses will help us understand your perspective better.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">Your Name (Optional)</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={intervieweeInfo.name}
                onChange={(e) =>
                  setIntervieweeInfo({ ...intervieweeInfo, name: e.target.value })
                }
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Your Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={intervieweeInfo.email}
                onChange={(e) =>
                  setIntervieweeInfo({ ...intervieweeInfo, email: e.target.value })
                }
                className="h-11"
              />
            </div>
            <Button
              className="w-full h-12 text-base bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              onClick={handleStart}
              disabled={startSession.isPending}
            >
              {startSession.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Interview
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl border-2">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-12 w-12 text-accent" />
            </div>
            <CardTitle className="text-3xl mb-2">Interview Complete!</CardTitle>
            <CardDescription className="text-base">
              Thank you for taking the time to complete this interview. Your insights are valuable to us.
            </CardDescription>
          </CardHeader>
          {summaryData?.summary && (
            <CardContent className="space-y-6">
              <div className="p-6 rounded-lg bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2">
                <h3 className="font-semibold text-lg mb-3">Summary</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {summaryData.summary.summary}
                </p>
              </div>
              {summaryData.summary.keyInsights.length > 0 && (
                <div className="p-6 rounded-lg bg-muted/50 border-2">
                  <h3 className="font-semibold text-lg mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {summaryData.summary.keyInsights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-sm text-muted-foreground flex-1">
                          {insight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container max-w-3xl mx-auto py-8 space-y-6">
        {/* Progress */}
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold">
                    Question {questionNumber} of {totalQuestions}
                  </span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                {questionNumber}
              </div>
              <CardTitle className="text-xl">Question {questionNumber}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-muted/50 border-2">
              <p className="text-lg leading-relaxed">{currentQuestion}</p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="answer" className="text-base">Your Answer</Label>
              <Textarea
                id="answer"
                placeholder="Type your answer here..."
                rows={6}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                disabled={submitAnswer.isPending}
                className="resize-none text-base"
              />
              <div className="flex gap-3">
                <Button
                  className="flex-1 h-12 text-base bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  onClick={handleSubmitAnswer}
                  disabled={submitAnswer.isPending || !currentAnswer.trim()}
                >
                  {submitAnswer.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Answer
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-2"
                  onClick={handleCompleteEarly}
                  disabled={completeEarly.isPending || submitAnswer.isPending}
                >
                  Complete Early
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-muted-foreground leading-relaxed">
              💡 Take your time to provide thoughtful answers. The AI will adapt follow-up questions 
              based on your responses. You can complete the interview early if you feel you've shared everything.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

