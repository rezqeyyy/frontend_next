// src/hooks/usePredictions.ts
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/actions/auth';

export function usePredictions() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // State Progress Predict
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictProgress, setPredictProgress] = useState(0);
  const [predictError, setPredictError] = useState(false);
  
  const isPredictingRef = useRef(false);

  useEffect(() => {
    fetchResults();
    autoPredictAllDatabase();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (!isPredictingRef.current && !predictError) {
          autoPredictAllDatabase();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predictError]);

  const fetchResults = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const user = await getCurrentUser() as any;
      if (!user || !user.id) {
        setErrorMsg('Gagal verifikasi session. Silakan login ulang.');
        setLoading(false);
        return;
      }

      const { data: userDatasets, error: dsError } = await supabase
        .from('datasets')
        .select('id')
        .eq('user_id', user.id);

      if (dsError) throw dsError;

      const datasetIds = userDatasets?.map(d => d.id) || [];
      if (datasetIds.length === 0) {
        setCustomers([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .in('dataset_id', datasetIds) 
        .order('churn_risk_score', { ascending: false })
        .limit(5000);

      if (error) throw error;
      setCustomers(data || []);

    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menarik data prediksi.');
    } finally {
      setLoading(false);
    }
  };

  const runPredictionSilent = async (customerData: any) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData), 
      });

      if (!response.ok) return false;
      const predictionResult = await response.json();

      const newScore = Math.round(predictionResult.risk_score);
      const newRank = predictionResult.risk_category;
      const newRevenue = Math.round(predictionResult.revenue_at_risk);

      const { error: supabaseError } = await supabase
        .from('customers')
        .update({
          churn_risk_score: newScore,
          rank_level: newRank,
          revenue_at_risk: newRevenue,
        })
        .eq('id', customerData.id);

      if (supabaseError) throw supabaseError;
      
      setCustomers((prevData) => {
        const updatedData = prevData.map((c) => 
          c.id === customerData.id 
            ? { ...c, churn_risk_score: newScore, rank_level: newRank, revenue_at_risk: newRevenue }
            : c
        );
        return updatedData.sort((a, b) => (b.churn_risk_score || 0) - (a.churn_risk_score || 0));
      });
      return true;

    } catch (error) {
      console.error(`Gagal auto-predict untuk ID: ${customerData.id}:`, error);
      return false; 
    }
  };

  const autoPredictAllDatabase = async () => {
    if (isPredictingRef.current) return; 
    try {
      setPredictError(false);
      const user = await getCurrentUser() as any;
      if (!user || !user.id) return;

      const { data: userDatasets } = await supabase.from('datasets').select('id').eq('user_id', user.id);
      const datasetIds = userDatasets?.map(d => d.id) || [];
      if (datasetIds.length === 0) return;
      
      const { count: totalDataCount, error: countError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .in('dataset_id', datasetIds); 

      const { data: allUnpredicted, error } = await supabase
        .from('customers')
        .select('*')
        .in('dataset_id', datasetIds) 
        .or('rank_level.is.null,rank_level.eq.-');

      if (error || countError) throw error || countError;
      if (!allUnpredicted || allUnpredicted.length === 0) return;

      isPredictingRef.current = true;
      setIsPredicting(true);

      const total = totalDataCount || 1;
      let completed = total - allUnpredicted.length; 
      setPredictProgress(Math.round((completed / total) * 100));

      for (let i = 0; i < allUnpredicted.length; i++) {
        if (!isPredictingRef.current) break;
        const success = await runPredictionSilent(allUnpredicted[i]);
        if (!success) throw new Error(`Gagal memprediksi data ID: ${allUnpredicted[i].id}`);
        
        completed++;
        setPredictProgress(Math.round((completed / total) * 100));
      }

      if (isPredictingRef.current) {
        setTimeout(() => {
          setIsPredicting(false);
          isPredictingRef.current = false;
          fetchResults(); // Refresh akhir
        }, 1000);
      }
    } catch (err) {
      console.error("Error saat mass predict:", err);
      setPredictError(true); 
      isPredictingRef.current = false;
    }
  };

  return {
    customers, loading, errorMsg, isPredicting, predictProgress, predictError
  };
}