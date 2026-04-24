// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/actions/auth';
import SettingsModal from './SettingsModal';
import { 
  LayoutDashboard, Users, UploadCloud, PieChart, 
  Headphones, FileText, BadgeDollarSign, Settings2, 
  Settings, Menu, X 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [userName, setUserName] = useState('Loading...');
  const [userPhoto, setUserPhoto] = useState<string | null>(null); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser() as any; 
      if (user) {
        setUserName(user.full_name);
        if (user.avatar_url) setUserPhoto(user.avatar_url);
      } else {
        setUserName('Guest');
      }
    }
    fetchUser();
  }, []);

  // Tutup sidebar otomatis pas ganti halaman
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (isAuthPage) return null;

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Customer List', href: '/customer-list', icon: Users },
    { name: 'Upload CSV', href: '/upload-csv', icon: UploadCloud },
    { name: 'Prediction Results', href: '/prediction-results', icon: PieChart },
    { name: 'Feature Importance', href: '/features', icon: FileText },
    { name: 'Revenue at Risk', href: '/revenue', icon: BadgeDollarSign },
  ];

  return (
    <>
      {/* --- MOBILE TOP NAVIGATION (Hanya muncul di HP) --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 px-5 flex items-center justify-between z-[40]">
        <div className="flex items-center gap-2">
          <img src="/assets/keeva.png" alt="Logo" className="h-7 w-auto" />
          <span className="font-bold text-gray-900 text-lg tracking-tight">Keeva</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* --- SIDEBAR DRAWER --- */}
      {/* Overlay buat nutup sidebar pas di klik di luar menu (Mobile) */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[50] transition-opacity lg:hidden ${
          isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMobileOpen(false)}
      />

      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-[280px] bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen lg:shadow-[4px_0_24px_rgba(216,194,255,0.2)] lg:z-20
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* LOGO AREA */}
        <div className="p-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/keeva.png" alt="Keeva Logo" className="h-8 w-auto object-contain" />
            <span className="text-[22px] font-bold text-gray-900 tracking-tight">Keeva</span>
          </div>
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-2 text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 font-medium'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span className="text-[14px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* USER PROFILE BOTTOM */}
        <div className="p-6 mt-auto border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3 max-w-[180px]">
            <div className="w-10 h-10 rounded-full bg-[#f8f6ff] overflow-hidden border-2 border-white shadow-sm shrink-0">
              <img 
                src={userPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=b599f6`} 
                alt={userName} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-gray-900 leading-tight truncate">{userName}</span>
            </div>
          </div>
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-all shrink-0">
            <Settings size={18} />
          </button>
        </div>
      </aside>

      {/* SETTINGS MODAL */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        userName={userName}
        onUpdateSuccess={(newName, newPhoto) => {
          if (newName) setUserName(newName);
          if (newPhoto) setUserPhoto(newPhoto);
          router.refresh(); 
        }} 
      />
    </>
  );
}