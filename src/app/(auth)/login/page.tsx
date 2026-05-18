// src/app/(auth)/login/page.tsx
'use client';

import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
// 1. Import createBrowserClient dari library baru
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. Inisialisasi Supabase pake cara baru di Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 3. Eksekusi login langsung pake Supabase SSR Client
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    } else {
      // 4. Kalau sukses, paksa browser pindah buat nge-refresh Cookie Server
      window.location.href = '/dashboard'; 
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="text-[42px] font-bold bg-gradient-to-r from-[#94b1fc] to-[#bc9cf4] bg-clip-text text-transparent mb-1 leading-tight tracking-tight">
          Welcome Back
        </h1>
        <p className="text-[15px] text-gray-900 font-medium ml-1">
          Sign in to your Keeva account
        </p>
      </div>

      <form className="w-full" onSubmit={handleSubmit}>
        
        {error && (
          <div className="max-w-[380px] mb-4 p-3 rounded-lg bg-red-50 text-red-500 text-sm border border-red-100">
            {error}
          </div>
        )}

        <AuthInput 
          label="Email Address" 
          type="email" 
          name="email"
          placeholder="you@example.com" 
          icon={<Mail size={18} strokeWidth={2.5} />} 
          required
        />
        
        <AuthInput 
          label="Password" 
          type="password" 
          name="password"
          placeholder="enter your password" 
          icon={<Lock size={18} strokeWidth={2.5} />} 
          required
        />

        <div className="flex items-center justify-between max-w-[380px] mt-1 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-[#bc9cf4] focus:ring-[#bc9cf4]" />
            <span className="text-[11px] text-gray-400">Remember me</span>
          </label>
          <Link href="#" className="text-[11px] text-gray-400 underline hover:text-gray-600">
            Forgot password?
          </Link>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full max-w-[380px] py-3 rounded-xl bg-gradient-to-r from-[#f7f8ff] to-[#f7f8ff] border border-[#f0f2ff] shadow-[0_4px_10px_rgba(216,194,255,0.1)] text-[#cbaeff] font-semibold text-lg hover:brightness-95 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <div className="max-w-[380px] my-6 flex items-center justify-center">
          <span className="text-[11px] text-gray-400">Or continue with</span>
        </div>
      </form>
    </AuthLayout>
  );
}