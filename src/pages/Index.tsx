import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Keyboard, Zap, Target, BarChart3, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/test');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center space-y-8 mb-16">
          <div className="flex justify-center">
            <div className="p-6 rounded-3xl bg-gradient-primary shadow-glow animate-pulse-glow">
              <Keyboard className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TypeSpeed
            </h1>
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
              Measure and improve your typing speed with real-time feedback and detailed analytics
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 shadow-glow">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="shadow-elevated border-2 hover:border-primary/50 transition-all">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-2xl bg-gradient-secondary">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Real-time Speed</h3>
              <p className="text-muted-foreground">
                Get instant WPM calculations as you type and see your progress live
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elevated border-2 hover:border-primary/50 transition-all">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-2xl bg-gradient-secondary">
                  <Target className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Accuracy Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your typing accuracy and identify areas for improvement
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elevated border-2 hover:border-primary/50 transition-all">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-2xl bg-gradient-secondary">
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Detailed Analytics</h3>
              <p className="text-muted-foreground">
                View your complete history and track your improvement over time
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-elevated border-2 border-primary/20 bg-gradient-secondary/50">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-3xl font-bold">Ready to test your skills?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create a free account to start testing your typing speed, save your results, and track your progress
            </p>
            <Button size="lg" onClick={() => navigate('/auth')} className="mt-4 shadow-glow">
              Start Typing Test
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
