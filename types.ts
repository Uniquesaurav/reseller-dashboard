

export interface Account {
  id: string;
  service: string;
  email: string;
  password: string; // In a real app, this would be encrypted or hidden
  plan: string;
  region: string;
  duration: '1 Month' | '3 Months' | '6 Months' | '1 Year';
  generatedAt: string;
  expiresAt: string;
  status: 'Active' | 'Sold' | 'Revoked' | 'Expired' | 'Paused';
  remainingTimeMs?: number;
  originalPassword?: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  GENERATOR = 'GENERATOR',
  INVENTORY = 'INVENTORY',
  LIVE_SUPPORT = 'LIVE_SUPPORT',
}

export interface GenerationStats {
  totalGenerated: number;
  activeStock: number;
  credits: number;
  revenue: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'reseller';
  avatar?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  credits: number;
  status: 'Completed' | 'Failed' | 'Pending';
  method: 'Credit Card' | 'PayPal' | 'Crypto';
}