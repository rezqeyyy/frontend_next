// src/hooks/useDashboardStats.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/actions/auth';

export function useDashboardStats() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const user = await getCurrentUser() as any;
        if (!user) return;

        // 1. Ambil dataset milik user
        const { data: datasets } = await supabase
          .from('datasets')
          .select('id')
          .eq('user_id', user.id);
        
        const datasetIds = datasets?.map(d => d.id) || [];

        if (datasetIds.length === 0) {
          setChartData([]);
          setLoading(false);
          return;
        }

        // 2. Ambil semua customer & skor churn-nya
        const { data: customers, error } = await supabase
          .from('customers')
          .select('churn_risk_score, created_at')
          .in('dataset_id', datasetIds)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (customers && customers.length > 0) {
          // 3. Kelompokkan data berdasarkan tanggal & hitung rata-rata
          const grouped = customers.reduce((acc: any, curr: any) => {
            // Format tanggal jadi "1 Apr", "10 Apr", dll.
            const date = new Date(curr.created_at).toLocaleDateString('id-ID', { 
              day: 'numeric', 
              month: 'short' 
            });

            if (!acc[date]) {
              acc[date] = { sum: 0, count: 0 };
            }
            acc[date].sum += curr.churn_risk_score || 0;
            acc[date].count += 1;
            return acc;
          }, {});

          // 4. Format data buat Recharts
          const formattedData = Object.keys(grouped).map(date => ({
            name: date,
            value: Math.round(grouped[date].sum / grouped[date].count) // Rata-rata skor per hari
          }));

          setChartData(formattedData);
        }
      } catch (error) {
        console.error("Gagal narik data dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  // HOOK cuma boleh return data, bukan UI!
  return { chartData, loading };
}