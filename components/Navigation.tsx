import React from 'react';
import { ViewState } from '../types';

interface NavProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const ICONS = {
  DASHBOARD: (active: boolean) => (
    <svg className={`w-6 h-6 transition-all duration-300 ${active ? 'fill-emerald-500/20 stroke-emerald-400' : 'stroke-slate-400 group-hover:stroke-slate-200'}`} fill="none" strokeWidth={active ? 2 : 1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
  ),
  JOBS: (active: boolean) => (
    <svg className={`w-6 h-6 transition-all duration-300 ${active ? 'fill-emerald-500/20 stroke-emerald-400' : 'stroke-slate-400 group-hover:stroke-slate-200'}`} fill="none" strokeWidth={active ? 2 : 1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  ),
  MASTERMIND: (active: boolean) => (
    <svg className={`w-6 h-6 transition-all duration-300 ${active ? 'fill-emerald-500/20 stroke-emerald-400' : 'stroke-slate-400 group-hover:stroke-slate-200'}`} fill="none" strokeWidth={active ? 2 : 1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
  ),
  LIVE_COACH: (active: boolean) => (
    <svg className={`w-6 h-6 transition-all duration-300 ${active ? 'fill-emerald-500/20 stroke-emerald-400' : 'stroke-slate-400 group-hover:stroke-slate-200'}`} fill="none" strokeWidth={active ? 2 : 1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
  ),
  HEALTH: (active: boolean) => (
    <svg className={`w-6 h-6 transition-all duration-300 ${active ? 'fill-emerald-500/20 stroke-emerald-400' : 'stroke-slate-400 group-hover:stroke-slate-200'}`} fill="none" strokeWidth={active ? 2 : 1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
  )
};

const NAV_ITEMS = [
  { id: ViewState.DASHBOARD, label: 'Overview', icon: ICONS.DASHBOARD },
  { id: ViewState.JOBS, label: 'Opportunities', icon: ICONS.JOBS },
  { id: ViewState.MASTERMIND, label: 'Coach', icon: ICONS.MASTERMIND },
  { id: ViewState.LIVE_COACH, label: 'Live', icon: ICONS.LIVE_COACH },
  { id: ViewState.HEALTH, label: 'Wellness', icon: ICONS.HEALTH },
];

export const Sidebar: React.FC<NavProps> = ({ currentView, setView }) => {
  return (
    <div className="h-full flex flex-col pt-8 pb-6 px-4">
      <div className="mb-10 px-4">
        <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
            INCOME<span className="text-emerald-400">STACK</span>
            </h1>
        </div>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium ml-1">Wealth OS 2.0</p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = currentView === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                active 
                  ? 'bg-slate-800/80 text-white shadow-lg shadow-black/20 ring-1 ring-white/5' 
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <div className={`${active ? 'scale-105' : 'scale-100 opacity-80 group-hover:opacity-100'} transition-all`}>
                {item.icon(active)}
              </div>
              <span className={`font-medium text-sm ${active ? 'font-semibold tracking-wide' : 'tracking-normal'}`}>{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-2">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">System Online</span>
          </div>
          <div className="h-1 w-full bg-slate-700/50 rounded-full overflow-hidden mb-2">
             <div className="h-full w-[72%] bg-emerald-500 rounded-full"></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>RAM: 72%</span>
            <span>NET: 12ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BottomNav: React.FC<NavProps> = ({ currentView, setView }) => {
  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 px-2 pb-safe pt-2">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const active = currentView === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-all duration-300 relative group active:scale-95`}
            >
              {active && (
                  <div className="absolute top-0 w-8 h-1 bg-emerald-500 rounded-b-full shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-fadeIn"></div>
              )}
              <div className={`${active ? 'text-emerald-400 -translate-y-0.5' : 'text-slate-500 group-hover:text-slate-300'} transition-all duration-300`}>
                {item.icon(active)}
              </div>
              <span className={`text-[9px] font-semibold tracking-wide ${active ? 'text-emerald-400 opacity-100' : 'text-slate-500 opacity-70'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
