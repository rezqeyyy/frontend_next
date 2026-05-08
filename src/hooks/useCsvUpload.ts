import { useState } from 'react';
import Papa from 'papaparse';
import { customerService } from '@/services/customerService';
import { supabase } from '@/lib/supabase';

export function useCsvUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const parseAndUpload = async (file: File) => {
        // Ambil ID user yang login
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            alert("Login dulu bro!");
            return;
        }

        Papa.parse(file, {
            header: true,
            transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
            complete: async (results) => {
            const formattedData = results.data
                .filter((row: any) => row.customer_id)
                .map((row: any) => ({
                ...row, // Ambil semua kolom dari CSV
                user_id: user.id, // <--- WAJIB ADA BIAR GAK ERROR RLS
                churn_risk_score: 0,
                rank_level: '-',
                segment: '-',
                revenue_at_risk: 0
                }));

            // Kirim ke database
            const { error } = await supabase.from('customers').upsert(formattedData);
            
            if (error) console.error("Gagal upload:", error.message);
            else alert("Data berhasil masuk ke akun lu!");
            }
        });
    };

    return { isUploading, status, message, parseAndUpload };
}