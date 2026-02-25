import { NextResponse } from 'next/server';
import { decomposeStrategyWithAI } from '@/lib/agents/StrategyAgent';

export async function POST(req: Request) {
    try {
        const { goal, employees, marketContext } = await req.json();

        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
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
