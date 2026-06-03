import { useState, useEffect } from 'react';
// Pake fungsi asli lu yang narik data komplit
import { fetchDashboardStats } from '@/actions/dashboard'; 

export function useDashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        const data = await fetchDashboardStats();
        if (isMounted) {
          if (!data.error) {
            setStats(data);
          } else {
            console.error("Gagal load dashboard stats:", data.error);
          }
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    };

    loadStats();
    return () => { isMounted = false; };
  }, []);

  return { stats, loadingStats };
}