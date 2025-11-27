'use server';

/**
 * @fileOverview An AI agent that suggests an optimal solution to a coding problem after multiple failed attempts.
 *
 * - suggestOptimalSolution - A function that suggests an optimal solution for a given problem.
 * - SuggestOptimalSolutionInput - The input type for the suggestOptimalSolution function.
 * - SuggestOptimalSolutionOutput - The return type for the suggestOptimalSolution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalSolutionInputSchema = z.object({
  problemDescription: z
    .string()
    .describe('The description of the coding problem.'),
  failedAttempts: z
    .array(z.string())
    .describe('The list of failed code submissions.'),
});
export type SuggestOptimalSolutionInput = z.infer<
  typeof SuggestOptimalSolutionInputSchema
>;

const SuggestOptimalSolutionOutputSchema = z.object({
  optimalSolution: z
    .string()
    .describe('The suggested optimal solution for the problem.'),
  explanation: z
    .string()
    .describe('The explanation of the optimal solution.'),
});
export type SuggestOptimalSolutionOutput = z.infer<
  typeof SuggestOptimalSolutionOutputSchema
>;

export async function suggestOptimalSolution(
  input: SuggestOptimalSolutionInput
): Promise<SuggestOptimalSolutionOutput> {
  return suggestOptimalSolutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalSolutionPrompt',
  input: {schema: SuggestOptimalSolutionInputSchema},
  output: {schema: SuggestOptimalSolutionOutputSchema},
  prompt: `You are an expert coding tutor. A student has been struggling with the following problem:

Problem Description: {{{problemDescription}}}

They have made the following failed attempts:

{{#each failedAttempts}}
Attempt:
{{this}}
{{/each}}

Suggest an optimal solution to the problem, and explain why it is optimal.

Optimal Solution:
Explanation:`,
});

const suggestOptimalSolutionFlow = ai.defineFlow(
  {
    name: 'suggestOptimalSolutionFlow',
    inputSchema: SuggestOptimalSolutionInputSchema,
    outputSchema: SuggestOptimalSolutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
