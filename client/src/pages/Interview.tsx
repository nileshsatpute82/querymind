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
import { Loader2, Send, CheckCircle2 } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading interview...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Interview Not Found</CardTitle>
            <CardDescription>
              This interview link is invalid or no longer active.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (state === 'info') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{interviewInfo?.title}</CardTitle>
            <CardDescription>
              This interview will ask you approximately {totalQuestions} questions.
              Your responses will help us understand your preferences better.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name (Optional)</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={intervieweeInfo.name}
                onChange={(e) =>
                  setIntervieweeInfo({ ...intervieweeInfo, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={intervieweeInfo.email}
                onChange={(e) =>
                  setIntervieweeInfo({ ...intervieweeInfo, email: e.target.value })
                }
              />
            </div>
            <Button
              className="w-full"
              onClick={handleStart}
              disabled={startSession.isPending}
            >
              {startSession.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                'Start Interview'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Interview Complete!</CardTitle>
            <CardDescription>
              Thank you for taking the time to complete this interview.
            </CardDescription>
          </CardHeader>
          {summaryData?.summary && (
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {summaryData.summary.summary}
                </p>
              </div>
              {summaryData.summary.keyInsights.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Key Points</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {summaryData.summary.keyInsights.map((insight, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {insight}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container max-w-3xl mx-auto py-8 space-y-6">
        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  Question {questionNumber} of {totalQuestions}
                </span>
                <span className="text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Question {questionNumber}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-6">{currentQuestion}</p>
            <div className="space-y-4">
              <Textarea
                placeholder="Type your answer here..."
                rows={6}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                disabled={submitAnswer.isPending}
              />
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={handleSubmitAnswer}
                  disabled={submitAnswer.isPending || !currentAnswer.trim()}
                >
                  {submitAnswer.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Answer
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
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
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Take your time to provide thoughtful answers. You can complete the
              interview early if you feel you've shared everything.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

