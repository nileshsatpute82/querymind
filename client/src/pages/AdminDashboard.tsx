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
import { toast } from 'sonner';
import { Settings, Plus, ExternalLink, Users, MessageSquare } from 'lucide-react';

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

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Interview Bot Dashboard</h1>
            <p className="text-muted-foreground">
              Create and manage AI-powered interviews
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfigDialog(true)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button
              onClick={() => setShowCreateDialog(true)}
              disabled={!config?.hasApiKey}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Interview
            </Button>
          </div>
        </div>

        {/* API Key Warning */}
        {!config?.hasApiKey && (
          <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <CardHeader>
              <CardTitle>OpenAI API Key Required</CardTitle>
              <CardDescription>
                Please configure your OpenAI API key to start creating interviews.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowConfigDialog(true)}>
                Configure API Key
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Interviews List */}
        <div className="grid gap-4">
          {interviews?.map((interview) => (
            <Card key={interview.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{interview.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {interview.prompt}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/interview/${interview.id}`)}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    View Responses
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      <MessageSquare className="inline mr-1 h-4 w-4" />
                      {interview.questionLimit} questions
                    </span>
                    <span>
                      Status: {interview.status === 'active' ? '🟢 Active' : '⚫ Archived'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyShareableLink(`/interview/${interview.shareableLink}`)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {interviews?.length === 0 && config?.hasApiKey && (
            <Card>
              <CardHeader>
                <CardTitle>No interviews yet</CardTitle>
                <CardDescription>
                  Create your first interview to get started.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>

        {/* Config Dialog */}
        <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>OpenAI Configuration</DialogTitle>
              <DialogDescription>
                Enter your OpenAI API key to enable AI-powered interviews.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">OpenAI API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Get your API key from{' '}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
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
              <Button onClick={handleSaveConfig} disabled={saveConfig.isPending}>
                {saveConfig.isPending ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Interview Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Interview</DialogTitle>
              <DialogDescription>
                Define the interview topic and let AI generate dynamic questions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Interview Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Vacation Planning Interview"
                  value={newInterview.title}
                  onChange={(e) =>
                    setNewInterview({ ...newInterview, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt">Interview Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., Interview a person for 15 minutes about their next vacation plan. Understand where they want to go, what kind of food they like, what activities they enjoy, their budget, and travel preferences."
                  rows={5}
                  value={newInterview.prompt}
                  onChange={(e) =>
                    setNewInterview({ ...newInterview, prompt: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Describe what you want to learn from the interview. The AI will
                  generate questions based on this prompt.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="questionLimit">Number of Questions</Label>
                <Select
                  value={newInterview.questionLimit.toString()}
                  onValueChange={(value) =>
                    setNewInterview({
                      ...newInterview,
                      questionLimit: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
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

