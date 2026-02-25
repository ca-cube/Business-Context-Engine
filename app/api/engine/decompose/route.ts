import { NextResponse } from 'next/server';
import { decomposeStrategyWithAI } from '@/lib/agents/StrategyAgent';

export async function POST(req: Request) {
    try {
        const { goal, employees, marketContext } = await req.json();

        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            console.warn('AI API Key not configured. Using mock decomposition.');
            return NextResponse.json({
                tasks: [
                    {
                        id: `mock-1-${goal.id}`,
                        title: `Analyze ${goal.title} Requirements`,
                        description: `Detailed technical breakdown of ${goal.description}`,
                        ownerId: employees[0].id,
                        goalId: goal.id,
                        effort: 0.4,
                        impactProbability: 0.85,
                        marketAlignment: 0.9,
                        status: 'todo'
                    },
                    {
                        id: `mock-2-${goal.id}`,
                        title: `Prototype execution for ${goal.title}`,
                        description: `MVP implementation considering ${marketContext}`,
                        ownerId: employees[1].id,
                        goalId: goal.id,
                        effort: 0.7,
                        impactProbability: 0.92,
                        marketAlignment: 0.8,
                        status: 'todo'
                    }
                ],
                reasoning: "Strategic priority alignment based on workforce capability matrix (Mock)."
            });
        }

        const { tasks, reasoning } = await decomposeStrategyWithAI(goal, employees, marketContext);

        // Add unique IDs to the generated tasks
        const tasksWithIds = tasks.map((t, i) => ({
            ...t,
            id: `ai-task-${goal.id}-${Date.now()}-${i}`,
            goalId: goal.id,
            status: 'todo'
        }));

        return NextResponse.json({ tasks: tasksWithIds, reasoning });
    } catch (error: any) {
        console.error('Decomposition Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
