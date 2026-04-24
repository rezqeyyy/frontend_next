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
  const [userEmail, setUserEmail] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      getCurrentUser().then(user => {
        if (user) {
          setUserEmail(user.email || '');
          if (user.avatar_url) setPhotoPreview(user.avatar_url);
        }
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateSettings(formData);

    if (result?.error) {
      alert("Error: " + result.error);
    } else if (result?.success) {
      onUpdateSuccess(result.newName || userName, result.newPhoto || undefined);
      onClose();
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white w-full max-w-[440px] rounded-2xl shadow-2xl flex flex-col border border-gray-100 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
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
            
            {/* Profile Photo Section */}
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="w-[72px] h-[72px] rounded-full bg-[#f8f6ff] overflow-hidden border border-gray-100 shadow-sm">
                  <img 
                    src={photoPreview || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=b599f6`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <input 
                  type="file" 
                  name="avatar" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPhotoPreview(URL.createObjectURL(file));
                  }} 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">Profile Photo</span>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-blue-600 font-medium hover:underline mt-1 text-left"
                >
                  Upload new image
                </button>
              </div>
            </div>

            {/* Inputs Section */}
            <div className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[13px] font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  name="full_name" 
                  defaultValue={userName} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm" 
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[13px] font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  defaultValue={userEmail} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm" 
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[13px] font-medium text-gray-700">New Password</label>
                <input 
                  type="password" 
                  name="new_password" 
                  placeholder="••••••••" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm" 
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[13px] font-medium text-gray-700">Language</label>
                <div className="relative">
                  <select 
                    name="language" 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm appearance-none"
                  >
                    <option value="en">English (US)</option>
                    <option value="id">Bahasa Indonesia</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout link */}
            <div className="pt-2">
              <button 
                type="button" 
                onClick={() => signOut()} 
                className="flex items-center gap-2 text-sm text-red-500 font-medium hover:text-red-600 transition"
              >
                <LogOut size={16} />
                <span>Sign out of account</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end items-center gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm disabled:opacity-50 transition flex items-center gap-2"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}