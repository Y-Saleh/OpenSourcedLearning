import { problems } from '@/lib/problems';
import { notFound } from 'next/navigation';
import CodeRunner from '@/components/problems/CodeRunner';

export function generateStaticParams() {
  return problems.map((problem) => ({
    slug: problem.slug,
  }));
}

export default function ProblemPage({ params }: { params: { slug: string } }) {
  const problem = problems.find((p) => p.slug === params.slug);

  if (!problem) {
    notFound();
  }

  return <CodeRunner problem={problem} />;
}
