'use client';

import { useState } from 'react';
import type { Problem, TestResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Lightbulb,
  AlertTriangle,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { addSubmission } from '@/lib/idb';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { suggestOptimalSolution } from '@/ai/flows/suggest-optimal-solution';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const MAX_FAILED_ATTEMPTS = 3;

export default function CodeRunner({ problem }: { problem: Problem }) {
  const [code, setCode] = useState(problem.initialCode);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [failedCode, setFailedCode] = useState<string[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [optimalSolution, setOptimalSolution] = useState('');
  const [solutionExplanation, setSolutionExplanation] = useState('');
  const { toast } = useToast();

  const handleRunCode = async () => {
    setIsLoading(true);
    setResults([]);
    setIsSuccess(false);

    // Artificial delay for animation
    await new Promise((resolve) => setTimeout(resolve, 500));

    const testResults: TestResult[] = [];
    let allPassed = true;

    for (const testCase of problem.testCases) {
      try {
        const runner = new Function(
          '...args',
          `${code}\nreturn solution(...args);`
        );
        const actual = runner(...testCase.input);

        // Simple comparison, might not work for objects/arrays with different order
        const passed = JSON.stringify(actual) === JSON.stringify(testCase.output);
        if (!passed) allPassed = false;

        testResults.push({ ...testCase, actual, passed });
      } catch (error: any) {
        allPassed = false;
        testResults.push({
          ...testCase,
          actual: null,
          passed: false,
          error: error.message,
        });
      }
    }

    setResults(testResults);
    setIsLoading(false);

    if (allPassed) {
      setIsSuccess(true);
      await addSubmission({
        problemSlug: problem.slug,
        code,
        isSuccess: true,
        submittedAt: new Date(),
      });
      toast({
        title: 'Success!',
        description: 'All test cases passed. Your progress has been saved.',
        variant: 'default',
        className: 'bg-accent text-accent-foreground',
      });
      setFailedAttempts(0);
      setFailedCode([]);
    } else {
      await addSubmission({
        problemSlug: problem.slug,
        code,
        isSuccess: false,
        submittedAt: new Date(),
      });

      const newFailedCount = failedAttempts + 1;
      setFailedAttempts(newFailedCount);
      const updatedFailedCode = [...failedCode, code];
      setFailedCode(updatedFailedCode);
      
      toast({
        title: 'Tests Failed',
        description: `Some test cases didn't pass. Keep trying!`,
        variant: 'destructive',
      });

      if (newFailedCount >= MAX_FAILED_ATTEMPTS) {
        setIsLoading(true);
        try {
          const res = await suggestOptimalSolution({
            problemDescription: problem.description,
            failedAttempts: updatedFailedCode,
          });
          setOptimalSolution(res.optimalSolution);
          setSolutionExplanation(res.explanation);
          setShowSolution(true);
        } catch (error) {
          console.error('AI suggestion failed:', error);
          toast({
            title: 'AI Error',
            description: 'Could not get an optimal solution at this time.',
            variant: 'destructive'
          });
        } finally {
          setIsLoading(false);
        }
      }
    }
  };
  
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>{problem.title}</CardTitle>
          <CardDescription className="flex items-center gap-4 pt-2">
            <Badge variant="outline" className={getDifficultyClass(problem.difficulty)}>{problem.difficulty}</Badge>
            <Badge variant="secondary">{problem.category}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{problem.description}</p>
        </CardContent>
      </Card>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Code Editor</CardTitle>
            <CardDescription>
              Write your solution in the editor below. The function must be named 'solution'.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-code text-sm h-80 bg-muted/50 dark:bg-card"
              placeholder="Enter your code here..."
            />
            <Button onClick={handleRunCode} disabled={isLoading} className="mt-4 w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Run Code
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.map((result, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium flex items-center gap-2">
                      {result.passed ? (
                        <CheckCircle2 className="text-green-500" />
                      ) : (
                        <XCircle className="text-red-500" />
                      )}
                      Test Case #{index + 1}
                    </p>
                    <Badge variant={result.passed ? 'default' : 'destructive'} className={result.passed ? 'bg-accent text-accent-foreground' : ''}>
                      {result.passed ? 'Passed' : 'Failed'}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 p-3 bg-muted/50 rounded-md font-code">
                    <p>Input: {JSON.stringify(result.input)}</p>
                    <p>Expected: {JSON.stringify(result.output)}</p>
                    <p>Got: {result.error ? <span className='text-destructive'>{result.error}</span> : JSON.stringify(result.actual)}</p>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex items-center gap-2 font-bold text-lg">
                {isSuccess ? <CheckCircle2 className="text-green-500"/> : <AlertTriangle className="text-destructive"/>}
                <span>
                  {isSuccess ? "All tests passed!" : "Some tests failed."}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Dialog open={showSolution} onOpenChange={setShowSolution}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="text-yellow-400" />
              Stuck? Here's a hint.
            </DialogTitle>
            <DialogDescription>
              After multiple attempts, here's an optimal solution to guide you.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
            <h3 className="font-semibold">Explanation:</h3>
            <p className="text-sm">{solutionExplanation}</p>
            <h3 className="font-semibold">Optimal Solution:</h3>
            <pre className="bg-muted p-4 rounded-md font-code text-sm">
              <code>{optimalSolution}</code>
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
