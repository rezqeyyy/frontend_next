import { useState } from 'react';
import Papa from 'papaparse';
import { customerService } from '@/services/customerService';
import { supabase } from '@/lib/supabase';

export function useCsvUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const parseAndUpload = async (file: File) => {
        setIsUploading(true);
        try {
            // 1. Buat record Dataset (Brankas) baru
            const { data: dataset, error: dsError } = await supabase
            .from('datasets')
            .insert([{ filename: file.name }])
            .select()
            .single();

            if (dsError) throw dsError;

            // 2. Parse CSV dan masukkan dataset_id ke tiap baris
            Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
            complete: async (results) => {
                const formattedData = results.data
                .filter((row: any) => row.customer_id)
                .map((row: any) => ({
                    ...row,
                    dataset_id: dataset.id, // <--- Link ke brankas, bukan login ID
                    churn_risk_score: 0,
                    rank_level: '-',
                    revenue_at_risk: 0
                }));

                // 3. Upsert ke tabel customers
                const { error: uploadError } = await supabase.from('customers').insert(formattedData);
                
                if (uploadError) throw uploadError;
                alert("Dataset berhasil diupload secara private!");
            }
            });
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsUploading(false);
        }
        };

    return { isUploading, status, message, parseAndUpload };
}