// src/app/(auth)/register/page.tsx
'use client';

import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import { User, Mail, Lock } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/actions/auth';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result?.success) {
      router.push('/'); // Ke Dashboard jika berhasil
    }
  }

  return (
    <AuthLayout>
      <div className="mb-6 mt-[-40px]">
        <h1 className="text-[42px] font-bold bg-gradient-to-r from-[#94b1fc] to-[#bc9cf4] bg-clip-text text-transparent mb-1 leading-tight tracking-tight">
          Create Account
        </h1>
        <p className="text-[15px] text-gray-900 font-medium ml-1">
          Sign up to get started with Keeva
        </p>
      </div>

      <form className="w-full" onSubmit={handleSubmit}>
        {error && (
          <div className="max-w-[380px] mb-4 p-3 rounded-lg bg-red-50 text-red-500 text-sm border border-red-100">
            {error}
          </div>
        )}

        <AuthInput 
          label="Full Name" 
          name="full_name"
          type="text" 
          placeholder="Haechan Lee" 
          icon={<User size={18} strokeWidth={2.5} />} 
          required
        />
        <AuthInput 
          label="Email Address" 
          name="email"
          type="email" 
          placeholder="you@example.com" 
          icon={<Mail size={18} strokeWidth={2.5} />} 
          required
        />
        
        {/* Label tetap "Full Name" sesuai desain asli di mockup */}
        <AuthInput 
          label="Full Name" 
          name="password"
          type="password" 
          placeholder="create a password" 
          icon={<Lock size={18} strokeWidth={2.5} />} 
          required
        />
        
        <AuthInput 
          label="Password" 
          type="password" 
          placeholder="confirm your password" 
          icon={<Lock size={18} strokeWidth={2.5} />} 
          required
        />

        <div className="flex items-center gap-2 max-w-[380px] mt-2 mb-6">
          <input type="checkbox" required className="w-3.5 h-3.5 rounded border-gray-300 text-[#bc9cf4] focus:ring-[#bc9cf4]" />
          <span className="text-[10px] text-gray-500">
            I agree to the <a href="#" className="underline">Terms and Conditions</a> and <a href="#" className="underline">Privacy Policy</a>
          </span>
        </div>

        {/* Button tetap bertuliskan "Sign In" sesuai desain asli di mockup */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full max-w-[380px] py-3 rounded-xl bg-gradient-to-r from-[#f7f8ff] to-[#f7f8ff] border border-[#f0f2ff] shadow-[0_4px_10px_rgba(216,194,255,0.1)] text-[#cbaeff] font-semibold text-lg hover:brightness-95 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Creating Account...' : 'Sign In'}
        </button>
      </form>
    </AuthLayout>
  );
}