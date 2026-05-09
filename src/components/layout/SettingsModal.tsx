// src/components/layout/SettingsModal.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Camera, Loader2, LogOut } from 'lucide-react';
import { updateSettings } from '@/actions/settings';
import { signOut, getCurrentUser } from '@/actions/auth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onUpdateSuccess: (newName: string, newPhoto?: string) => void;
}

export default function SettingsModal({ isOpen, onClose, userName, onUpdateSuccess }: SettingsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // 1. Pake state buat semua input biar bisa update otomatis
  const [fullName, setFullName] = useState(userName);
  const [userEmail, setUserEmail] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      getCurrentUser().then(user => {
        if (user) {
          // 1. Email langsung dari user.email
          setUserEmail(user.email || '');
          
          // 2. Gak perlu pake user_metadata lagi, langsung user.full_name
          const metaName = user.full_name || userName;
          if (metaName !== 'Loading...') {
            setFullName(metaName); // Update state fullName biar input gak kosong
          }

          // 3. Langsung pake user.avatar_url
          const avatar = user.avatar_url;
          if (avatar) setPhotoPreview(avatar);
        }
      });
    }
  }, [isOpen, userName]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateSettings(formData);

    if (result?.error) {
      alert("Error: " + result.error);
    } else if (result?.success) {
      onUpdateSuccess(result.newName || fullName, result.newPhoto || undefined);
      onClose();
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white w-full max-w-[440px] rounded-2xl shadow-2xl flex flex-col border border-gray-100 animate-in fade-in zoom-in duration-150">
        
        {/* Header Tetap Sama ... */}
        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 leading-tight">Settings</h2>
            <p className="text-xs text-gray-400 mt-0.5">Manage your profile and account settings</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col">
          <div className="p-6 space-y-6">
            
            {/* Profile Photo Section Tetap Sama ... */}
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="w-[72px] h-[72px] rounded-full bg-[#f8f6ff] overflow-hidden border border-gray-100 shadow-sm">
                  <img 
                    src={photoPreview || `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}&backgroundColor=b599f6`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <input type="file" name="avatar" ref={fileInputRef} className="hidden" accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPhotoPreview(URL.createObjectURL(file));
                  }} 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">Profile Photo</span>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-blue-600 font-medium hover:underline mt-1 text-left">
                  Upload new image
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[13px] font-medium text-gray-700">Full Name</label>
                {/* 3. Ganti defaultValue jadi value + onChange */}
                <input 
                  type="text" 
                  name="full_name" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm" 
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[13px] font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm" 
                />
              </div>
              
              {/* Sisanya sama ... */}
              <div className="space-y-1.5 text-left">
                <label className="text-[13px] font-medium text-gray-700">New Password</label>
                <input type="password" name="new_password" placeholder="••••••••" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm" />
              </div>
            </div>

            <div className="pt-2">
              <button type="button" onClick={() => signOut()} className="flex items-center gap-2 text-sm text-red-500 font-medium hover:text-red-600 transition">
                <LogOut size={16} />
                <span>Sign out of account</span>
              </button>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end items-center gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm disabled:opacity-50 transition flex items-center gap-2">
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}