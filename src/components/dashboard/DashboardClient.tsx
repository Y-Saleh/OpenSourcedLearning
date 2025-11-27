'use client';
import { useState, useEffect } from 'react';
import type { Submission } from '@/types';
import { getAllSubmissions } from '@/lib/idb';
import { problems, problemCategories } from '@/lib/problems';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PerformanceChart } from './PerformanceChart';
import { Button } from '@/components/ui/button';
import { recommendNextBestTopic } from '@/ai/flows/recommend-next-best-topic';
import { Loader2, Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type PerformanceStats = Record<string, { solved: number; attempted: number }>;

export default function DashboardClient() {
  const [stats, setStats] = useState<PerformanceStats>({});
  const [loading, setLoading] = useState(true);
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendation, setRecommendation] = useState<{ topic: string; reason: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchStats() {
      try {
        const submissions = await getAllSubmissions();
        const performance: PerformanceStats = problemCategories.reduce((acc, category) => {
          acc[category] = { solved: 0, attempted: 0 };
          return acc;
        }, {} as PerformanceStats);

        const problemsInCategory = (category: string) =>
          problems.filter((p) => p.category === category).map((p) => p.slug);

        for (const category of problemCategories) {
          const categoryProblems = problemsInCategory(category);
          const categorySubmissions = submissions.filter((s) => categoryProblems.includes(s.problemSlug));
          
          const attemptedSlugs = new Set(categorySubmissions.map(s => s.problemSlug));
          const solvedSlugs = new Set(categorySubmissions.filter(s => s.isSuccess).map(s => s.problemSlug));

          performance[category] = {
            solved: solvedSlugs.size,
            attempted: attemptedSlugs.size,
          };
        }

        setStats(performance);
      } catch (e) {
        console.error("Failed to load dashboard stats", e);
        toast({
          title: 'Error',
          description: 'Could not load your progress data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [toast]);

  const handleGetRecommendation = async () => {
    setIsRecommending(true);
    setRecommendation(null);
    try {
      const userPerformance = Object.entries(stats).reduce((acc, [category, data]) => {
        acc[category] = data.attempted > 0 ? data.solved / data.attempted : 0;
        return acc;
      }, {} as Record<string, number>);

      const res = await recommendNextBestTopic({
        problemCategories,
        userPerformance,
      });

      setRecommendation({ topic: res.recommendedTopic, reason: res.reason });
    } catch (error) {
      console.error('AI recommendation failed:', error);
      toast({
        title: 'AI Error',
        description: 'Could not generate a recommendation at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsRecommending(false);
    }
  };

  const chartData = Object.entries(stats).map(([category, data]) => ({
    name: category,
    solved: data.solved,
    attempted: data.attempted - data.solved,
  }));

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
             <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-64">
             <Skeleton className="h-10 w-48" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            Performance across different problem categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PerformanceChart data={chartData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personalized Learning</CardTitle>
          <CardDescription>
            Get an AI-powered recommendation for the next topic to focus on.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full pt-8">
          {recommendation ? (
             <div className="text-center p-4 bg-background rounded-lg animate-in fade-in-50">
              <Lightbulb className="mx-auto h-10 w-10 text-yellow-400 mb-4" />
              <h3 className="font-semibold text-lg">Next Topic: {recommendation.topic}</h3>
              <p className="text-muted-foreground mt-2">{recommendation.reason}</p>
               <Button onClick={handleGetRecommendation} disabled={isRecommending} className="mt-6">
                 {isRecommending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 Get Another Recommendation
               </Button>
            </div>
          ) : (
             <Button onClick={handleGetRecommendation} disabled={isRecommending} size="lg">
              {isRecommending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : <Lightbulb className="mr-2 h-4 w-4" />}
              Recommend Next Topic
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
