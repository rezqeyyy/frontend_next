// src/hooks/useDashboardStats.ts

import { useState, useEffect, useMemo } from 'react';
import { fetchDashboardStats } from '@/actions/dashboard'; 
import { getCurrentUser } from '@/actions/auth';
import { predictionService, CustomerData } from '@/services/predictionService';
import { RiskData } from '@/types';

export function useDashboardStats() {
  // --- STATE BAWAAN LU (TETAP AMAN) ---
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // --- STATE BARU KHUSUS BUAT DONUT CHART ---
  const [customers, setCustomers] = useState<CustomerData[]>([]);

  useEffect(() => {
    let isMounted = true;
    
    const loadAllData = async () => {
      setLoadingStats(true);
      try {
        // 1. JALANIN API BAWAAN LU (Biar KPI, Line Chart, dan Alerts lu tetep jalan normal)
        const statsData = await fetchDashboardStats();
        if (isMounted) {
          if (!statsData.error) {
            setStats(statsData);
          } else {
            console.error("Gagal load dashboard stats:", statsData.error);
          }
        }

        // 2. TARIK 900 DATA ASLI (Khusus buat Donut Chart doang)
        const user = await getCurrentUser() as any;
        if (user && user.id) {
          const datasetIds = await predictionService.getUserDatasetIds(user.id);
          if (datasetIds.length > 0) {
            const realCustomers = await predictionService.getPredictionResults(datasetIds);
            if (isMounted) setCustomers(realCustomers);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    };

    loadAllData();
    return () => { isMounted = false; };
  }, []);

  // 3. HITUNG DONUT CHART PAKE 900 DATA ASLI LU
  const riskDistributionData = useMemo<RiskData[]>(() => {
    if (!customers || customers.length === 0) return [];

    let high = 0;
    let medium = 0;
    let low = 0;

    customers.forEach(c => {
      const rank = c.rank_level?.toLowerCase() || '';
      if (rank === 'high') high++;
      else if (rank === 'medium') medium++;
      else if (rank === 'low') low++;
    });

    const total = high + medium + low;
    if (total === 0) return [];

    return [
      { id: 'high', label: 'High Risk', value: high, percentage: Number(((high/total)*100).toFixed(1)), color: '#FF4D4F' },
      { id: 'medium', label: 'Medium Risk', value: medium, percentage: Number(((medium/total)*100).toFixed(1)), color: '#FFC53D' },
      { id: 'low', label: 'Low Risk', value: low, percentage: Number(((low/total)*100).toFixed(1)), color: '#50C878' }
    ];
  }, [customers]);

  return { 
    stats, // Ini ngembaliin data asli lu (gak disentuh)
    loadingStats, 
    riskDistributionData // Ini ngembaliin hitungan 900 data buat donatnya
  };
}