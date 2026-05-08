'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { CsvDropzone } from '@/components/upload/CsvDropzone';
import { UploadRequirements } from '@/components/upload/UploadRequirements';
import { useCsvUpload } from '@/hooks/useCsvUpload';
import { getCurrentUser } from '@/actions/auth'; 

export default function UploadCsvPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isUploading, status, message, parseAndUpload } = useCsvUpload();
  
  // STATE UNTUK NYIMPEN USER DAN STATUS LOADING
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // TARIK DATA PAS HALAMAN DIBUKA (Paling aman buat Next.js Cookie)
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser() as any;
        
        // BUKA CONSOLE F12 LU DAN CEK TULISAN INI:
        console.log("CEK JEROAN USER DARI SERVER:", user); 
        
        if (user && user.id) {
          setActiveUserId(user.id);
        } else if (user && !user.id) {
          console.error("FATAL: Data user dapet, tapi properti 'id'-nya GAK ADA! Cek src/actions/auth.ts lu.");
        }
      } catch (error) {
        console.error("Error saat fetch user:", error);
      } finally {
        setIsAuthLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleUpload = () => {
    if (!selectedFile) return;
    
    // Kalau activeUserId masih null pas diklik
    if (!activeUserId) {
      alert("Gagal upload! ID Akun lu nggak ditemuin. Buka console (F12) buat liat log-nya.");
      return;
    }
    
    parseAndUpload(selectedFile, activeUserId);
  };

  return (
    <div className="p-4 pt-24 sm:p-6 sm:pt-28 max-w-[1000px] mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-2">Upload Customer Data</h1>
        <p className="text-gray-500 text-[15px]">Analyze churn risk by uploading your CSV file</p>
      </header>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
        
        {/* TAMPILAN LOADING SEMENTARA NGECEK KTP LU */}
        {isAuthLoading ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
             <Loader2 className="animate-spin text-blue-500 mb-3" size={32} />
             <p className="text-sm font-medium text-gray-500">Memverifikasi sesi akun lu...</p>
          </div>
        ) : (
          <CsvDropzone 
            file={selectedFile} 
            isUploading={isUploading}
            onFileSelect={setSelectedFile}
            onUpload={handleUpload} 
          />
        )}

        {status !== 'idle' && (
          <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            status === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {status === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {message}
          </div>
        )}

        <UploadRequirements />
        
      </div>
    </div>
  );
}