import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Timer, Zap, Target, BarChart3, LogOut } from 'lucide-react';

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog. Programming requires practice and patience. Success comes to those who persevere.",
  "Technology evolves rapidly in our modern world. Innovation drives progress and creates new opportunities. Learning never stops for the curious mind.",
  "Practice makes perfect in every skill you pursue. Dedication and consistency lead to mastery. Challenge yourself daily to improve.",
  "Typing speed improves with regular training sessions. Focus on accuracy before building speed. Every keystroke counts toward your goal.",
];

const Test = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [text] = useState(() => SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]);
  const [input, setInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && !isFinished && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isStarted, isFinished, startTime]);

  const calculateStats = (currentInput: string) => {
    const timeInMinutes = elapsedTime / 60;
    const wordsTyped = currentInput.trim().split(/\s+/).length;
    const calculatedWpm = timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0;
    
    let correctChars = 0;
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] === text[i]) correctChars++;
    }
    const calculatedAccuracy = currentInput.length > 0
      ? Math.round((correctChars / currentInput.length) * 100)
      : 100;

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);

    return { wpm: calculatedWpm, accuracy: calculatedAccuracy };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (!isStarted) {
      setIsStarted(true);
      setStartTime(Date.now());
    }

    setInput(value);
    calculateStats(value);

    if (value === text) {
      finishTest(value);
    }
  };

  const finishTest = async (finalInput: string) => {
    setIsFinished(true);
    const stats = calculateStats(finalInput);

    if (user) {
      const { error } = await supabase.from('typing_results').insert({
        user_id: user.id,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        time_taken: elapsedTime,
        text_length: text.length,
      });

      if (error) {
        console.error('Error saving result:', error);
        toast.error('Failed to save result');
      } else {
        toast.success('Result saved!');
      }
    }
  };

  const restart = () => {
    setInput('');
    setIsStarted(false);
    setIsFinished(false);
    setStartTime(null);
    setElapsedTime(0);
    setWpm(0);
    setAccuracy(100);
    inputRef.current?.focus();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getCharClass = (index: number) => {
    if (index >= input.length) return 'text-muted-foreground';
    return input[index] === text[index] ? 'text-primary' : 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="max-w-5xl mx-auto space-y-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Typing Speed Test
            </h1>
            <p className="text-muted-foreground mt-1">Test your typing speed and accuracy</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-elevated">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Speed</CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{wpm}</div>
              <p className="text-xs text-muted-foreground">words per minute</p>
            </CardContent>
          </Card>

          <Card className="shadow-elevated">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{accuracy}%</div>
              <Progress value={accuracy} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="shadow-elevated">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time</CardTitle>
              <Timer className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{elapsedTime}s</div>
              <p className="text-xs text-muted-foreground">elapsed time</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-elevated border-2">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="relative p-8 rounded-lg bg-muted/50 font-mono text-lg leading-relaxed">
                {text.split('').map((char, index) => (
                  <span key={index} className={getCharClass(index)}>
                    {char}
                  </span>
                ))}
              </div>

              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                disabled={isFinished}
                placeholder="Start typing here..."
                className="w-full min-h-[150px] p-6 rounded-lg border-2 border-input bg-background font-mono text-lg resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                autoFocus
              />

              <div className="flex gap-3">
                <Button
                  onClick={restart}
                  className="flex-1"
                  size="lg"
                >
                  {isFinished ? 'Try Again' : 'Restart'}
                </Button>
                {isFinished && (
                  <Button
                    onClick={() => navigate('/dashboard')}
                    variant="outline"
                    size="lg"
                  >
                    View Results
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Test;
