import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, TrendingUp, Award, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TypingResult {
  id: string;
  wpm: number;
  accuracy: number;
  time_taken: number;
  difficulty: string;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<TypingResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchResults();
  }, [user, navigate]);

  const fetchResults = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('typing_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching results:', error);
    } else {
      setResults(data || []);
    }
    setLoading(false);
  };

  const averageWpm = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + Number(r.wpm), 0) / results.length)
    : 0;

  const averageAccuracy = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + Number(r.accuracy), 0) / results.length)
    : 0;

  const bestWpm = results.length > 0
    ? Math.max(...results.map(r => Number(r.wpm)))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Your Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Track your typing progress over time</p>
          </div>
          <Button onClick={() => navigate('/test')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Test
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-elevated border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Speed</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{averageWpm}</div>
              <p className="text-xs text-muted-foreground">words per minute</p>
            </CardContent>
          </Card>

          <Card className="shadow-elevated border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Speed</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{bestWpm}</div>
              <p className="text-xs text-muted-foreground">personal record</p>
            </CardContent>
          </Card>

          <Card className="shadow-elevated border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{averageAccuracy}%</div>
              <p className="text-xs text-muted-foreground">accuracy rate</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>Test History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading results...</p>
            ) : results.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <p className="text-muted-foreground">No results yet. Take your first test!</p>
                <Button onClick={() => navigate('/test')}>Start Test</Button>
              </div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Speed (WPM)</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>
                          {format(new Date(result.created_at), 'MMM d, yyyy HH:mm')}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${result.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              result.difficulty === 'medium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'}`}>
                            {result.difficulty.charAt(0).toUpperCase() + result.difficulty.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-primary">
                          {result.wpm} WPM
                        </TableCell>
                        <TableCell>{result.accuracy}%</TableCell>
                        <TableCell>{result.time_taken}s</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
