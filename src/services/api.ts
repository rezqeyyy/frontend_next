// src/services/api.ts
import { KPIData, Customer, Alert } from '@/types';

// Contoh memanggil API nyata (Bisa diganti dengan Axios nanti)
export const fetchDashboardData = async () => {
  // return fetch('https://api.domain.com/v1/dashboard').then(res => res.json());
  
  // MOCK DATA sementara sebelum backend siap:
  return {
    kpis: [
      { title: "Total Customer", value: 3000, trend: 8, isPositive: true, timeframe: "last 30 days" },
      { title: "High Risk Customer", value: 30, trend: 8, isPositive: true, timeframe: "last 30 days" },
      { title: "Revenue at Risk", value: "$284,000", trend: 10.2, isPositive: true, timeframe: "last 30 days" },
      { title: "Avg. Churn Risk Score", value: 300, trend: 8, isPositive: false, timeframe: "last 30 days" },
    ] as KPIData[],
    customers: [
      { id: "1", name: "Tatang suretang", riskScore: 82, rankLevel: "High", segment: "All Risk User", revenueAtRisk: 284000, levelActivity: "5 days ago" },
      { id: "2", name: "Tatang suretang", riskScore: 65, rankLevel: "Medium", segment: "Reguler User", revenueAtRisk: 284000, levelActivity: "5 days ago" },
      { id: "3", name: "Tatang suretang", riskScore: 35, rankLevel: "Low", segment: "Power User", revenueAtRisk: 284000, levelActivity: "5 days ago" },
    ] as Customer[]
  };
};