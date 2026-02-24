'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Target,
    Users,
    LineChart,
    Activity,
    AlertTriangle,
    CheckCircle2,
    Play,
    RefreshCcw,
    ArrowRight
} from 'lucide-react';
import { BusinessContextEngine } from '@/lib/engine/BusinessContextEngine';
import { Goal, Employee, MarketSignal, Task, SimulationResult } from '@/lib/engine/types';

// Mock Data
const initialGoals: Goal[] = [
    { id: 'g1', title: 'Revenue Expansion', description: 'Grow ARR by 35% in Q3', priority: 0.9, impactScore: 85, status: 'active' },
    { id: 'g2', title: 'Churn Reduction', description: 'Reduce logo churn below 5%', priority: 0.85, impactScore: 78, status: 'active' },
    { id: 'g3', title: 'Product Velocity', description: 'Release 3 major features', priority: 0.7, impactScore: 65, status: 'active' },
];

const initialEmployees: Employee[] = [
    { id: 'e1', name: 'Alex Chen', role: 'Staff Engineer', skills: ['React', 'Node', 'System Design'], capacity: 1, currentLoad: 0.8 },
    { id: 'e2', name: 'Sarah Miller', role: 'Product Lead', skills: ['Strategy', 'Communication'], capacity: 1, currentLoad: 0.6 },
    { id: 'e3', name: 'Jordan Tay', role: 'Growth Lead', skills: ['Data', 'Marketing'], capacity: 1, currentLoad: 0.5 },
];

const mockSignals: MarketSignal[] = [
    { id: 's1', type: 'competitor', description: 'Competitor X launched AI feature', severity: 0.8, timestamp: new Date().toISOString() },
    { id: 's2', type: 'customer', description: 'Enterprise churn signals detected in FinTech', severity: 0.6, timestamp: new Date().toISOString() },
];

export default function BCEDashboard() {
    const [engine] = useState(new BusinessContextEngine(initialGoals, initialEmployees));
    const [tasks, setTasks] = useState<Task[]>([]);
    const [signals, setSignals] = useState<MarketSignal[]>(mockSignals);
    const [simResult, setSimResult] = useState<SimulationResult | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);

    useEffect(() => {
        // Initial decomposition
        const initialTasks = engine.decomposeStrategy();
        setTasks(initialTasks);
        setSimResult(engine.runSimulation(signals));
    }, []);

    const handleDecompose = () => {
        const newTasks = engine.decomposeStrategy();
        setTasks(prev => [...prev, ...newTasks]);
        setSimResult(engine.runSimulation(signals));
    };

    const runFullSimulation = () => {
        setIsSimulating(true);
        setTimeout(() => {
            setSimResult(engine.runSimulation(signals));
            setIsSimulating(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black gradient-text">BUSINESS CONTEXT ENGINE</h1>
                    <p className="text-dim mt-2 italic">“AI → Execution Translator”</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleDecompose} className="btn-primary flex items-center gap-2">
                        <Zap size={18} />
                        Decompose Strategy
                    </button>
                    <button onClick={runFullSimulation} className="bg-white/5 border border-white/10 p-3 rounded-lg hover:bg-white/10 transition-colors">
                        <Play size={20} className={isSimulating ? 'animate-spin' : ''} />
                    </button>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Strategy & Workforce */}
                <div className="lg:col-span-1 space-y-8">
                    <section className="glass-card">
                        <h2 className="flex items-center gap-3 mb-6 text-xl">
                            <Target className="text-cyan-400" />
                            Strategic Goals (OKRs)
                        </h2>
                        <div className="space-y-4">
                            {initialGoals.map(goal => (
                                <div key={goal.id} className="p-4 bg-black/30 rounded-xl border border-white/5">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold">{goal.title}</span>
                                        <span className="text-xs text-dim">PRIORITY {goal.priority * 100}%</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${goal.impactScore}%` }}
                                            className="h-full bg-cyan-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="glass-card">
                        <h2 className="flex items-center gap-3 mb-6 text-xl">
                            <Users className="text-purple-400" />
                            Workforce Graph
                        </h2>
                        <div className="space-y-4">
                            {initialEmployees.map(emp => (
                                <div key={emp.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold">
                                        {emp.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-medium">{emp.name}</div>
                                        <div className="text-xs text-dim">{emp.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Center Column: Execution Engine */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Top Metrics */}
                    <section className="grid grid-cols-3 gap-4">
                        <div className="glass-card text-center py-8">
                            <div className="stat-label">Alignment Score</div>
                            <div className="stat-value">{simResult?.alignmentScore.toFixed(1)}%</div>
                        </div>
                        <div className="glass-card text-center py-8">
                            <div className="stat-label">OKR Impact Lift</div>
                            <div className="stat-value">+{simResult?.okrImpactLift.toFixed(1)}%</div>
                        </div>
                        <div className="glass-card text-center py-8">
                            <div className="stat-label">Wait Time Red.</div>
                            <div className="stat-value">{simResult?.cycleTimeReduction.toFixed(1)}%</div>
                        </div>
                    </section>

                    {/* Execution Feed */}
                    <section className="glass-card relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="flex items-center gap-3 text-xl">
                                <Activity className="text-green-400" />
                                Context-Aligned Tasks
                            </h2>
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">
                                CONTINUOUS FEED
                            </span>
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {tasks.slice().reverse().map((task, idx) => (
                                    <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-start gap-4"
                                    >
                                        <div className="mt-1">
                                            {task.impactProbability > 0.7 ? (
                                                <CheckCircle2 size={20} className="text-green-500" />
                                            ) : (
                                                <Activity size={20} className="text-yellow-500" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-lg">{task.title}</h3>
                                                <span className="text-[10px] text-dim bg-white/10 px-2 py-1 rounded">
                                                    {initialEmployees.find(e => e.id === task.ownerId)?.name}
                                                </span>
                                            </div>
                                            <p className="text-dim text-sm mt-1">{task.description}</p>
                                            <div className="flex gap-4 mt-3">
                                                <div className="flex items-center gap-1 text-[10px] font-mono">
                                                    <Zap size={10} className="text-cyan-400" />
                                                    IMPACT: {Math.round(task.impactProbability * 100)}%
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-mono">
                                                    <Activity size={10} className="text-purple-400" />
                                                    ALIGN: {Math.round(task.marketAlignment * 100)}%
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>

                    {/* Simulation Insights */}
                    <div className="grid grid-cols-2 gap-8">
                        <section className="glass-card">
                            <h3 className="flex items-center gap-2 mb-4 text-orange-400">
                                <AlertTriangle size={18} />
                                Bottlenecks Detected
                            </h3>
                            <ul className="space-y-2 text-sm text-dim">
                                {simResult?.bottlenecks.map((b, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-orange-400 rounded-full" />
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="glass-card">
                            <h3 className="flex items-center gap-2 mb-4 text-cyan-400">
                                <ArrowRight size={18} />
                                AI Recommendations
                            </h3>
                            <ul className="space-y-2 text-sm text-dim">
                                {simResult?.recommendations.map((r, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                                        {r}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
        </div>
    );
}
