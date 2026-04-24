// src/types/index.ts

export interface KPIData {
  title: string;
  value: string | number;
  trend: number;
  isPositive: boolean;
  timeframe: string;
}

export interface Customer {
  id: string;
  name: string;
  riskScore: number;
  rankLevel: 'High' | 'Medium' | 'Low';
  segment: string;
  revenueAtRisk: number;
  levelActivity: string;
}

export interface Alert {
  id: string;
  type: 'danger' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
}