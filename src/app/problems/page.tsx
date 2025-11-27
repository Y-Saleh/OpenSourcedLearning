import { problems } from '@/lib/problems';
import ProblemListClient from '@/components/problems/ProblemListClient';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function ProblemsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Coding Problems</CardTitle>
        <CardDescription>
          Select a problem to start coding. Your progress is saved locally.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProblemListClient allProblems={problems} />
      </CardContent>
    </Card>
  );
}
