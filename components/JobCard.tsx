import React from 'react';
import { Job } from '../types';
import { GLASS_PANEL, NEON_TEXT } from '../constants';

interface JobCardProps {
  job: Job;
  onAnalyze: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onAnalyze }) => {
  return (
    <div className={`${GLASS_PANEL} p-6 mb-4 transform transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(52,211,153,0.1)] group`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">{job.title}</h3>
          <p className="text-slate-400 text-sm mb-4">{job.company} • {job.isRemote ? 'Remote' : 'On-site'}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-2xl font-bold ${NEON_TEXT}`}>{job.matchScore}%</span>
          <span className="text-xs text-slate-500 uppercase tracking-widest">Match</span>
        </div>
      </div>
      
      <p className="text-slate-300 text-sm mb-4 leading-relaxed line-clamp-2">
        {job.description}
      </p>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {job.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-300 border border-white/5">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
             <button 
            onClick={(e) => { e.stopPropagation(); onAnalyze(job); }}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            AI Analyze
          </button>
           <div className="text-white font-medium">{job.salary}</div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;