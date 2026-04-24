'use client';

import { usePathname } from 'next/navigation';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <main className={`min-h-screen transition-all duration-300 ${
      // Jika halaman auth, tidak ada padding. 
      // Jika dashboard, HP padding atas 16 (pt-16), Desktop padding kiri 64 (md:pl-64).
      isAuthPage ? '' : 'pt-20 md:pt-0 md:pl-64'
    }`}>
      {children}
    </main>
  );
}