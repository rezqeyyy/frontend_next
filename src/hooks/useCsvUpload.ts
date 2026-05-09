// src/hooks/useCsvUpload.ts
import { useState } from 'react';
import Papa from 'papaparse';
import { supabase } from '@/lib/supabase';

export function useCsvUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const parseAndUpload = async (file: File, userId: string, mode: 'merge' | 'replace') => { 
    setIsUploading(true);
    setStatus('idle');

    try {
      if (!userId) throw new Error("Sesi habis jink. Refresh dulu.");

      let currentDatasetId: string;
      const { data: existingDataset } = await supabase.from('datasets').select('id').eq('user_id', userId).maybeSingle();

      if (existingDataset) {
        currentDatasetId = existingDataset.id;
        if (mode === 'replace') {
          await supabase.from('customers').delete().eq('dataset_id', currentDatasetId);
        }
      } else {
        const { data: newDs } = await supabase.from('datasets').insert([{ filename: file.name, user_id: userId }]).select('id').single();
        currentDatasetId = newDs!.id;
      }

      const formattedData = await new Promise<any[]>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
          complete: (results) => {
            const n = (v: any) => (v !== undefined && v !== null && v !== '') ? Number(v) : 0;
            const data = results.data
              .filter((row: any) => row.customer_id)
              .map((row: any) => ({
                dataset_id: currentDatasetId,
                customer_id: row.customer_id.trim(),
                recorded_month: row.date ? row.date.trim() : 'Unknown',
                total_users: n(row.total_users),
                monthly_usage_hrs: n(row.monthly_usage_hrs),
                feature_adoption_pct: n(row.feature_adoption_pct),
                sum_payment_value: n(row.sum_payment_value),
                average_payment_value: n(row.average_payment_value),
                maximum_payment_value: n(row.maximum_payment_value),
                minimum_payment_value: n(row.minimum_payment_value),
                average_payment_delay: n(row.average_payment_delay),
                count_record_type_x: n(row.count_record_type_x),
                average_nps_score: n(row.average_nps_score),
                count_record_type_y: n(row.count_record_type_y),
                maximum_nps_score: n(row.maximum_nps_score),
                minimum_nps_score: n(row.minimum_nps_score),
                count_ticket_id: n(row.count_ticket_id),
                count_ticket_id_account: n(row.count_ticket_id_account),
                count_ticket_id_billing: n(row.count_ticket_id_billing),
                count_ticket_id_feature_request: n(row.count_ticket_id_feature_request),
                count_ticket_id_onboarding: n(row.count_ticket_id_onboarding),
                count_ticket_id_technical: n(row.count_ticket_id_technical),
                inactivity_days: n(row.inactivity_days),
                subscription_age: n(row.subscription_age),
                log_usage: n(row.log_usage),
                usage_per_user: n(row.usage_per_user),
                low_usage_flag: n(row.low_usage_flag),
                engagement_score: n(row.engagement_score),
                inactivity_ratio: n(row.inactivity_ratio),
                support_intensity: n(row.support_intensity),
                ticket_per_user_ratio: n(row.ticket_per_user_ratio),
                ticket_per_month: n(row.ticket_per_month),
                high_ticket_flag: n(row.high_ticket_flag),
                late_payment_flag: n(row.late_payment_flag),
                payment_instability: n(row.payment_instability),
                payment_per_user: n(row.payment_per_user),
                plan_type_num: n(row.plan_type_num),
                starter_plan_flag: n(row.starter_plan_flag),
                risk_score_simple: n(row.risk_score_simple),
                payment_risk_score: n(row.payment_risk_score),
                rfm_score: n(row.rfm_score),
                usage_x_inactivity: n(row.usage_x_inactivity),
                payment_min_max_ratio: n(row.payment_min_max_ratio),
                underutilization_score: n(row.underutilization_score),
                loyalty_score: n(row.loyalty_score),
                engagement_decay: n(row.engagement_decay),
                plan_x_usage: n(row.plan_x_usage),
                composite_risk: n(row.composite_risk),
                churn_actual: n(row.churn_actual),
                churn_risk_score: 0,
                rank_level: '-',
                revenue_at_risk: 0
              }));
            resolve(data);
          }
        });
      });

      const { error: uploadError } = await supabase
        .from('customers')
        .upsert(formattedData, { onConflict: 'customer_id,recorded_month,dataset_id' });

      if (uploadError) throw new Error(uploadError.message);
      setStatus('success');
      setMessage(mode === 'replace' ? "Data lama dibuang, data baru masuk!" : "Data digabung tanpa duplikat!");
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, status, message, parseAndUpload };
}