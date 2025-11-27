'use server';
/**
 * @fileOverview Recommends the next best topic to learn based on user performance.
 *
 * - recommendNextBestTopic - A function that recommends the next best topic to learn.
 * - RecommendNextBestTopicInput - The input type for the recommendNextBestTopic function.
 * - RecommendNextBestTopicOutput - The return type for the recommendNextBestTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendNextBestTopicInputSchema = z.object({
  problemCategories: z
    .array(z.string())
    .describe('The different coding problem categories.'),
  userPerformance: z
    .record(z.string(), z.number())
    .describe(
      'A map of problem categories to user performance (a number between 0 and 1, where 1 is perfect performance)'
    ),
});
export type RecommendNextBestTopicInput = z.infer<
  typeof RecommendNextBestTopicInputSchema
>;

const RecommendNextBestTopicOutputSchema = z.object({
  recommendedTopic: z.string().describe('The next best topic to learn.'),
  reason: z.string().describe('The reason for recommending this topic.'),
});
export type RecommendNextBestTopicOutput = z.infer<
  typeof RecommendNextBestTopicOutputSchema
>;

export async function recommendNextBestTopic(
  input: RecommendNextBestTopicInput
): Promise<RecommendNextBestTopicOutput> {
  return recommendNextBestTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendNextBestTopicPrompt',
  input: {schema: RecommendNextBestTopicInputSchema},
  output: {schema: RecommendNextBestTopicOutputSchema},
  prompt: `You are an AI learning assistant that specializes in recommending the next best coding topic to learn, to help users improve their coding skills.

You will be provided with a list of problem categories and the user's performance on each category.

Problem Categories: {{problemCategories}}
User Performance: {{userPerformance}}

Based on this information, recommend the next best topic to learn and explain why you are recommending this topic.

{{#each problemCategories}}
  {{@key}}: {{@value}}
{{/each}}`,
});

const recommendNextBestTopicFlow = ai.defineFlow(
  {
    name: 'recommendNextBestTopicFlow',
    inputSchema: RecommendNextBestTopicInputSchema,
    outputSchema: RecommendNextBestTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
