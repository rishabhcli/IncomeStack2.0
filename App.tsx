import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Components & Services
import WealthFluid from './components/WealthFluid';
import Navigation from './components/Navigation';
import JobCard from './components/JobCard';
import { Job, ViewState, ChatMessage, WealthMetrics } from './types';
import { GLASS_PANEL, GLASS_INPUT, ACTION_BUTTON, NEON_TEXT, MOCK_JOBS, MOCK_METRICS } from './constants';
import * as geminiService from './services/geminiService';

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [metrics, setMetrics] = useState<WealthMetrics>(MOCK_METRICS);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  
  // Search Grounding State
  const [marketQuery, setMarketQuery] = useState('');
  const [marketData, setMarketData] = useState<{text: string, grounding: any[]} | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Vision Board State
  const [visionPrompt, setVisionPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  // Handle Mastermind Chat with Thinking Model
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

  // Handle Market Search (Grounding)
  const handleMarketSearch = async () => {
    if (!marketQuery) return;
    setIsSearching(true);
    const result = await geminiService.getMarketInsights(marketQuery);
    setMarketData(result);
    setIsSearching(false);
  };

  // Handle Image Gen
  const handleGenerateImage = async () => {
    if (!visionPrompt) return;
    setIsGeneratingImg(true);
    const imgData = await geminiService.generateVisionBoardImage(visionPrompt, "1K");
    if (imgData) setGeneratedImage(imgData);
    setIsGeneratingImg(false);
  };

  // --- RENDER FUNCTIONS FOR VIEWS ---

  const renderDashboard = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${GLASS_PANEL} p-6 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05 1.18 1.91 2.53 1.91 1.33 0 2.26-.87 2.26-1.94 0-1.02-.59-1.52-1.59-1.69l-.8-.13c-2.02-.34-3.35-1.29-3.35-3.31 0-1.84 1.4-3.03 3.12-3.35V4h2.67v1.93c1.38.27 2.64 1.15 2.89 2.77h-1.96c-.25-1.12-1.14-1.71-2.22-1.71-1.32 0-2.12.86-2.12 1.77 0 1.05.7 1.47 1.88 1.67l.8.13c2.19.38 3.37 1.37 3.37 3.33 0 1.87-1.31 3.11-3.23 3.48z"/></svg>
          </div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Net Worth</p>
          <h2 className="text-4xl font-bold text-white mt-2">${metrics.balance.toLocaleString()}</h2>
          <div className="mt-4 flex items-center text-emerald-400 text-sm">
            <span>+12.5% this month</span>
          </div>
        </div>

        <div className={`${GLASS_PANEL} p-6`}>
           <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Burnout Risk</p>
           <div className="mt-4 flex items-end gap-2">
             <span className="text-4xl font-bold text-white">{metrics.burnoutRisk}%</span>
             <span className="text-sm text-slate-400 mb-2">/ 100</span>
           </div>
           <div className="w-full bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
             <div 
                className={`h-full rounded-full transition-all duration-1000 ${metrics.burnoutRisk > 70 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                style={{ width: `${metrics.burnoutRisk}%` }}
             ></div>
           </div>
           <p className="text-xs text-slate-500 mt-2">Biometric sync active: HRV stable.</p>
        </div>

        <div className={`${GLASS_PANEL} p-6`}>
           <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Wealth Fluid Viscosity</p>
           <div className="mt-2 text-2xl text-white font-light">
             State: <span className="text-emerald-300 font-bold">Liquid Gold</span>
           </div>
           <p className="text-slate-400 text-sm mt-4">
             Background simulation reacting to portfolio performance.
           </p>
        </div>
      </div>

      {/* Market Grounding Widget */}
      <div className={`${GLASS_PANEL} p-6`}>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
           <span className="text-blue-400">●</span> Market Intelligence 
           <span className="text-xs font-normal text-slate-500 border border-slate-700 px-2 py-0.5 rounded ml-2">Google Search Grounding</span>
        </h3>
        <div className="flex gap-4 mb-4">
          <input 
            type="text" 
            value={marketQuery}
            onChange={(e) => setMarketQuery(e.target.value)}
            placeholder="Ask about market trends (e.g., 'Crypto AI tokens performance')"
            className={`${GLASS_INPUT} flex-1`}
          />
          <button onClick={handleMarketSearch} className={ACTION_BUTTON} disabled={isSearching}>
            {isSearching ? 'Analyzing...' : 'Search'}
          </button>
        </div>
        {marketData && (
          <div className="bg-black/20 p-4 rounded-xl border border-white/5">
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{marketData.text}</p>
            {marketData.grounding && marketData.grounding.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {marketData.grounding.map((chunk: any, i: number) => (
                  <a key={i} href={chunk.web?.uri} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 bg-blue-900/20 px-2 py-1 rounded">
                    {chunk.web?.title || 'Source'} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className={`${GLASS_PANEL} p-6 h-80`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={[
            {name: 'Jan', val: 12000}, {name: 'Feb', val: 12500}, {name: 'Mar', val: 11800},
            {name: 'Apr', val: 13200}, {name: 'May', val: 13900}, {name: 'Jun', val: 14250}
          ]}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
              itemStyle={{ color: '#34d399' }}
            />
            <Area type="monotone" dataKey="val" stroke="#10b981" fillOpacity={1} fill="url(#colorVal)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Targeted Opportunities</h2>
        <div className="flex gap-2">
             <span className="text-xs text-emerald-400 bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-500/30">
               AI Matching Active
             </span>
        </div>
      </div>
      
      {MOCK_JOBS.map(job => (
        <JobCard key={job.id} job={job} onAnalyze={(j) => console.log('Analyze', j)} />
      ))}
      
      {/* Visual Board Generator */}
       <div className={`${GLASS_PANEL} p-6 mt-8`}>
        <h3 className="text-xl font-bold text-white mb-2">Vision Board Generator</h3>
        <p className="text-slate-400 text-sm mb-4">Manifest your career goals using Nano Banana Pro (Gemini 3 Image).</p>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Describe your dream office or career milestone..."
            className={`${GLASS_INPUT} flex-1`}
            value={visionPrompt}
            onChange={(e) => setVisionPrompt(e.target.value)}
          />
          <button 
             onClick={handleGenerateImage}
             disabled={isGeneratingImg}
             className={ACTION_BUTTON}
          >
            {isGeneratingImg ? 'Generating...' : 'Visualize 4K'}
          </button>
        </div>
        {generatedImage && (
          <div className="mt-6 rounded-xl overflow-hidden border border-white/20 shadow-2xl">
            <img src={generatedImage} alt="Vision Board" className="w-full h-auto" />
          </div>
        )}
      </div>
    </div>
  );

  const renderMastermind = () => (
    <div className={`h-[calc(100vh-8rem)] ${GLASS_PANEL} flex flex-col overflow-hidden animate-fadeIn`}>
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
        <div>
          <h3 className="text-white font-bold text-lg">Wealth Coach AI</h3>
          <p className="text-xs text-emerald-400">Gemini 3 Pro • Thinking Mode Enabled</p>
        </div>
        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            <p>Ask complex questions. I will think before I answer.</p>
          </div>
        )}
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-br-none' 
                : 'bg-white/10 text-slate-100 rounded-bl-none backdrop-blur-md border border-white/5'
            }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isThinking && (
           <div className="flex justify-start">
             <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-bl-none border border-white/5 flex items-center gap-2">
               <div className="flex gap-1">
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
               </div>
               <span className="text-xs text-slate-400 italic">Reasoning (Budget: 32k tokens)...</span>
             </div>
           </div>
        )}
      </div>

      <div className="p-4 bg-black/20 border-t border-white/10">
        <form onSubmit={handleChatSubmit} className="flex gap-3">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about strategy, negotiations, or macro-economics..."
            className={`${GLASS_INPUT} flex-1`}
          />
          <button type="submit" disabled={isThinking} className={ACTION_BUTTON}>
            Send
          </button>
        </form>
      </div>
    </div>
  );

  const renderLiveCoach = () => (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] animate-fadeIn">
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-75 duration-1000"></div>
        <div className="absolute inset-4 bg-emerald-500/30 rounded-full animate-pulse duration-[3s]"></div>
        <div className="relative z-10 w-48 h-48 bg-black/40 backdrop-blur-xl border border-emerald-500/50 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)]">
          <svg className="w-20 h-20 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
        </div>
      </div>
      <h2 className="text-3xl font-bold text-white mb-4">Gemini Live Audio</h2>
      <p className="text-slate-400 text-center max-w-md mb-8">
        Real-time conversational voice coaching. Connects directly to the Live API (WebSocket) for low-latency advice.
      </p>
      <button 
        className={`${ACTION_BUTTON} px-8 py-4 text-lg rounded-full flex items-center gap-3`}
        onClick={() => alert("Simulating Live Connection... (Requires Backend/Socket Proxy for browser)")}
      >
        <span>Start Conversation</span>
      </button>
    </div>
  );

  return (
    <HashRouter>
      <div className="flex h-screen w-screen overflow-hidden text-slate-200">
        <WealthFluid score={metrics.wealthScore} />
        
        {/* Sidebar */}
        <div className="w-64 hidden md:block border-r border-white/5 bg-slate-900/50 backdrop-blur-2xl z-20">
          <Navigation currentView={currentView} setView={setCurrentView} />
        </div>

        {/* Mobile Navigation Toggle (Placeholder) */}
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
          <div className="max-w-7xl mx-auto p-6 md:p-12">
            {currentView === ViewState.DASHBOARD && renderDashboard()}
            {currentView === ViewState.JOBS && renderJobs()}
            {currentView === ViewState.MASTERMIND && renderMastermind()}
            {currentView === ViewState.LIVE_COACH && renderLiveCoach()}
            {currentView === ViewState.HEALTH && (
               <div className="flex items-center justify-center h-full text-slate-500">
                 Health Integration Module (See Dashboard for Summary)
               </div>
            )}
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;