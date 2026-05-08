import { useState } from 'react';
import Papa from 'papaparse';
import { customerService } from '@/services/customerService';
import { supabase } from '@/lib/supabase';

export function useCsvUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    // src/hooks/useCsvUpload.ts
    const parseAndUpload = async (file: File) => {
        setIsUploading(true);
        try {
            // 1. Bikin foldernya dulu di database
            const { data: newFolder, error: folderError } = await supabase
            .from('datasets')
            .insert([{ filename: file.name }])
            .select()
            .single();

            if (folderError) throw folderError;

            // 2. Parse CSV
            Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
            complete: async (results) => {
                try {
                const formattedData = results.data
                    .filter((row: any) => row.customer_id)
                    .map((row: any) => ({
                    ...row,
                    dataset_id: newFolder.id, // <--- ID Folder lu, bukan ID Login lu
                    churn_risk_score: 0,
                    rank_level: '-',
                    revenue_at_risk: 0
                    }));

                // 3. Masukin data ke tabel teknis
                const { error: uploadError } = await supabase
                    .from('customers')
                    .insert(formattedData);

                if (uploadError) throw uploadError;
                alert("Berhasil upload ke folder pribadi lu!");
                } catch (e: any) { alert(e.message); }
            }
            });
        } catch (err: any) {
            alert("Gagal: " + err.message);
        } finally { setIsUploading(false); }
    };

    return { isUploading, status, message, parseAndUpload };
}