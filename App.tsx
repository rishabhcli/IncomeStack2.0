import React, { useState, useEffect, useRef } from 'react';
import { HashRouter } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Components & Services
import WealthFluid from './components/WealthFluid';
import { Sidebar, BottomNav } from './components/Navigation';
import JobCard from './components/JobCard';
import { Job, ViewState, ChatMessage, WealthMetrics, JobAnalysis } from './types';
import { GLASS_PANEL, GLASS_INPUT, ACTION_BUTTON, ACTION_BUTTON_SECONDARY, NEON_TEXT, MOCK_JOBS, MOCK_METRICS } from './constants';
import * as geminiService from './services/geminiService';

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [metrics, setMetrics] = useState<WealthMetrics>(MOCK_METRICS);
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  
  // Search Grounding State
  const [marketQuery, setMarketQuery] = useState('');
  const [marketData, setMarketData] = useState<{text: string, grounding: any[]} | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Vision Board State
  const [visionPrompt, setVisionPrompt] = useState('');
  const [visionSize, setVisionSize] = useState<"1K"|"2K"|"4K">("1K");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  // Job Analysis State
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Live API State
  const [liveStatus, setLiveStatus] = useState<'disconnected'|'connecting'|'connected'|'speaking'>('disconnected');
  const liveSessionRef = useRef<geminiService.LiveSession | null>(null);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isThinking, currentView]);

  // Cleanup Live Session
  useEffect(() => {
    return () => {
        liveSessionRef.current?.disconnect();
    };
  }, []);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsThinking(true);

    const botResponseText = await geminiService.getMastermindAdvice(
      chatHistory.map(m => ({ role: m.role, content: m.content })),
      userMsg.content
    );

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: botResponseText,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, botMsg]);
    setIsThinking(false);
  };

  const handleMarketSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!marketQuery) return;
    setIsSearching(true);
    const result = await geminiService.getMarketInsights(marketQuery);
    setMarketData(result);
    setIsSearching(false);
  };

  const handleGenerateImage = async () => {
    if (!visionPrompt) return;
    setIsGeneratingImg(true);
    const imgData = await geminiService.generateVisionBoardImage(visionPrompt, visionSize);
    if (imgData) setGeneratedImage(imgData);
    setIsGeneratingImg(false);
  };

  const handleAnalyzeJob = async (job: Job) => {
      setSelectedJob(job);
      setShowJobModal(true);
      setJobAnalysis(null);
      setCopySuccess(false);
      setIsAnalyzingJob(true);

      const analysis = await geminiService.analyzeJobMatch(job.title, job.description, ['React', 'TypeScript', 'AI', 'Design']);
      
      setJobAnalysis(analysis);
      setIsAnalyzingJob(false);
  };

  const handleCopyAnalysis = () => {
    if (!jobAnalysis || !selectedJob) return;
    
    const text = [
        `Job Analysis: ${selectedJob.title} @ ${selectedJob.company}`,
        `Match Score: ${selectedJob.matchScore}%`,
        '',
        `Summary: ${jobAnalysis.matchAnalysis}`,
        '',
        'Pros:',
        ...jobAnalysis.pros.map(p => `• ${p}`),
        '',
        'Cons:',
        ...jobAnalysis.cons.map(c => `• ${c}`),
        '',
        `Growth Potential: ${jobAnalysis.growthPotential}/100`
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const toggleLiveSession = async () => {
    if (liveStatus === 'disconnected') {
        const session = new geminiService.LiveSession();
        session.onStatusChange = (s) => setLiveStatus(s);
        liveSessionRef.current = session;
        await session.connect();
    } else {
        liveSessionRef.current?.disconnect();
    }
  };

  // --- VIEW RENDERERS ---

  const renderDashboard = () => (
    <div className="space-y-6 animate-fadeIn">
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Command Center</h2>
            <p className="text-slate-400 text-sm mt-1">Real-time overview of your financial ecosystem.</p>
         </div>
         <div className="flex gap-4">
             <div className="text-right">
                <div className="text-emerald-400 font-mono text-xs font-bold tracking-wider">MARKET SENTIMENT</div>
                <div className="text-white font-medium text-sm">BULLISH (+2.4%)</div>
             </div>
             <div className="text-right border-l border-white/10 pl-4">
                <div className="text-slate-500 font-mono text-xs font-bold tracking-wider">BITCOIN</div>
                <div className="text-white font-medium text-sm">$98,420</div>
             </div>
         </div>
       </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className={GLASS_PANEL + " p-6 flex flex-col justify-between"}>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Net Worth</div>
          <div className="text-3xl font-bold text-white tracking-tight">${metrics.balance.toLocaleString()}</div>
          <div className="text-emerald-400 text-xs mt-2 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            +12.5% this month
          </div>
        </div>
        <div className={GLASS_PANEL + " p-6 flex flex-col justify-between"}>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Monthly Income</div>
          <div className="text-3xl font-bold text-white tracking-tight">${metrics.monthlyIncome.toLocaleString()}</div>
          <div className="text-slate-400 text-xs mt-2">Projected: ${(metrics.monthlyIncome * 1.1).toLocaleString()}</div>
        </div>
        <div className={GLASS_PANEL + " p-6 flex flex-col justify-between relative overflow-hidden"}>
          <div className="relative z-10">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Burnout Risk</div>
            <div className="text-3xl font-bold text-white tracking-tight">{metrics.burnoutRisk}%</div>
            <div className={`text-xs mt-2 font-medium ${metrics.burnoutRisk < 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metrics.burnoutRisk < 50 ? 'Stable Condition' : 'Warning: High Stress'}
            </div>
          </div>
          <svg className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 text-emerald-500" viewBox="0 0 36 36">
             <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
             <path className="text-current" strokeDasharray={`${metrics.burnoutRisk}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
          </svg>
        </div>
      </div>

      {/* Main Content Split: Chart & Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className={`${GLASS_PANEL} p-6 lg:col-span-2 h-[400px] flex flex-col`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Income Projection</h3>
                <div className="flex gap-2">
                    {['1M', '3M', '6M', '1Y'].map(t => (
                        <button key={t} className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">{t}</button>
                    ))}
                </div>
            </div>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                        { name: 'Jan', val: 4000 }, { name: 'Feb', val: 5500 }, { name: 'Mar', val: 4800 },
                        { name: 'Apr', val: 7000 }, { name: 'May', val: 8500 }, { name: 'Jun', val: 11000 },
                    ]}>
                        <defs>
                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                            itemStyle={{ color: '#10b981' }}
                        />
                        <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Intelligence / Search Section */}
        <div className={`${GLASS_PANEL} p-6 flex flex-col h-[400px]`}>
            <h3 className="text-lg font-bold text-white mb-4">Market Intelligence</h3>
            <form onSubmit={handleMarketSearch} className="mb-4">
                <div className="relative">
                    <input 
                        type="text" 
                        value={marketQuery}
                        onChange={(e) => setMarketQuery(e.target.value)}
                        placeholder="Ask about market trends..."
                        className={GLASS_INPUT + " pr-10 text-sm"}
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </div>
            </form>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                {isSearching ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs animate-pulse">Scanning Global Markets...</span>
                    </div>
                ) : marketData ? (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-300 leading-relaxed">{marketData.text}</p>
                        {marketData.grounding?.length > 0 && (
                            <div className="border-t border-white/5 pt-3">
                                <span className="text-xs text-slate-500 uppercase font-bold">Sources</span>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {marketData.grounding.map((chunk, idx) => (
                                        <a key={idx} href={chunk.web?.uri} target="_blank" rel="noreferrer" className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-emerald-400 truncate max-w-[150px] block">
                                            {chunk.web?.title || 'Source'}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600">
                        <svg className="w-12 h-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-xs text-center">Search specifically for "Crypto Trends 2025" or "SaaS Multiples"</p>
                    </div>
                )}
            </div>
        </div>
      </div>

       {/* Vision Board / Image Gen */}
       <div className={`${GLASS_PANEL} p-6 mt-6`}>
           <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">Vision Board Generator</h3>
                    <p className="text-sm text-slate-400 mb-4">Manifest your goals. Describe your ideal future workspace or lifestyle.</p>
                    <div className="flex gap-2">
                        <input 
                            className={GLASS_INPUT} 
                            placeholder="A futuristic minimalist office in Tokyo with a view..." 
                            value={visionPrompt}
                            onChange={(e) => setVisionPrompt(e.target.value)}
                        />
                        <select 
                            className="bg-slate-900 border border-white/10 rounded-xl px-3 text-white text-sm focus:outline-none"
                            value={visionSize}
                            onChange={(e) => setVisionSize(e.target.value as any)}
                        >
                            <option value="1K">1K</option>
                            <option value="2K">2K</option>
                            <option value="4K">4K</option>
                        </select>
                        <button onClick={handleGenerateImage} className={ACTION_BUTTON + " px-8 shrink-0"} disabled={isGeneratingImg}>
                           {isGeneratingImg ? 'Dreaming...' : 'Visualize'}
                        </button>
                    </div>
                </div>
                {generatedImage && (
                    <div className="w-full md:w-64 h-40 rounded-xl overflow-hidden border border-white/10 shadow-lg shrink-0">
                        <img src={generatedImage} alt="Vision" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                )}
           </div>
       </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6 animate-fadeIn pb-20 relative">
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Opportunities</h2>
                <p className="text-slate-400 text-sm mt-1">AI-curated roles matching your wealth profile.</p>
            </div>
            <button className={ACTION_BUTTON_SECONDARY + " text-sm py-2"}>
                Filter Settings
            </button>
        </div>
        
        {/* Desktop Header Row */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-4">Role & Company</div>
            <div className="col-span-2">Salary</div>
            <div className="col-span-3">Skills</div>
            <div className="col-span-1 text-center">Match</div>
            <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="flex flex-col gap-3">
            {MOCK_JOBS.map(job => (
                <JobCard key={job.id} job={job} onAnalyze={handleAnalyzeJob} />
            ))}
        </div>

        <div className="text-center pt-8">
            <button className="text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors">Load More Opportunities</button>
        </div>

        {/* Job Analysis Modal */}
        {showJobModal && selectedJob && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowJobModal(false)} />
                <div className={`${GLASS_PANEL} w-full max-w-lg p-6 relative z-10 animate-slideUp`}>
                    
                    {/* Header Controls */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                         {jobAnalysis && (
                            <button 
                                onClick={handleCopyAnalysis}
                                className="text-slate-400 hover:text-emerald-400 transition-colors p-2 rounded-full hover:bg-white/5"
                                title="Copy Analysis"
                            >
                                {copySuccess ? (
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                )}
                            </button>
                         )}
                        <button onClick={() => setShowJobModal(false)} className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">Deep Scan Analysis</h3>
                    <p className="text-sm text-emerald-400 font-mono mb-6 uppercase tracking-wider">{selectedJob.company} • {selectedJob.title}</p>
                    
                    {isAnalyzingJob ? (
                        <div className="flex flex-col items-center py-12">
                             <div className="w-12 h-12 border-4 border-slate-700 border-t-emerald-400 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]"></div>
                             <p className="text-slate-300 font-medium animate-pulse">Deep Scanning Career Fit...</p>
                             <p className="text-xs text-slate-500 mt-2">Connecting to Gemini 3 Pro Neural Network</p>
                        </div>
                    ) : jobAnalysis ? (
                        <div className="space-y-5">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                <p className="text-slate-200 leading-relaxed text-sm italic">"{jobAnalysis.matchAnalysis}"</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2">Pros</h4>
                                    <ul className="space-y-1">
                                        {jobAnalysis.pros.map((p, i) => (
                                            <li key={i} className="text-xs text-slate-300 flex gap-2">
                                                <span className="text-emerald-500">+</span> {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wide mb-2">Cons</h4>
                                    <ul className="space-y-1">
                                        {jobAnalysis.cons.map((c, i) => (
                                            <li key={i} className="text-xs text-slate-300 flex gap-2">
                                                <span className="text-rose-500">-</span> {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Career Growth Potential</span>
                                    <span className="text-white font-bold">{jobAnalysis.growthPotential}/100</span>
                                </div>
                                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400" style={{ width: `${jobAnalysis.growthPotential}%` }}></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-rose-400 text-center">Analysis Failed. Please try again.</p>
                    )}
                </div>
            </div>
        )}
    </div>
  );

  // Native-style Chat Interface
  const renderMastermind = () => (
    <div className="flex flex-col h-full relative bg-slate-900/20">
       {/* Chat Header */}
       <div className="shrink-0 p-4 border-b border-white/5 bg-slate-900/40 backdrop-blur-md flex justify-between items-center z-20">
           <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/10">
                   WC
               </div>
               <div>
                   <h3 className="text-sm font-bold text-white">Wealth Coach AI</h3>
                   <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] text-emerald-400 font-medium">Online • Thinking Mode (32k)</span>
                   </div>
               </div>
           </div>
           <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
           </button>
       </div>

       {/* Messages Area */}
       <div 
          className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 md:space-y-6 pb-24 md:pb-24 scroll-smooth"
          ref={chatScrollRef}
       >
           <div className="flex justify-start">
               <div className="max-w-[85%] md:max-w-[70%] bg-slate-800/80 backdrop-blur-md border border-white/5 rounded-2xl rounded-tl-none p-4 shadow-sm">
                   <p className="text-slate-200 text-sm leading-relaxed">
                       Welcome back. I've analyzed your portfolio and recent market shifts. The tech sector is showing volatility, but your skills in React Native and AI are in high demand. How can I assist your wealth journey today?
                   </p>
                   <span className="text-[10px] text-slate-500 mt-2 block">10:42 AM</span>
               </div>
           </div>

           {chatHistory.map((msg) => (
               <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}>
                   <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                       msg.role === 'user' 
                         ? 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-900/20' 
                         : 'bg-slate-800/80 backdrop-blur-md border border-white/5 text-slate-200 rounded-tl-none'
                   }`}>
                       <p className="whitespace-pre-wrap">{msg.content}</p>
                       <span className={`text-[10px] mt-2 block opacity-60 ${msg.role === 'user' ? 'text-emerald-100' : 'text-slate-500'}`}>
                           {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                       </span>
                   </div>
               </div>
           ))}

           {isThinking && (
               <div className="flex justify-start">
                   <div className="bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                       <div className="flex gap-1">
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-0"></div>
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-300"></div>
                       </div>
                       <span className="text-xs text-slate-500 font-medium">Analyzing (Thinking Budget: 32k)...</span>
                   </div>
               </div>
           )}
       </div>

       {/* Input Area */}
       <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20 pb-20 md:pb-4">
           <form onSubmit={handleChatSubmit} className="relative max-w-4xl mx-auto flex items-end gap-2">
                <div className="relative flex-1">
                    <input 
                        className="w-full bg-slate-900/90 border border-white/10 rounded-2xl pl-4 pr-12 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-xl"
                        placeholder="Ask for advice, market data, or career strategy..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-emerald-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </button>
                </div>
                <button 
                    type="submit" 
                    disabled={!chatInput.trim() || isThinking}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-xl shadow-lg shadow-emerald-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
           </form>
       </div>
    </div>
  );

  const renderHealth = () => (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-fadeIn">
          <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center relative">
              <svg className="w-10 h-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              <div className="absolute inset-0 border-4 border-rose-500/30 rounded-full animate-ping opacity-20"></div>
          </div>
          <h2 className="text-2xl font-bold text-white">Bio-Data Syncing...</h2>
          <p className="text-slate-400 max-w-xs">Connect your Apple Health or Android Health Connect to track Burnout Risk metrics.</p>
          <button className={ACTION_BUTTON}>Connect Device</button>
      </div>
  );

  const renderLiveCoach = () => (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-8 animate-fadeIn">
        <div className="relative">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 blur-xl absolute inset-0 transition-all duration-500 ${liveStatus === 'speaking' ? 'scale-150 opacity-60 animate-pulse' : liveStatus === 'connected' ? 'opacity-20' : 'opacity-0'}`}></div>
            
            <div className={`w-32 h-32 rounded-full border border-white/10 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center relative z-10 shadow-2xl transition-all duration-500 ${liveStatus === 'speaking' ? 'scale-105 border-emerald-500/50' : ''}`}>
                <svg className={`w-12 h-12 transition-colors duration-300 ${liveStatus === 'connected' || liveStatus === 'speaking' ? 'text-emerald-400' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            </div>
            
            {liveStatus === 'connecting' && (
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/50 border-t-transparent animate-spin z-20"></div>
            )}
        </div>
        
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">
                {liveStatus === 'disconnected' ? 'Live Wealth Coach' : 
                 liveStatus === 'connecting' ? 'Establishing Uplink...' :
                 liveStatus === 'connected' ? 'Listening...' : 'Speaking...'}
            </h2>
            <p className="text-slate-400 h-6">
                {liveStatus === 'disconnected' ? 'Start a real-time voice session with your personal AI advisor.' :
                 liveStatus === 'connected' ? 'Go ahead, I\'m listening.' : 
                 liveStatus === 'speaking' ? 'Gemini 2.5 Live' : ''}
            </p>
        </div>
        
        <button 
            className={`${ACTION_BUTTON} px-10 py-4 text-lg rounded-full shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] ${liveStatus !== 'disconnected' ? 'bg-rose-600 hover:bg-rose-500 border-rose-500/20 shadow-rose-900/40' : ''}`} 
            onClick={toggleLiveSession}
        >
            {liveStatus === 'disconnected' ? 'Start Session' : 'End Session'}
        </button>
    </div>
  );

  return (
    <HashRouter>
      <div className="flex h-screen w-full bg-[#0f172a] text-slate-100 overflow-hidden font-sans selection:bg-emerald-500/30 relative">
        <WealthFluid score={metrics.wealthScore} />
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-72 flex-col z-30 h-full border-r border-white/5 bg-slate-900/30 backdrop-blur-2xl shadow-2xl">
          <Sidebar currentView={currentView} setView={setCurrentView} />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 relative flex flex-col overflow-hidden z-10 w-full">
           {currentView === ViewState.MASTERMIND ? (
              // Chat View (Handles its own scrolling)
              renderMastermind()
           ) : (
              // Standard Scrollable Views
              <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar">
                  <div className="p-4 md:p-8 pb-32 md:pb-12 max-w-7xl mx-auto w-full">
                    {currentView === ViewState.DASHBOARD && renderDashboard()}
                    {currentView === ViewState.JOBS && renderJobs()}
                    {currentView === ViewState.HEALTH && renderHealth()}
                    {currentView === ViewState.LIVE_COACH && renderLiveCoach()}
                  </div>
              </div>
           )}
           
           {/* Mobile Bottom Nav (Fixed over content) */}
           <div className="md:hidden absolute bottom-0 left-0 right-0 z-50">
              <BottomNav currentView={currentView} setView={setCurrentView} />
           </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;