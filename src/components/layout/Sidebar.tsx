// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/actions/auth';
import SettingsModal from './SettingsModal';

import { LayoutDashboard, Users, UploadCloud, PieChart, Headphones, FileText, BadgeDollarSign, Settings2, Settings } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState('Loading...');
  // Tambahkan state untuk menampung foto baru
  const [userPhoto, setUserPhoto] = useState<string | null>(null); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      if (user && user.full_name) setUserName(user.full_name);
      else setUserName('Guest');
    }
    fetchUser();
  }, []);

  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (isAuthPage) return null;

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Customer List', href: '/customer-list', icon: Users },
    { name: 'Upload CSV', href: '/upload-csv', icon: UploadCloud },
    { name: 'Prediction Results', href: '/prediction', icon: PieChart },
    { name: 'Customer Segments', href: '/segments', icon: Headphones },
    { name: 'Feature Importance', href: '/features', icon: FileText },
    { name: 'Revenue at Risk', href: '/revenue', icon: BadgeDollarSign },
  ];

  return (
    <>
      <aside className="hidden lg:flex w-[260px] h-screen bg-white flex-col shadow-[4px_0_24px_rgba(216,194,255,0.4)] z-20 sticky top-0 shrink-0">
        
        {/* LOGO & NAV */}
        <div className="p-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/keeva.png" alt="Keeva Logo" className="h-8 w-auto object-contain drop-shadow-sm" />
            <span className="text-[22px] font-bold text-gray-900 tracking-tight">Keeva</span>
          </div>
          <Settings2 size={20} className="text-gray-400 cursor-pointer hover:text-gray-600 transition" />
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-[#E5F1FF] text-blue-600 font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 font-medium'}`}>
                <Icon size={20} className={isActive ? 'text-blue-500' : 'text-gray-400'} />
                <span className="text-[14px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* PROFILE BOTTOM */}
        <div className="p-6 mt-auto flex items-center justify-between group">
          <div className="flex items-center gap-3 max-w-[180px]">
            <div className="w-10 h-10 rounded-full bg-[#f8f6ff] overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
              {/* Tampilkan userPhoto jika ada, jika tidak pakai inisial huruf bawaan */}
              <img 
                src={userPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=b599f6`} 
                alt={userName} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-gray-900 leading-tight truncate">{userName}</span>
              {/* <span className="text-[11px] text-gray-400 font-medium">Admin</span> */}
            </div>
          </div>
          
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-blue-500 transition-all flex-shrink-0">
            <Settings size={18} />
          </button>
        </div>
      </aside>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        userName={userName}
        onUpdateSuccess={(newName, newPhoto) => {
          if (newName) setUserName(newName);
          if (newPhoto) setUserPhoto(newPhoto); // <--- Terima foto baru dari Modal
        }} 
      />
    </>
  );
}