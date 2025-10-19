import { useState } from 'react';
import { useLocation } from 'wouter';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Settings, Plus, ExternalLink, Users, MessageSquare, Brain, Sparkles, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [newInterview, setNewInterview] = useState({
    title: '',
    prompt: '',
    questionLimit: 10,
  });

  const { data: config, refetch: refetchConfig } = trpc.admin.getConfig.useQuery();
  const { data: interviews, refetch: refetchInterviews } = trpc.admin.listInterviews.useQuery();
  
  const saveConfig = trpc.admin.saveConfig.useMutation({
    onSuccess: () => {
      toast.success('API key saved successfully');
      setShowConfigDialog(false);
      setApiKey('');
      refetchConfig();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createInterview = trpc.admin.createInterview.useMutation({
    onSuccess: (data) => {
      toast.success('Interview created successfully');
      setShowCreateDialog(false);
      setNewInterview({ title: '', prompt: '', questionLimit: 10 });
      refetchInterviews();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSaveConfig = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }
    saveConfig.mutate({ openaiApiKey: apiKey });
  };

  const handleCreateInterview = () => {
    if (!newInterview.title.trim() || !newInterview.prompt.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    createInterview.mutate(newInterview);
  };

  const copyShareableLink = (link: string) => {
    const fullUrl = `${window.location.origin}${link}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link copied to clipboard');
  };

  const showCouchbaseError = config && 'error' in config && !!config.error;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">QueryMind Dashboard</h1>
                <p className="text-muted-foreground">
                  Create and manage AI-powered interviews
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowConfigDialog(true)}
              className="border-2"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button
              size="lg"
              onClick={() => setShowCreateDialog(true)}
              disabled={!config?.hasApiKey || showCouchbaseError}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Interview
            </Button>
          </div>
        </div>

        {/* Couchbase Error */}
        {showCouchbaseError && (
          <Alert variant="destructive" className="border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">Database Not Connected</AlertTitle>
            <AlertDescription className="text-base">
              {config.error} Please configure your Couchbase credentials in the environment variables.
            </AlertDescription>
          </Alert>
        )}

        {/* API Key Warning */}
        {!config?.hasApiKey && !showCouchbaseError && (
          <Alert className="border-2 border-primary/50 bg-primary/5">
            <Sparkles className="h-5 w-5 text-primary" />
            <AlertTitle className="text-lg font-semibold">OpenAI API Key Required</AlertTitle>
            <AlertDescription className="text-base">
              Configure your OpenAI API key to start creating intelligent interviews.
              <Button 
                onClick={() => setShowConfigDialog(true)} 
                className="mt-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Configure API Key
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Interviews Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Interviews</h2>
            {interviews && interviews.length > 0 && (
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {interviews.length} {interviews.length === 1 ? 'interview' : 'interviews'}
              </Badge>
            )}
          </div>

          <div className="grid gap-4">
            {interviews?.map((interview) => (
              <Card key={interview.id} className="border-2 hover:shadow-lg transition-all group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {interview.title}
                        </CardTitle>
                        <Badge 
                          variant={interview.status === 'active' ? 'default' : 'secondary'}
                          className={interview.status === 'active' ? 'bg-accent' : ''}
                        >
                          {interview.status === 'active' ? '🟢 Active' : '⚫ Archived'}
                        </Badge>
                      </div>
                      <CardDescription className="text-base line-clamp-2">
                        {interview.prompt}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/interview/${interview.id}`)}
                      className="ml-4 border-2"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      View Responses
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">{interview.questionLimit} questions</span>
                      </div>
                      <div className="text-xs">
                        Created {new Date(interview.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyShareableLink(`/interview/${interview.shareableLink}`)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {interviews?.length === 0 && config?.hasApiKey && !showCouchbaseError && (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl mb-2">No interviews yet</CardTitle>
                  <CardDescription className="text-base mb-4">
                    Create your first interview to get started with QueryMind
                  </CardDescription>
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Interview
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Config Dialog */}
        <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">OpenAI Configuration</DialogTitle>
              <DialogDescription className="text-base">
                Enter your OpenAI API key to enable AI-powered interviews.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-base">OpenAI API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="h-11"
                />
                <p className="text-sm text-muted-foreground">
                  Get your API key from{' '}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-primary hover:text-primary/80"
                  >
                    platform.openai.com
                  </a>
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfigDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveConfig} 
                disabled={saveConfig.isPending}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {saveConfig.isPending ? 'Saving...' : 'Save Configuration'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Interview Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Create New Interview</DialogTitle>
              <DialogDescription className="text-base">
                Define your interview topic and let AI generate dynamic questions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base">Interview Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Customer Feedback Survey"
                  value={newInterview.title}
                  onChange={(e) =>
                    setNewInterview({ ...newInterview, title: e.target.value })
                  }
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-base">Interview Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., Interview customers about their experience with our product. Ask about what features they use most, what problems they face, and what improvements they'd like to see."
                  rows={5}
                  value={newInterview.prompt}
                  onChange={(e) =>
                    setNewInterview({ ...newInterview, prompt: e.target.value })
                  }
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  Describe what you want to learn. The AI will generate contextual questions based on this prompt.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="questionLimit" className="text-base">Number of Questions</Label>
                <Select
                  value={newInterview.questionLimit.toString()}
                  onValueChange={(value) =>
                    setNewInterview({
                      ...newInterview,
                      questionLimit: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 questions</SelectItem>
                    <SelectItem value="10">10 questions</SelectItem>
                    <SelectItem value="15">15 questions</SelectItem>
                    <SelectItem value="20">20 questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateInterview}
                disabled={createInterview.isPending}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {createInterview.isPending ? 'Creating...' : 'Create Interview'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

