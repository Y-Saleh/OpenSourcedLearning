export type TestCase = {
  input: any[];
  output: any;
};

export type Problem = {
  slug: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  initialCode: string;
  testCases: TestCase[];
};

export type Submission = {
  id?: number;
  problemSlug: string;
  code: string;
  isSuccess: boolean;
  submittedAt: Date;
};

export type TestResult = TestCase & {
  actual: any;
  passed: boolean;
  error?: string;
};
