import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { Goal, Employee, Task } from '../engine/types';

export const StrategyAgentSchema = z.object({
    tasks: z.array(z.object({
        title: z.string(),
        description: z.string(),
        ownerId: z.string(),
        effort: z.number().min(0).max(1),
        impactProbability: z.number().min(0).max(1),
        marketAlignment: z.number().min(0).max(1),
    })),
    reasoning: z.string(),
});

export async function decomposeStrategyWithAI(
    goal: Goal,
    employees: Employee[],
    marketContext: string
) {
    const { object } = await generateObject({
        model: google('gemini-1.5-pro'),
        schema: StrategyAgentSchema,
        prompt: `
      You are the "Strategy Decomposition Agent" for the Business Context Engine.
      
      GOAL: ${goal.title} - ${goal.description} (Priority: ${goal.priority})
      MARKET CONTEXT: ${marketContext}
      
      AVAILABLE WORKFORCE:
      ${employees.map(e => `- ${e.name} (${e.role}): Skills [${e.skills.join(', ')}]`).join('\n')}
      
      TASK:
      Decompose this high-level strategic goal into 2-4 concrete, executable tasks. 
      Assign each task to the most suitable employee based on their skills.
      For each task, provide:
      1. title: A concise action-oriented title.
      2. description: How this task contributes to the goal.
      3. effort: Estimated resource load (0.1 to 1.0).
      4. impactProbability: Probability (0-1) that this task will directly move the goal's metric.
      5. marketAlignment: How well this task addresses the current market context.
      
      Also provide a "reasoning" string explaining the strategic rationale for this decomposition.
    `,
    });

    return object;
}
