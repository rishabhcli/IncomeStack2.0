import React from 'react';
import { ViewState } from '../types';

interface NavProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 mb-2 ${
      active 
        ? 'bg-gradient-to-r from-emerald-500/20 to-transparent border-l-4 border-emerald-500 text-white' 
        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
    }`}
  >
    <div className={`${active ? 'text-emerald-400' : 'text-current'}`}>
      {icon}
    </div>
    <span className="font-medium tracking-wide">{label}</span>
  </button>
);

const Navigation: React.FC<NavProps> = ({ currentView, setView }) => {
  return (
    <div className="h-full flex flex-col py-8 px-4">
      <div className="mb-12 px-4">
        <h1 className="text-2xl font-bold text-white tracking-tighter">
          INCOME<span className="text-emerald-500">STACK</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-[0.2em]">Wealth OS 2.0</p>
      </div>

      <nav className="flex-1">
        <NavItem 
          active={currentView === ViewState.DASHBOARD} 
          onClick={() => setView(ViewState.DASHBOARD)}
          label="Command Center"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
        />
        <NavItem 
          active={currentView === ViewState.JOBS} 
          onClick={() => setView(ViewState.JOBS)}
          label="Job Aggregator"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
        <NavItem 
          active={currentView === ViewState.MASTERMIND} 
          onClick={() => setView(ViewState.MASTERMIND)}
          label="Mastermind AI"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
        />
        <NavItem 
          active={currentView === ViewState.LIVE_COACH} 
          onClick={() => setView(ViewState.LIVE_COACH)}
          label="Live Coach"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
        />
        <NavItem 
          active={currentView === ViewState.HEALTH} 
          onClick={() => setView(ViewState.HEALTH)}
          label="Bio-Metrics"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
        />
      </nav>

      <div className="bg-white/5 rounded-2xl p-4 mt-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-emerald-400">POWER_SYNC: ONLINE</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          Last sync: Just now<br/>
          Storage: Encrypted
        </div>
      </div>
    </div>
  );
};

export default Navigation;