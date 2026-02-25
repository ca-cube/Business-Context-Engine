'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Target,
    Users,
    Activity,
    AlertTriangle,
    CheckCircle2,
    Play,
    ArrowRight,
    Plus,
    Trash2,
    Briefcase,
    Globe,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { BusinessContextEngine } from '@/lib/engine/BusinessContextEngine';
import { Goal, Employee, MarketSignal, Task, SimulationResult } from '@/lib/engine/types';

type ViewState = 'landing' | 'onboarding' | 'dashboard';

export default function AppContainer() {
    const [view, setView] = useState<ViewState>('landing');

    // User Data State
    const [goals, setGoals] = useState<Goal[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [marketSignals, setMarketSignals] = useState<MarketSignal[]>([]);

    // Engine State
    const [engine, setEngine] = useState<BusinessContextEngine | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [simResult, setSimResult] = useState<SimulationResult | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);

    const startOnboarding = () => setView('onboarding');

    const finalizeOnboarding = (finalGoals: Goal[], finalEmployees: Employee[], finalSignals: MarketSignal[]) => {
        setGoals(finalGoals);
        setEmployees(finalEmployees);
        setMarketSignals(finalSignals);

        const newEngine = new BusinessContextEngine(finalGoals, finalEmployees);
        setEngine(newEngine);

        // Initial decomposition
        const initialTasks = newEngine.decomposeStrategy();
        setTasks(initialTasks);
        setSimResult(newEngine.runSimulation(finalSignals));

        setView('dashboard');
    };

    return (
        <div className="min-h-screen bg-[#050507]">
            <AnimatePresence mode="wait">
                {view === 'landing' && (
                    <LandingView key="landing" onStart={startOnboarding} />
                )}
                {view === 'onboarding' && (
                    <OnboardingView key="onboarding" onComplete={finalizeOnboarding} />
                )}
                {view === 'dashboard' && engine && (
                    <DashboardView
                        key="dashboard"
                        engine={engine}
                        goals={goals}
                        employees={employees}
                        signals={marketSignals}
                        tasks={tasks}
                        setTasks={setTasks}
                        simResult={simResult}
                        setSimResult={setSimResult}
                        isSimulating={isSimulating}
                        setIsSimulating={setIsSimulating}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function LandingView({ onStart }: { onStart: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-1 items-center justify-center min-h-screen p-8"
        >
            <div className="max-w-4xl text-center">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <Sparkles size={16} className="text-cyan-400" />
                        <span className="text-sm font-medium text-cyan-400 tracking-wider uppercase">Context Orchestration Layer</span>
                    </div>
                </motion.div>

                <motion.h1
                    className="text-7xl font-black mb-6 leading-tight"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Turn Strategy Into <br />
                    <span className="gradient-text">Executable Intelligence</span>
                </motion.h1>

                <motion.p
                    className="text-xl text-dim mb-12 max-w-2xl mx-auto leading-relaxed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Stop the strategic drift. Our AI agentic framework continuously translates
                    OKRs and market signals into prioritized, alignment-verified tasks.
                </motion.p>

                <motion.button
                    onClick={onStart}
                    className="btn-primary text-lg px-10 py-5 group"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Get Started
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        </motion.div>
    );
}

function OnboardingView({ onComplete }: { onComplete: (g: Goal[], e: Employee[], s: MarketSignal[]) => void }) {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [signals, setSignals] = useState<MarketSignal[]>([]);

    // Temp states for inputs
    const [gTitle, setGTitle] = useState('');
    const [gDesc, setGDesc] = useState('');
    const [eName, setEName] = useState('');
    const [eRole, setERole] = useState('');
    const [sDesc, setSDesc] = useState('');

    const addGoal = () => {
        if (!gTitle || !gDesc) return;
        const newGoal: Goal = {
            id: `g-${Date.now()}`,
            title: gTitle,
            description: gDesc,
            priority: 0.8,
            impactScore: 50,
            status: 'active'
        };
        setGoals([...goals, newGoal]);
        setGTitle(''); setGDesc('');
    };

    const addEmployee = () => {
        if (!eName || !eRole) return;
        const newEmp: Employee = {
            id: `e-${Date.now()}`,
            name: eName,
            role: eRole,
            skills: ['Generalist'],
            capacity: 1,
            currentLoad: 0
        };
        setEmployees([...employees, newEmp]);
        setEName(''); setERole('');
    };

    const addSignal = () => {
        if (!sDesc) return;
        const newSignal: MarketSignal = {
            id: `s-${Date.now()}`,
            type: 'macro',
            description: sDesc,
            severity: 0.5,
            timestamp: new Date().toISOString()
        };
        setSignals([...signals, newSignal]);
        setSDesc('');
    };

    const isReady = goals.length > 0 && employees.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-4xl mx-auto p-12 py-20"
        >
            <h2 className="text-4xl font-black mb-12 flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                    <Zap className="text-cyan-400" />
                </div>
                Configure Your Engine
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Goals Form */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Target size={20} className="text-cyan-400" />
                        Strategic Goals (OKRs)
                    </h3>
                    <div className="glass-card p-6 space-y-4">
                        <input
                            value={gTitle} onChange={e => setGTitle(e.target.value)}
                            placeholder="Goal Title (e.g. Revenue Expansion)"
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg focus:border-cyan-400 outline-none transition-colors"
                        />
                        <textarea
                            value={gDesc} onChange={e => setGDesc(e.target.value)}
                            placeholder="Description / Key Result"
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg focus:border-cyan-400 outline-none transition-colors min-h-[100px]"
                        />
                        <button onClick={addGoal} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <Plus size={18} /> Add Goal
                        </button>
                    </div>
                    <div className="space-y-2">
                        {goals.map(g => (
                            <div key={g.id} className="p-3 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center">
                                <span className="font-medium">{g.title}</span>
                                <Trash2 size={16} className="text-dim hover:text-red-400 cursor-pointer" onClick={() => setGoals(goals.filter(x => x.id !== g.id))} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Workforce Form */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Users size={20} className="text-purple-400" />
                        Workforce Graph
                    </h3>
                    <div className="glass-card p-6 space-y-4">
                        <input
                            value={eName} onChange={e => setEName(e.target.value)}
                            placeholder="Employee Name"
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg focus:border-cyan-400 outline-none transition-colors"
                        />
                        <input
                            value={eRole} onChange={e => setERole(e.target.value)}
                            placeholder="Role (e.g. Lead Engineer)"
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg focus:border-cyan-400 outline-none transition-colors"
                        />
                        <button onClick={addEmployee} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <Plus size={18} /> Add Member
                        </button>
                    </div>
                    <div className="space-y-2">
                        {employees.map(e => (
                            <div key={e.id} className="p-3 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center">
                                <div>
                                    <span className="font-medium">{e.name}</span>
                                    <span className="text-xs text-dim block uppercase">{e.role}</span>
                                </div>
                                <Trash2 size={16} className="text-dim hover:text-red-400 cursor-pointer" onClick={() => setEmployees(employees.filter(x => x.id !== e.id))} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-12 border-t border-white/5 flex justify-end">
                <button
                    disabled={!isReady}
                    onClick={() => onComplete(goals, employees, signals)}
                    className={`btn-primary px-12 py-4 ${!isReady ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                >
                    Finalize & Generate Intelligence
                    <ArrowRight className="ml-2" />
                </button>
            </div>
        </motion.div>
    );
}

function DashboardView({
    engine, goals, employees, signals, tasks, setTasks, simResult, setSimResult, isSimulating, setIsSimulating
}: any) {
    const handleDecompose = async () => {
        try {
            setIsSimulating(true);
            const goal = goals[Math.floor(Math.random() * goals.length)];
            const res = await fetch('/api/engine/decompose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    goal,
                    employees: employees,
                    marketContext: signals.map((s: any) => s.description).join(', ') || 'Standard competitive market'
                }),
            });
            const data = await res.json();
            if (data.tasks) {
                setTasks((prev: any) => [...prev, ...data.tasks]);
                const simRes = await fetch('/api/engine/simulate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tasks: [...tasks, ...data.tasks], signals }),
                });
                const simData = await simRes.json();
                if (simData.macroScore) {
                    setSimResult((prev: any) => ({
                        ...engine.runSimulation(signals),
                        alignmentScore: simData.macroScore,
                    }));
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSimulating(false);
        }
    };

    const runFullSimulation = async () => {
        setIsSimulating(true);
        try {
            const simRes = await fetch('/api/engine/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks, signals }),
            });
            const simData = await simRes.json();
            const localMetrics = engine.runSimulation(signals);
            setSimResult({
                ...localMetrics,
                alignmentScore: simData.macroScore || localMetrics.alignmentScore,
                recommendations: simData.adjustedTasks?.map((t: any) => t.re_prioritizationReason) || localMetrics.recommendations
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsSimulating(false);
        }
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
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-8 flex direction-column gap-6">
                    <section className="glass-card">
                        <h2 className="flex items-center gap-3 mb-6 text-xl">
                            <Target className="text-cyan-400" />
                            Strategic Goals (OKRs)
                        </h2>
                        <div className="flex direction-column gap-4">
                            {goals.map((goal: any) => (
                                <div key={goal.id} className="p-4 bg-black/30 rounded-xl border border-white/5 flex direction-column">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold">{goal.title}</span>
                                        <span className="text-xs text-dim">PRIORITY {goal.priority * 100}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
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
                        <div className="flex direction-column gap-4">
                            {employees.map((emp: any) => (
                                <div key={emp.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold">
                                        {emp.name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{emp.name}</div>
                                        <div className="text-xs text-dim uppercase tracking-wider">{emp.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Center Column */}
                <div className="lg:col-span-2 space-y-8">
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
                                {tasks.slice().reverse().map((task: any) => (
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
                                                    {employees.find((e: any) => e.id === task.ownerId)?.name}
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
                                {simResult?.bottlenecks.map((b: any, i: number) => (
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
                                {simResult?.recommendations.map((r: any, i: number) => (
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
        </div>
    );
}
