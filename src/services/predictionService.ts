import { supabase } from '@/lib/supabase';

export interface CustomerData {
  id: string;
  customer_id: string;
  churn_risk_score?: number;
  rank_level?: string;
  revenue_at_risk?: number;
  [key: string]: any;
}

export const predictionService = {
  /**
   * Fetches all dataset IDs belonging to a specific user
   */
  async getUserDatasetIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('datasets')
      .select('id')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map(d => d.id) || [];
  },

  /**
   * Fetches customer prediction results based on dataset IDs
   */
  async getPredictionResults(datasetIds: string[]): Promise<CustomerData[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .in('dataset_id', datasetIds)
      .order('churn_risk_score', { ascending: false })
      .limit(5000);

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetches total count and records of customers that haven't been predicted yet
   */
  async getUnpredictedCustomers(datasetIds: string[]) {
    const { count: totalCount, error: countError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .in('dataset_id', datasetIds);

    const { data: unpredictedData, error: dataError } = await supabase
      .from('customers')
      .select('*')
      .in('dataset_id', datasetIds)
      .or('rank_level.is.null,rank_level.eq.-');

    if (countError || dataError) throw countError || dataError;

    return {
      totalCount: totalCount || 1,
      unpredictedCustomers: unpredictedData || []
    };
  },

  /**
   * Sends customer metrics to ML server and updates Supabase with the results
   */
  async executeSinglePrediction(customer: CustomerData): Promise<{ score: number; rank: string; revenue: number }> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    const response = await fetch(`${apiUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });

    if (!response.ok) {
      throw new Error(`ML server returned status ${response.status}`);
    }

    const predictionResult = await response.json();
    const score = Math.round(predictionResult.risk_score);
    const rank = predictionResult.risk_category;
    const revenue = Math.round(predictionResult.revenue_at_risk);

    const { error: supabaseError } = await supabase
      .from('customers')
      .update({
        churn_risk_score: score,
        rank_level: rank,
        revenue_at_risk: revenue,
      })
      .eq('id', customer.id);

    if (supabaseError) throw supabaseError;

    return { score, rank, revenue };
  }
};