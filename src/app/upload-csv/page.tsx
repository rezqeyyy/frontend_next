// src/app/upload-csv/page.tsx
'use client';

import { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import Papa from 'papaparse';
import { supabase } from '@/lib/supabase';

export default function UploadCsvPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    setStatus('idle');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_'),
      complete: async (results) => {
        try {
          const validData = results.data.filter((row: any) => {
            return (row.name && row.name.toString().trim() !== '') || 
                   (row.customer_id && row.customer_id.toString().trim() !== ''); 
          });

          if (validData.length === 0) throw new Error("Tidak ada data valid.");

          const parseNum = (val: any) => {
            if (val === undefined || val === null || val.toString().trim() === '') return null;
            const cleanVal = val.toString().replace(/,/g, ''); 
            const num = Number(cleanVal);
            return isNaN(num) ? null : num;
          };

          const formattedData = validData.map((row: any) => {
            let customerName = "Unknown Customer";
            if (row.name && row.name.toString().trim() !== '') {
              customerName = row.name.toString().trim();
            } else if (row.customer_id && row.customer_id.toString().trim() !== '') {
              customerName = `Customer - ${row.customer_id.toString().trim()}`;
            }

            return {
              name: customerName,
              churn_risk_score: parseNum(row.churn_risk_score) || 0,
              rank_level: row.rank_level || null,
              segment: row.segment || null,
              revenue_at_risk: parseNum(row.revenue_at_risk) || 0,
              level_activity: row.level_activity || null,

              // RAW DATA (SESUAI CSV ASLI)
              customer_id: row.customer_id || null,
              plan_type: row.plan_type || null,
              contract_type: row.contract_type || null,
              join_date: row.join_date || null,
              total_users: parseNum(row.total_users),
              monthly_usage_hrs: parseNum(row.monthly_usage_hrs),
              last_login_days: parseNum(row.last_login_days),
              total_revenue: parseNum(row.total_revenue),
              total_tickets: parseNum(row.total_tickets),
            };
          });

          const { error } = await supabase.from('customers').upsert(formattedData, {
            onConflict: 'customer_id' // Patokan update data
          });

          if (error) throw error;

          setStatus('success');
          setMessage(`${formattedData.length} data pelanggan berhasil diunggah!`);
          setFile(null);
        } catch (err: any) {
          setStatus('error');
          setMessage(err.message || 'Terjadi kesalahan saat mengunggah data.');
        } finally {
          setIsUploading(false);
        }
      },
    });
  };

  return (
    // Penyesuaian padding top (pt-24) agar tidak tertutup navbar di mode HP
    <div className="p-4 pt-24 sm:p-6 sm:pt-28 lg:p-8 max-w-[1200px] mx-auto text-gray-800 w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-[24px] md:text-[28px] font-bold text-gray-900 leading-tight">Upload CSV</h1>
        <p className="text-gray-400 mt-1 text-sm">Upload customer data for churn prediction analysis</p>
      </div>

      <div className="bg-white p-5 md:p-8 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] max-w-2xl w-full">
        {/* Kotak Putus-putus Upload */}
        <div className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-xl p-6 md:p-10 flex flex-col items-center justify-center text-center">
          <UploadCloud size={40} className="text-blue-400 mb-4 md:w-12 md:h-12" />
          <h3 className="font-semibold text-gray-800 mb-1">Pilih File CSV</h3>
          <p className="text-xs text-gray-500 mb-6">Pastikan file memiliki header yang sesuai</p>
          
          <input 
            type="file" 
            accept=".csv" 
            id="csv-upload" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <label 
            htmlFor="csv-upload" 
            className="w-full sm:w-auto bg-white border border-blue-200 text-blue-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 cursor-pointer transition shadow-sm inline-block"
          >
            Browse Files
          </label>
        </div>

        {/* Informasi File & Tombol Upload (Stack di HP, sejajar di Desktop) */}
        {file && (
          <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 gap-4 sm:gap-0">
            {/* Sisi Kiri: Ikon & Nama File */}
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
              <FileText size={20} className="text-gray-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                {/* truncate: memotong teks kepanjangan dengan "..." */}
                <p className="text-sm font-medium text-gray-700 truncate" title={file.name}>{file.name}</p>
                <p className="text-[11px] text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            
            {/* Sisi Kanan: Tombol Upload Data */}
            <button 
              onClick={handleUpload} 
              disabled={isUploading}
              className={`w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-lg text-sm font-medium text-white transition flex-shrink-0 ${isUploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200'}`}
            >
              {isUploading ? 'Uploading...' : 'Upload Data'}
            </button>
          </div>
        )}

        {/* Pesan Sukses */}
        {status === 'success' && (
          <div className="mt-5 p-4 bg-green-50 text-green-700 text-sm rounded-lg flex items-start sm:items-center gap-3 border border-green-100">
            <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" /> 
            <span>{message}</span>
          </div>
        )}

        {/* Pesan Error */}
        {status === 'error' && (
          <div className="mt-5 p-4 bg-red-50 text-red-700 text-sm rounded-lg flex items-start sm:items-center gap-3 border border-red-100">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5 sm:mt-0" /> 
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}