'use client';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export function PerformanceChart({ data }: { data: any[] }) {
  const chartConfig = {
    solved: {
      label: 'Solved',
      color: 'hsl(var(--primary))',
    },
    attempted: {
      label: 'Attempted (unsolved)',
      color: 'hsl(var(--muted-foreground))',
    },
  };
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis allowDecimals={false} />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
        <Bar dataKey="solved" stackId="a" fill="var(--color-solved)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="attempted" stackId="a" fill="var(--color-attempted)" radius={[4, 4, 0, 0]}/>
      </BarChart>
    </ChartContainer>
  );
}
