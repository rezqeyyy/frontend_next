// src/components/layout/MobileNav.tsx
'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav({ navItems, userName, userPhoto }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden w-full bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-[40] flex items-center justify-between">
      {/* Logo & Brand */}
      <div className="flex items-center gap-2">
        <img src="/assets/keeva.png" alt="Logo" className="h-7 w-auto" />
        <span className="font-bold text-gray-900 text-lg">Keeva</span>
      </div>

      {/* Hamburger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[57px] bg-white z-[50] p-6 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-2">
            {navItems.map((item: any) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-semibold' 
                      : 'text-gray-500 font-medium'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* User Profile Mini in Drawer */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3">
             <img 
               src={userPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=b599f6`} 
               className="w-10 h-10 rounded-full object-cover" 
             />
             <span className="font-bold text-gray-900">{userName}</span>
          </div>
        </div>
      )}
    </div>
  );
}