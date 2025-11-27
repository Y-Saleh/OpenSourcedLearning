'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle } from 'lucide-react';
import type { Problem } from '@/types';
import { getAllSubmissions } from '@/lib/idb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function ProblemListClient({
  allProblems,
}: {
  allProblems: Problem[];
}) {
  const [solvedSlugs, setSolvedSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const submissions = await getAllSubmissions();
        const solved = new Set(
          submissions
            .filter((s) => s.isSuccess)
            .map((s) => s.problemSlug)
        );
        setSolvedSlugs(solved);
      } catch (error) {
        console.error('Failed to load submissions:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, []);

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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Status</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Difficulty</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allProblems.map((problem) => (
          <TableRow key={problem.slug}>
            <TableCell>
              {solvedSlugs.has(problem.slug) ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </TableCell>
            <TableCell>
              <Link
                href={`/problems/${problem.slug}`}
                className="font-medium text-primary hover:underline"
              >
                {problem.title}
              </Link>
            </TableCell>
            <TableCell>{problem.category}</TableCell>
            <TableCell>
              <Badge variant="outline" className={cn('border', getDifficultyClass(problem.difficulty))}>
                {problem.difficulty}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
