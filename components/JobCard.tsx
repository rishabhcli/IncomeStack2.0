import React from 'react';
import { Job } from '../types';
import { GLASS_PANEL, GLASS_PANEL_HOVER, NEON_TEXT } from '../constants';

interface JobCardProps {
  job: Job;
  onAnalyze: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onAnalyze }) => {
  return (
    <div 
        className={`${GLASS_PANEL} ${GLASS_PANEL_HOVER} p-4 sm:p-5 mb-0 group cursor-pointer relative overflow-hidden flex flex-col lg:grid lg:grid-cols-12 lg:items-center lg:gap-4 lg:py-3`}
        onClick={() => onAnalyze(job)}
    >
      {/* Decorative gradient blob on hover - Mobile Only */}
      <div className="lg:hidden absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none" />

      {/* 1. Job Identity (Title, Company, Remote) */}
      <div className="lg:col-span-4 flex flex-col gap-1 z-10 relative">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="text-base sm:text-lg lg:text-sm lg:font-semibold font-bold text-white group-hover:text-emerald-300 transition-colors leading-tight truncate max-w-full">
                  {job.title}
              </h3>
              {job.isRemote && (
                  <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                      Remote
                  </span>
              )}
          </div>
          <p className="text-slate-400 text-xs font-medium flex items-center gap-1.5 truncate">
              <svg className="w-3 h-3 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              <span className="truncate">{job.company}</span>
          </p>
      </div>

      {/* 2. Match Score (Mobile: Absolute Top Right, Desktop: Col 10/12) */}
      <div className="absolute top-4 right-4 lg:static lg:col-span-1 lg:col-start-10 lg:flex lg:justify-center z-10">
          <div className="bg-slate-950/40 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 lg:px-2 lg:py-1 rounded-lg border border-emerald-500/20 shadow-lg shadow-emerald-900/10 flex flex-col lg:flex-row items-center lg:gap-1">
              <span className={`text-base sm:text-lg lg:text-sm font-bold ${NEON_TEXT} leading-none`}>{job.matchScore}%</span>
              <span className="lg:hidden text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Match</span>
          </div>
      </div>
      
      {/* 3. Description (Mobile Only) */}
      <p className="relative z-10 text-slate-300/90 text-sm mb-3 sm:mb-4 lg:mb-0 leading-relaxed line-clamp-2 lg:hidden mt-2">
          {job.description}
      </p>

      {/* 4. Desktop Salary (Hidden on Mobile) */}
      <div className="hidden lg:block lg:col-span-2 lg:col-start-5 text-sm text-slate-300 font-medium">
          {job.salary}
      </div>

      {/* 5. Tags (Desktop: Col 7-9) */}
      <div className="relative z-10 mt-auto pt-3 lg:pt-0 lg:mt-0 lg:col-span-3 lg:col-start-7 lg:border-0 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar mask-gradient-right w-full">
          {job.tags.map(tag => (
              <span key={tag} className="shrink-0 px-2 py-1 bg-slate-800/50 rounded-md text-[10px] sm:text-[11px] font-medium text-slate-300 border border-white/5 group-hover:border-white/10 transition-colors whitespace-nowrap">
              {tag}
              </span>
          ))}
      </div>

      {/* 6. Footer Action Row (Mobile: Sal+Btn, Desktop: Btn only) */}
      <div className="relative z-10 flex items-center justify-between gap-3 mt-3 lg:mt-0 lg:col-span-2 lg:col-start-11 lg:justify-end">
          {/* Mobile Salary */}
          <div className="lg:hidden text-white text-xs sm:text-sm font-semibold tracking-tight bg-slate-800/30 px-2 py-1 rounded border border-white/5">
              {job.salary}
          </div>

          <button 
              onClick={(e) => { e.stopPropagation(); onAnalyze(job); }}
              className="h-8 px-3 sm:w-9 sm:px-0 lg:w-auto lg:px-4 lg:h-8 flex items-center justify-center rounded-lg sm:rounded-full lg:rounded-lg bg-slate-800 hover:bg-emerald-500 text-slate-300 hover:text-white transition-all border border-white/10 hover:border-emerald-400/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] gap-2 sm:gap-0 lg:gap-2"
              title="Run Deep Analysis"
          >
              <span className="sm:hidden lg:inline text-xs font-medium">Analyze</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
      </div>
    </div>
  );
};

export default JobCard;