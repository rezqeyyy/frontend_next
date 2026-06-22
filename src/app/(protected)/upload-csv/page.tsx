// src/app/upload-csv/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Database, ListPlus, X } from 'lucide-react';
import { CsvDropzone } from '@/components/upload/CsvDropzone';
import { UploadRequirements } from '@/components/upload/UploadRequirements';
import { useCsvUpload } from '@/hooks/useCsvUpload';
import { getCurrentUser } from '@/actions/auth'; 

export default function UploadCsvPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { isUploading, status, message, parseAndUpload } = useCsvUpload();

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser() as any;
        if (user?.id) setActiveUserId(user.id);
      } finally { setIsAuthLoading(false); }
    }
    fetchUser();
  }, []);

  const handleOpenModal = () => {
    if (!selectedFile || !activeUserId) return;
    setShowConfirmModal(true);
  };

  const startUpload = (mode: 'merge' | 'replace') => {
    setShowConfirmModal(false);
    parseAndUpload(selectedFile!, activeUserId!, mode);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1000px] mx-auto w-full">
    
      <header className="mb-8 pt-24 lg:pt-0">
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-2">Upload Customer Data</h1>
        <p className="text-gray-500 text-[15px]">Manage your customer datasets</p>
      </header>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        {isAuthLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-500" /></div>
        ) : (
          <CsvDropzone file={selectedFile} isUploading={isUploading} onFileSelect={setSelectedFile} onUpload={handleOpenModal} />
        )}

        {status !== 'idle' && (
          <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {message}
          </div>
        )}
        <UploadRequirements />
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Choose Upload Method</h3>
            <div className="space-y-3">
              <button onClick={() => startUpload('merge')} className="w-full flex items-center gap-4 p-4 rounded-2xl border hover:bg-indigo-50 transition-all text-left">
                <ListPlus className="text-indigo-600" />
                <div><div className="font-bold text-sm">Merge Data</div><div className="text-xs text-gray-400">Combine with existing data. Skip duplicates.</div></div>
              </button>
              <button onClick={() => startUpload('replace')} className="w-full flex items-center gap-4 p-4 rounded-2xl border hover:bg-red-50 transition-all text-left">
                <Database className="text-red-600" />
                <div><div className="font-bold text-sm">Replace Data</div><div className="text-xs text-gray-400">Delete old data and replace with new.</div></div>
              </button>
              <button onClick={() => setShowConfirmModal(false)} className="w-full py-3 text-gray-400 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}