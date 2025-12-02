import { Job, WealthMetrics } from './types';

// "Enchanted" UI Token Helpers
export const GLASS_PANEL = "bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-2xl";
export const GLASS_INPUT = "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 transition-all";
export const ACTION_BUTTON = "bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-2 px-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95";
export const NEON_TEXT = "text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]";

export const MOCK_METRICS: WealthMetrics = {
  balance: 14250.75,
  monthlyIncome: 8500,
  burnoutRisk: 42,
  wealthScore: 0.65
};

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Full Stack Engineer',
    company: 'Nebula Protocol',
    salary: '$180k - $220k',
    matchScore: 98,
    tags: ['React Native', 'Rust', 'DeFi'],
    description: 'Building the next generation of decentralized finance interfaces.',
    isRemote: true
  },
  {
    id: '2',
    title: 'AI Solutions Architect',
    company: 'Vector Dynamics',
    salary: '$200k - $250k',
    matchScore: 92,
    tags: ['Python', 'LLM', 'RAG'],
    description: 'Design enterprise-scale AI integration strategies.',
    isRemote: true
  },
  {
    id: '3',
    title: 'Product Designer (Systems)',
    company: 'Glass OS',
    salary: '$160k - $190k',
    matchScore: 85,
    tags: ['Figma', 'Design Systems', 'Spatial'],
    description: 'Crafting the visual language for spatial computing devices.',
    isRemote: false
  }
];