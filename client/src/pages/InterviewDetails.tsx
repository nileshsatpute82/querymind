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
import { ArrowLeft, RefreshCw } from 'lucide-react';

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
    { enabled: !!interviewId, refetchInterval: 5000 } // Auto-refresh every 5 seconds
  );

  const {
    data: sessionData,
    refetch: refetchSession,
  } = trpc.admin.getSessionMessages.useQuery(
    { sessionId: selectedSessionId || '' },
    { enabled: !!selectedSessionId, refetchInterval: 3000 } // Auto-refresh every 3 seconds
  );

  // Auto-select first session if none selected
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
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  const { interview, sessions } = interviewData;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{interview.title}</h1>
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
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Interview Sessions</CardTitle>
                <CardDescription>
                  {sessions.length} response{sessions.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {sessions.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No responses yet. Share the interview link to get started.
                  </p>
                )}
                {sessions.map((session) => (
                  <Card
                    key={session.id}
                    className={`cursor-pointer transition-colors ${
                      selectedSessionId === session.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedSessionId(session.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          {session.intervieweeInfo?.name || 'Anonymous'}
                        </span>
                        <Badge
                          variant={
                            session.status === 'completed'
                              ? 'default'
                              : session.status === 'in_progress'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {session.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.startedAt).toLocaleString()}
                      </p>
                      {session.intervieweeInfo?.email && (
                        <p className="text-xs text-muted-foreground">
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
                <Card>
                  <CardHeader>
                    <CardTitle>Conversation</CardTitle>
                    <CardDescription>
                      Question {sessionData.session.currentQuestionNumber} of{' '}
                      {interview.questionLimit}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sessionData.messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === 'bot' ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === 'bot'
                              ? 'bg-muted'
                              : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">
                              {message.role === 'bot' ? '🤖 Bot' : '👤 User'}
                            </span>
                            {message.questionNumber && (
                              <Badge variant="outline" className="text-xs">
                                Q{message.questionNumber}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <p className="text-xs opacity-70 mt-2">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {sessionData.messages.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No messages yet
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Summary */}
                {sessionData.summary && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Interview Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Summary</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {sessionData.summary.summary}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Key Insights</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {sessionData.summary.keyInsights.map((insight, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {sessionData.summary.structuredData &&
                        Object.keys(sessionData.summary.structuredData).length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-medium mb-2">Structured Data</h4>
                              <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
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
              <Card>
                <CardContent className="p-12 text-center">
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

