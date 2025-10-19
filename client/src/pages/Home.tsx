import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_LOGO, APP_TITLE, getLoginUrl } from '@/const';
import { useLocation } from 'wouter';
import { MessageSquare, Sparkles, BarChart3 } from 'lucide-react';

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
            <h1 className="text-xl font-bold">{APP_TITLE}</h1>
          </div>
          <div>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.name || user?.email}
                </span>
                <Button onClick={() => navigate('/admin')}>Dashboard</Button>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={() => (window.location.href = getLoginUrl())}>
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            AI-Powered Interview Bot
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create intelligent interviews that adapt to responses in real-time.
            Perfect for market research, customer feedback, and more.
          </p>
          <div className="mt-8">
            {isAuthenticated ? (
              <Button size="lg" onClick={() => navigate('/admin')}>
                Go to Dashboard
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Get Started
              </Button>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <Sparkles className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Dynamic Questions</CardTitle>
              <CardDescription>
                AI generates follow-up questions based on user responses,
                creating natural, flowing conversations.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Real-Time Monitoring</CardTitle>
              <CardDescription>
                Watch interviews as they happen and see responses in real-time
                from your admin dashboard.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Smart Summaries</CardTitle>
              <CardDescription>
                Automatically extract key insights and structured data from
                interview conversations.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">How It Works</h3>
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Create an Interview</h4>
                    <p className="text-sm text-muted-foreground">
                      Define your interview topic with a custom prompt. The AI will
                      prepare intelligent questions based on your goals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Share the Link</h4>
                    <p className="text-sm text-muted-foreground">
                      Get a unique shareable link for your interview. Send it to
                      participants via email, SMS, or any channel.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Collect Insights</h4>
                    <p className="text-sm text-muted-foreground">
                      Watch responses in real-time and get AI-generated summaries
                      with key insights and structured data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by OpenAI GPT • Built with React & Couchbase</p>
        </div>
      </footer>
    </div>
  );
}

