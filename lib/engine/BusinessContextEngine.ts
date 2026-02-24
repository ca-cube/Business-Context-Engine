import { Goal, Task, Employee, MarketSignal, SimulationResult } from './types';

export class BusinessContextEngine {
    private goals: Goal[] = [];
    private tasks: Task[] = [];
    private employees: Employee[] = [];
    private currentSignals: MarketSignal[] = [];

    constructor(goals: Goal[], employees: Employee[]) {
        this.goals = goals;
        this.employees = employees;
    }

    /**
     * Strategy Decomposition Layer
     * Translates strategic goals into tasks based on role-specific logic.
     */
    public decomposeStrategy(): Task[] {
        const newTasks: Task[] = [];

        this.goals.forEach(goal => {
            // Logic would typically involve an LLM call here.
            // For the simulation, we generate tasks that align with goals.
            const taskCount = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < taskCount; i++) {
                newTasks.push({
                    id: `task-${goal.id}-${i}`,
                    title: `Execute ${goal.title} phase ${i + 1}`,
                    description: `Strategic initiative derived from ${goal.description}`,
                    ownerId: this.employees[Math.floor(Math.random() * this.employees.length)].id,
                    goalId: goal.id,
                    effort: Math.random() * 0.8 + 0.1,
                    impactProbability: goal.priority * (Math.random() * 0.4 + 0.6),
                    marketAlignment: Math.random() * 0.5 + 0.5,
                    status: 'todo'
                });
            }
        });

        this.tasks = [...this.tasks, ...newTasks];
        return newTasks;
    }

    /**
     * Execution Simulator
     * Predicts impact and calculates metrics based on current configuration.
     */
    public runSimulation(signals: MarketSignal[]): SimulationResult {
        this.currentSignals = signals;

        // Calculate alignment score based on task visibility to goals
        const alignmentScore = this.calculateAlignment();

        // Simulate impact lift
        const okrImpactLift = this.calculateImpactLift(signals);

        // Identify bottlenecks
        const bottlenecks = this.findBottlenecks();

        return {
            alignmentScore,
            okrImpactLift,
            cycleTimeReduction: Math.random() * 15 + 5, // Simulated % reduction
            bottlenecks,
            recommendations: this.generateRecommendations(bottlenecks, signals)
        };
    }

    private calculateAlignment(): number {
        if (this.tasks.length === 0) return 0;
        const scores = this.tasks.map(t => t.marketAlignment * t.impactProbability);
        return (scores.reduce((a, b) => a + b, 0) / scores.length) * 100;
    }

    private calculateImpactLift(signals: MarketSignal[]): number {
        const signalImpact = signals.reduce((acc, s) => acc + s.severity, 0) / (signals.length || 1);
        return Math.max(0, (this.calculateAlignment() / 100) * (1 - signalImpact * 0.3)) * 25;
    }

    private findBottlenecks(): string[] {
        const loadMap: Record<string, number> = {};
        this.tasks.forEach(t => {
            loadMap[t.ownerId] = (loadMap[t.ownerId] || 0) + t.effort;
        });

        return Object.entries(loadMap)
            .filter(([_, load]) => load > 0.8)
            .map(([id, _]) => {
                const emp = this.employees.find(e => e.id === id);
                return `${emp?.name} (${emp?.role}) is over-capacity at ${Math.round(loadMap[id] * 100)}%`;
            });
    }

    private generateRecommendations(bottlenecks: string[], signals: MarketSignal[]): string[] {
        const recs: string[] = [];
        if (bottlenecks.length > 0) {
            recs.push('Redistribute high-effort tasks from over-capacity owners.');
        }
        if (signals.some(s => s.severity > 0.7)) {
            recs.push('Pause low-alignment R&D tasks to focus on defensive market response.');
        }
        recs.push('Increase sync frequency for high-impact goal decomposition.');
        return recs;
    }
}
