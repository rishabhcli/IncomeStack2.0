export interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  matchScore: number;
  tags: string[];
  description: string;
  isRemote: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface MarketData {
  title: string;
  uri: string;
  snippet: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  JOBS = 'JOBS',
  MASTERMIND = 'MASTERMIND',
  HEALTH = 'HEALTH',
  LIVE_COACH = 'LIVE_COACH'
}

export interface WealthMetrics {
  balance: number;
  monthlyIncome: number;
  burnoutRisk: number; // 0-100
  wealthScore: number; // 0-1.0 (influences fluid)
}