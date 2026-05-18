// src/app/(auth)/login/page.tsx
'use client';

import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import { User, Lock } from 'lucide-react'; // Mengganti Mail dengan User agar lebih general
import Link from 'next/link';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get('identifier') as string; // Menangkap Email ATAU Employee ID
    const password = formData.get('password') as string;

    let loginEmail = identifier;

    // LOGIKA PENGECEKAN: Jika input TIDAK ada karakter '@', asumsikan itu adalah Employee ID
    if (!identifier.includes('@')) {
      // Panggil fungsi RPC yang barusan kita buat di Supabase SQL
      const { data: fetchedEmail, error: rpcError } = await supabase.rpc('get_email_by_employee_id', {
        emp_id: identifier
      });

      if (rpcError || !fetchedEmail) {
        setError('Employee ID tidak ditemukan.');
        setIsLoading(false);
        return;
      }
      
      // Jika ketemu, ganti loginEmail dengan email asli dari database
      loginEmail = fetchedEmail;
    }

    // Eksekusi login resmi menggunakan Email (baik email yang diketik langsung, atau hasil pencarian ID)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (signInError) {
      setError("Login gagal. Pastikan ID/Email dan password benar.");
      setIsLoading(false);
    } else {
      window.location.href = '/dashboard'; 
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8 mt-4">
        <h1 className="text-[42px] font-bold bg-gradient-to-r from-[#94b1fc] to-[#bc9cf4] bg-clip-text text-transparent mb-1 leading-tight tracking-tight">
          Welcome Back
        </h1>
        <p className="text-[15px] text-gray-900 font-medium ml-1">
          Sign in to your Keeva account
        </p>
      </div>

      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        
        {error && (
          <div className="max-w-[380px] p-3 rounded-lg bg-red-50 text-red-500 text-sm border border-red-100">
            {error}
          </div>
        )}

        <AuthInput 
          label="Email or Employee ID" 
          type="text"  // Harus 'text', jangan 'email' karena user bisa mengisi EMP1234
          name="identifier"
          placeholder="nama@company.com atau KVA12345" 
          icon={<User size={18} strokeWidth={2.5} className="text-gray-300" />} 
          required
        />
        
        <AuthInput 
          label="Password" 
          type="password" 
          name="password"
          placeholder="enter your password" 
          icon={<Lock size={18} strokeWidth={2.5} className="text-gray-300" />} 
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
          className="w-full max-w-[380px] py-3 rounded-xl bg-[#f8f9fd] border border-[#f0f2ff] text-[#cbaeff] font-semibold text-lg hover:brightness-95 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <div className="max-w-[380px] mt-6 flex items-center justify-center">
          <span className="text-[11px] text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="underline hover:text-gray-600 transition-colors">
              Sign up
            </Link>
          </span>
        </div>
      </form>

      <div className="mt-8 max-w-[380px]">
        <Link href="/" className="text-[13px] text-[#bc9cf4] hover:text-[#94b1fc] transition-colors flex items-center font-medium">
          &lt; Back To Website
        </Link>
      </div>
    </AuthLayout>
  );
}