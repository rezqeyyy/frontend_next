'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { CsvDropzone } from '@/components/upload/CsvDropzone';
import { UploadRequirements } from '@/components/upload/UploadRequirements';
import { useCsvUpload } from '@/hooks/useCsvUpload';

export default function UploadCsvPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isUploading, status, message, parseAndUpload } = useCsvUpload();

  return (
    <div className="p-4 pt-24 sm:p-6 sm:pt-28 max-w-[1000px] mx-auto w-full">
      {/* Header Halaman */}
      <header className="mb-8">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-2">Upload Customer Data</h1>
        <p className="text-gray-500 text-[15px]">Analyze churn risk by uploading your CSV file</p>
      </header>

      {/* Kartu Utama (Putih) */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
        
        {/* Area Dropzone */}
        <CsvDropzone 
          file={selectedFile} 
          isUploading={isUploading}
          onFileSelect={setSelectedFile}
          onUpload={() => selectedFile && parseAndUpload(selectedFile)}
        />

        {/* Notifikasi Sukses/Error */}
        {status !== 'idle' && (
          <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            status === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {status === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {message}
          </div>
        )}

        {/* Area Syarat CSV */}
        <UploadRequirements />
        
      </div>
    </div>
  );
}