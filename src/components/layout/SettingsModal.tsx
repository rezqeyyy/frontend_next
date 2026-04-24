// src/components/layout/SettingsModal.tsx
'use client';

import { useState, useRef } from 'react';
import { X, Camera, User as UserIcon, Lock, Globe, Loader2 } from 'lucide-react';
import { updateSettings } from '@/actions/settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  // Tambahkan parameter newPhoto di sini
  onUpdateSuccess: (newName: string, newPhoto?: string) => void; 
}

export default function SettingsModal({ isOpen, onClose, userName, onUpdateSuccess }: SettingsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhotoPreview(imageUrl); // Preview langsung berubah di Modal
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData(e.currentTarget);
    const result = await updateSettings(formData);

    if (result?.error) {
      setMessage({ type: 'error', text: result.error });
    } else if (result?.success) {
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      
      // Kirim nama baru DAN foto baru ke Sidebar
      onUpdateSuccess(result.newName || userName, photoPreview || undefined);
      
      setTimeout(() => {
        onClose();
        setMessage({ type: '', text: '' });
      }, 1500);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-[0_10px_40px_rgba(216,194,255,0.3)] overflow-hidden flex flex-col transform transition-all">
        
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">Account Settings</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
          <div className="p-6 overflow-y-auto space-y-6">
            
            {message.text && (
              <div className={`p-3 rounded-lg text-sm border ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                {message.text}
              </div>
            )}

            {/* FOTO PROFILE */}
            <div className="flex flex-col items-center gap-3">
              {/* Tambahkan onClick reset value agar gambar selalu bisa diklik & diganti */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoChange} 
                onClick={(e) => (e.currentTarget.value = '')} 
                accept="image/*" 
                className="hidden" 
              />
              <div onClick={() => fileInputRef.current?.click()} className="relative group cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-[#f8f6ff] overflow-hidden border-4 border-white shadow-md">
                  <img 
                    src={photoPreview || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=b599f6`} 
                    alt="Profile" 
                    className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-full">
                  <Camera size={24} />
                </div>
              </div>
              <span onClick={() => fileInputRef.current?.click()} className="text-xs text-blue-500 font-medium cursor-pointer hover:underline">
                Change Photo
              </span>
            </div>

            <hr className="border-gray-100" />

            {/* ... (INPUT NAMA, PASSWORD, DAN BAHASA SAMA PERSIS SEPERTI SEBELUMNYA) ... */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700 flex items-center gap-2">
                <UserIcon size={14} className="text-[#b599f6]" /> Full Name
              </label>
              <input type="text" name="full_name" defaultValue={userName} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#b599f6] focus:ring-1 focus:ring-[#b599f6] transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700 flex items-center gap-2">
                <Lock size={14} className="text-[#b599f6]" /> New Password
              </label>
              <input type="password" name="new_password" placeholder="Leave blank to keep current password" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#b599f6] focus:ring-1 focus:ring-[#b599f6] transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-gray-700 flex items-center gap-2">
                <Globe size={14} className="text-[#b599f6]" /> Language
              </label>
              <select name="language" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#b599f6] focus:ring-1 focus:ring-[#b599f6] transition-all bg-white cursor-pointer">
                <option value="en">English (US)</option>
                <option value="id">Bahasa Indonesia</option>
              </select>
            </div>

          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-all disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 shadow-sm transition-all flex items-center gap-2 disabled:opacity-50">
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}