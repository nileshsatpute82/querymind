import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, RefreshCw, Clock, CheckCircle, PlayCircle } from 'lucide-react';

export default function InterviewDetails() {
  const [, params] = useRoute('/admin/interview/:id');
  const [, navigate] = useLocation();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const interviewId = params?.id || '';

  const {
    data: interviewData,
    refetch: refetchInterview,
  } = trpc.admin.getInterviewDetails.useQuery(
    { interviewId },
    { enabled: !!interviewId, refetchInterval: 5000 }
  );

  const {
    data: sessionData,
    refetch: refetchSession,
  } = trpc.admin.getSessionMessages.useQuery(
    { sessionId: selectedSessionId || '' },
    { enabled: !!selectedSessionId, refetchInterval: 3000 }
  );

  useEffect(() => {
    if (
      !selectedSessionId &&
      interviewData?.sessions &&
      interviewData.sessions.length > 0
    ) {
      setSelectedSessionId(interviewData.sessions[0].id);
    }
  }, [interviewData, selectedSessionId]);

  if (!interviewData) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { interview, sessions } = interviewData;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case 'in_progress':
        return <PlayCircle className="h-4 w-4 text-primary" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-accent">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-primary">In Progress</Badge>;
      default:
        return <Badge variant="outline">Abandoned</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">{interview.title}</h1>
              <p className="text-muted-foreground">{interview.prompt}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchInterview();
              if (selectedSessionId) {
                refetchSession();
              }
            }}
            className="border-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Interview Sessions</CardTitle>
                  <Badge variant="secondary" className="text-sm">
                    {sessions.length}
                  </Badge>
                </div>
                <CardDescription>
                  {sessions.length} response{sessions.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                {sessions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      No responses yet. Share the interview link to get started.
                    </p>
                  </div>
                )}
                {sessions.map((session) => (
                  <Card
                    key={session.id}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedSessionId === session.id
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'hover:bg-muted/50 hover:border-muted-foreground/20'
                    }`}
                    onClick={() => setSelectedSessionId(session.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">
                          {session.intervieweeInfo?.name || 'Anonymous'}
                        </span>
                        {getStatusIcon(session.status)}
                      </div>
                      {getStatusBadge(session.status)}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(session.startedAt).toLocaleString()}
                      </p>
                      {session.intervieweeInfo?.email && (
                        <p className="text-xs text-muted-foreground truncate">
                          {session.intervieweeInfo.email}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Session Details */}
          <div className="lg:col-span-2 space-y-4">
            {selectedSessionId && sessionData ? (
              <>
                {/* Conversation */}
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Conversation</CardTitle>
                        <CardDescription>
                          Question {sessionData.session.currentQuestionNumber} of{' '}
                          {interview.questionLimit}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {Math.round((sessionData.session.currentQuestionNumber / interview.questionLimit) * 100)}% Complete
                        </div>
                        <div className="w-32 h-2 bg-muted rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                            style={{ width: `${(sessionData.session.currentQuestionNumber / interview.questionLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
                    {sessionData.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === 'bot' ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-4 ${
                            message.role === 'bot'
                              ? 'bg-muted border-2 border-border'
                              : 'bg-gradient-to-r from-primary to-secondary text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold">
                              {message.role === 'bot' ? '🤖 QueryMind' : '👤 User'}
                            </span>
                            {message.questionNumber && (
                              <Badge variant="outline" className="text-xs">
                                Q{message.questionNumber}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </p>
                          <p className={`text-xs mt-2 ${message.role === 'bot' ? 'text-muted-foreground' : 'text-white/70'}`}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {sessionData.messages.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-sm text-muted-foreground">
                          No messages yet
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Summary */}
                {sessionData.summary && (
                  <Card className="border-2 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-accent" />
                        Interview Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-base mb-3">Summary</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {sessionData.summary.summary}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold text-base mb-3">Key Insights</h4>
                        <ul className="space-y-2">
                          {sessionData.summary.keyInsights.map((insight, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span className="text-sm text-muted-foreground flex-1">
                                {insight}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {sessionData.summary.structuredData &&
                        Object.keys(sessionData.summary.structuredData).length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-semibold text-base mb-3">Structured Data</h4>
                              <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-auto border-2">
                                {JSON.stringify(
                                  sessionData.summary.structuredData,
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          </>
                        )}
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="border-2 border-dashed">
                <CardContent className="p-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <PlayCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Select a session to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

