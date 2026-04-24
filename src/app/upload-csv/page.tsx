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
      complete: async (results) => {
        try {
          // Format data agar sesuai dengan tipe data di Supabase
          const formattedData = results.data.map((row: any) => ({
            name: row.name,
            churn_risk_score: parseInt(row.churn_risk_score) || 0,
            rank_level: row.rank_level,
            segment: row.segment,
            revenue_at_risk: parseFloat(row.revenue_at_risk) || 0,
            level_activity: row.level_activity,
          }));

          // Insert ke Supabase
          const { error } = await supabase.from('customers').insert(formattedData);

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
    <div className="p-8 max-w-[1200px] mx-auto text-gray-800">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Upload CSV</h1>
        <p className="text-gray-400 mt-1 text-sm">Upload customer data for churn prediction analysis</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] max-w-2xl">
        <div className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-xl p-10 flex flex-col items-center justify-center text-center">
          <UploadCloud size={48} className="text-blue-400 mb-4" />
          <h3 className="font-semibold text-gray-800 mb-1">Pilih File CSV</h3>
          <p className="text-xs text-gray-500 mb-6">Pastikan file memiliki header yang sesuai (name, churn_risk_score, dll)</p>
          
          <input 
            type="file" 
            accept=".csv" 
            id="csv-upload" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <label 
            htmlFor="csv-upload" 
            className="bg-white border border-blue-200 text-blue-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 cursor-pointer transition shadow-sm"
          >
            Browse Files
          </label>
        </div>

        {file && (
          <div className="mt-5 flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                <p className="text-[11px] text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button 
              onClick={handleUpload} 
              disabled={isUploading}
              className={`px-5 py-2 rounded-lg text-sm font-medium text-white transition ${isUploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200'}`}
            >
              {isUploading ? 'Uploading...' : 'Upload Data'}
            </button>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-5 p-4 bg-green-50 text-green-700 text-sm rounded-lg flex items-center gap-2 border border-green-100">
            <CheckCircle2 size={18} className="text-green-600" /> {message}
          </div>
        )}

        {status === 'error' && (
          <div className="mt-5 p-4 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2 border border-red-100">
            <AlertCircle size={18} className="text-red-600" /> {message}
          </div>
        )}
      </div>
    </div>
  );
}