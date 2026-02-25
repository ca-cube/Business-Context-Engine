import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { Task, MarketSignal } from '../engine/types';

export const ImpactAgentSchema = z.object({
    adjustedTasks: z.array(z.object({
        taskId: z.string(),
        newImpactProbability: z.number(),
        re_prioritizationReason: z.string(),
    })),
    macroScore: z.number().describe('Overall organization alignment score (0-100)'),
});

export async function predictCausalImpact(
    tasks: Task[],
    signals: MarketSignal[]
) {
    const { object } = await generateObject({
        model: google('gemini-1.5-flash'),
        schema: ImpactAgentSchema,
        prompt: `
      You are the "Impact Prediction Agent". Your job is to perform causal reasoning on how market shocks affect current tasks.
      
      CURRENT TASKS:
      ${tasks.map(t => `- [${t.id}] ${t.title}: Current Impact Prob: ${t.impactProbability}`).join('\n')}
      
      MARKET SIGNALS:
      ${signals.map(s => `- [${s.type}] ${s.description} (Severity: ${s.severity})`).join('\n')}
      
      TASK:
      1. Analyze if any market signals "break" the causal link between a task and its goal.
      2. If a signal makes a task more or less relevant, provide a 'newImpactProbability'.
      3. For each adjustment, provide a 're-prioritizationReason'.
      4. Calculate an overall 'macroScore' for the organization's current strategic posture.
    `,
    });

    return object;
}
