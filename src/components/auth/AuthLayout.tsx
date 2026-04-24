// src/components/auth/AuthLayout.tsx
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center p-4 sm:p-6">
      {/* Main Card - Diubah menjadi flex-col-reverse di HP agar logo di atas form */}
      <div className="w-full max-w-[1100px] min-h-[auto] lg:min-h-[700px] bg-white rounded-xl shadow-[0_0_50px_rgba(216,194,255,0.25)] flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left Form Content */}
        <div className="w-full lg:w-[55%] p-8 sm:p-14 flex flex-col relative z-10 order-2 lg:order-1">
          <div className="flex-1 flex flex-col justify-center max-w-[400px] mx-auto lg:mx-0 w-full">
            {children}
          </div>

          {/* Back To Website Button - Disesuaikan posisinya di layar kecil */}
          <Link href="/" className="mt-8 lg:mt-0 static lg:absolute lg:bottom-10 lg:left-10 flex items-center justify-center lg:justify-start gap-1 text-[#b599f6] text-sm font-medium hover:opacity-80 transition-opacity font-mono">
            <ChevronLeft size={16} /> Back To Website
          </Link>
          
          <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-[#f8f6ff] rounded-full blur-3xl -z-10 hidden lg:block" />
        </div>

        {/* Right Image Content */}
        <div className="w-full lg:w-[45%] flex items-center justify-center p-8 lg:p-0 lg:pr-10 order-1 lg:order-2 bg-[#faf8ff] lg:bg-transparent">
          <img 
            src="/assets/keeva.png" 
            alt="Keeva Logo" 
            className="w-full max-w-[200px] lg:max-w-[450px] object-contain drop-shadow-lg"
          />
        </div>
        
      </div>
    </div>
  );
}