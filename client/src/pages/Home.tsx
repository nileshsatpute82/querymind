import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_LOGO, APP_TITLE, getLoginUrl } from '@/const';
import { useLocation } from 'wouter';
import { Brain, Sparkles, BarChart3, Zap, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <Brain className="h-12 w-12 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                QueryMind
              </h1>
              <p className="text-[10px] text-muted-foreground -mt-1">
                AI-powered interviews
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm font-medium">{user?.name || user?.email}</span>
                </div>
                <Button 
                  onClick={() => navigate('/admin')}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container">
        <div className="py-20 md:py-28 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>AI that thinks and asks the right questions</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Transform Your
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Interview Process
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Create intelligent interviews that adapt in real-time. Perfect for market research, 
            customer feedback, HR screening, and any industry that needs smart conversations.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <Button 
                size="lg" 
                onClick={() => navigate('/admin')}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg h-14 px-8"
              >
                <Brain className="mr-2 h-5 w-5" />
                Go to Dashboard
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg h-14 px-8"
              >
                <Zap className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
            )}
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg h-14 px-8 border-2"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pb-20">
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                10x
              </div>
              <p className="text-sm text-muted-foreground mt-2">Faster insights</p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                95%
              </div>
              <p className="text-sm text-muted-foreground mt-2">Response quality</p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                24/7
              </div>
              <p className="text-sm text-muted-foreground mt-2">Automated interviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="py-20 space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold">
              Everything you need for
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                intelligent interviews
              </span>
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powered by advanced AI, designed for any industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 hover:shadow-xl transition-all group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Dynamic Questions</CardTitle>
                <CardDescription className="text-base">
                  AI analyzes responses and generates contextual follow-up questions, 
                  creating natural, flowing conversations that dig deeper.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Real-Time Monitoring</CardTitle>
                <CardDescription className="text-base">
                  Watch interviews as they happen. See responses instantly and 
                  gain insights without waiting for completion.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Smart Summaries</CardTitle>
                <CardDescription className="text-base">
                  Automatically extract key insights, patterns, and structured data 
                  from every conversation with AI-powered analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Any Industry</CardTitle>
                <CardDescription className="text-base">
                  From HR to market research, customer feedback to product discovery. 
                  One platform for all your interview needs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Shareable Links</CardTitle>
                <CardDescription className="text-base">
                  Generate unique interview links. No login required for participants. 
                  Share via email, SMS, or any channel.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Custom Prompts</CardTitle>
                <CardDescription className="text-base">
                  Define exactly what you want to learn. The AI adapts its questioning 
                  strategy to match your specific goals.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20">
          <Card className="border-2 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
            <CardContent className="p-12 text-center space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold">
                Ready to transform your interviews?
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join teams using QueryMind to conduct smarter, faster, and more insightful interviews.
              </p>
              {!isAuthenticated && (
                <Button
                  size="lg"
                  onClick={() => (window.location.href = getLoginUrl())}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg h-14 px-8"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Get Started Free
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur">
        <div className="container py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold">QueryMind</span>
          </div>
          <p className="text-sm text-muted-foreground">
            AI that thinks and asks the right questions
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Powered by OpenAI GPT • Built with React & Couchbase
          </p>
        </div>
      </footer>
    </div>
  );
}

