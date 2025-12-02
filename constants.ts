import { Job, WealthMetrics } from './types';

// "Enchanted" UI Token Helpers
// Using a more sophisticated glass effect with distinct borders and shadows for depth
export const GLASS_PANEL = "bg-slate-900/70 backdrop-blur-2xl border border-white/10 shadow-xl rounded-2xl ring-1 ring-white/5";
export const GLASS_PANEL_HOVER = "hover:bg-slate-800/70 hover:border-white/20 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300";

export const GLASS_INPUT = "bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all w-full font-medium shadow-inner";

export const ACTION_BUTTON = "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 border border-emerald-500/20";
export const ACTION_BUTTON_SECONDARY = "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium py-3 px-6 rounded-xl border border-white/5 hover:border-white/10 transition-all active:scale-95 flex items-center justify-center gap-2";

export const NEON_TEXT = "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]";

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
    description: 'Building the next generation of decentralized finance interfaces. Looking for engineers who understand liquid markets.',
    isRemote: true
  },
  {
    id: '2',
    title: 'AI Solutions Architect',
    company: 'Vector Dynamics',
    salary: '$200k - $250k',
    matchScore: 92,
    tags: ['Python', 'LLM', 'RAG'],
    description: 'Design enterprise-scale AI integration strategies. Requires deep knowledge of vector databases.',
    isRemote: true
  },
  {
    id: '3',
    title: 'Product Designer (Systems)',
    company: 'Glass OS',
    salary: '$160k - $190k',
    matchScore: 85,
    tags: ['Figma', 'Design Systems', 'Spatial'],
    description: 'Crafting the visual language for spatial computing devices. Experience with 3D interfaces preferred.',
    isRemote: false
  },
  {
    id: '4',
    title: 'Growth Marketing Lead',
    company: 'Orbit Financial',
    salary: '$140k - $170k',
    matchScore: 78,
    tags: ['Analytics', 'SEO', 'Brand'],
    description: 'Lead the user acquisition strategy for a new fintech unicorn.',
    isRemote: true
  }
];
