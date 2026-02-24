export interface Goal {
  id: string;
  title: string;
  description: string;
  priority: number; // 0 to 1
  impactScore: number;
  status: 'active' | 'completed' | 'at-risk';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  goalId: string;
  effort: number; // 0 to 1
  impactProbability: number;
  marketAlignment: number;
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  skills: string[];
  capacity: number; // 0 to 1
  currentLoad: number;
}

export interface MarketSignal {
  id: string;
  type: 'competitor' | 'customer' | 'macro';
  description: string;
  severity: number; // 0 to 1
  timestamp: string;
}

export interface SimulationResult {
  alignmentScore: number;
  okrImpactLift: number;
  cycleTimeReduction: number;
  bottlenecks: string[];
  recommendations: string[];
}
