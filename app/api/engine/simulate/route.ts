import { NextResponse } from 'next/server';
import { predictCausalImpact } from '@/lib/agents/ImpactAgent';

export async function POST(req: Request) {
    try {
        const { tasks, signals } = await req.json();

        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
        }

        const impact = await predictCausalImpact(tasks, signals);

        return NextResponse.json(impact);
    } catch (error: any) {
        console.error('Simulation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
