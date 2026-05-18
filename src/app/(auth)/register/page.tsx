// src/app/(auth)/register/page.tsx
'use client';

import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import { User, Mail, Lock, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('');
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

    if (password !== confirmPassword) {
      setError('Password konfirmasi tidak cocok!');
      setIsLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          employee_id: employeeId,
          department: department,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
    } else {
      alert('Registrasi sukses! Silakan login.');
      window.location.href = '/login'; 
    }
  }

  return (
    <AuthLayout>
      <div className="mb-6 mt-[-20px]">
        <h1 className="text-[42px] font-bold bg-gradient-to-r from-[#94b1fc] to-[#bc9cf4] bg-clip-text text-transparent mb-1 leading-tight tracking-tight">
          Create Account
        </h1>
        <p className="text-[15px] text-gray-900 font-medium ml-1">
          Sign up to get started with Keeva
        </p>
      </div>

      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        {error && (
          <div className="max-w-[380px] p-3 rounded-lg bg-red-50 text-red-500 text-sm border border-red-100">
            {error}
          </div>
        )}

        <AuthInput 
          label="Full Name" 
          name="full_name"
          type="text" 
          placeholder="Tulis nama anda disini" 
          icon={<User size={18} strokeWidth={2.5} className="text-gray-300" />} 
          value={fullName}
          onChange={(e: any) => setFullName(e.target.value)}
          required
        />
        
        <AuthInput 
          label="Company Email" 
          name="email"
          type="email" 
          placeholder="nama@company.com" 
          icon={<Mail size={18} strokeWidth={2.5} className="text-gray-300" />} 
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          required
        />

        <AuthInput 
          label="Employee ID" 
          name="employee_id"
          type="text" 
          placeholder="EMP1234 atau KVA12345" 
          icon={<User size={18} strokeWidth={2.5} className="text-gray-300" />} 
          value={employeeId}
          onChange={(e: any) => setEmployeeId(e.target.value)}
          required
        />

        {/* Custom Select Input untuk Departement */}
        <div className="max-w-[380px]">
          <label className="block text-[13px] text-gray-900 font-medium mb-1.5 ml-1">
            Departement
          </label>
          <div className="relative">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              className="w-full pl-4 pr-10 py-3 rounded-[14px] border-2 border-[#f5eeff] focus:border-[#d8c2ff] focus:ring-4 focus:ring-[#f5eeff] outline-none transition-all shadow-[0_0_15px_rgba(225,200,255,0.4)] text-[13px] text-gray-400 bg-white appearance-none cursor-pointer"
            >
              <option value="" disabled>select department</option>
              <option value="IT">IT / Engineering</option>
              <option value="HR">Human Resources</option>
              <option value="Sales">Sales & Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
            <ChevronDown size={18} strokeWidth={2.5} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d8c2ff] pointer-events-none" />
          </div>
        </div>
        
        <AuthInput 
          label="Password" 
          name="password"
          type="password" 
          placeholder="create a password" 
          icon={<Lock size={18} strokeWidth={2.5} className="text-gray-300" />} 
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          required
        />
        
        <AuthInput 
          // Label dikosongkan karena di desain tidak ada teks label untuk confirm password
          label="" 
          name="confirm_password"
          type="password" 
          placeholder="confirm your password" 
          icon={<Lock size={18} strokeWidth={2.5} className="text-gray-300" />} 
          value={confirmPassword}
          onChange={(e: any) => setConfirmPassword(e.target.value)}
          required
        />

        <div className="flex items-center gap-2 max-w-[380px] mt-1 mb-2">
          <input type="checkbox" required className="w-3 h-3 rounded border-gray-300 text-[#bc9cf4] focus:ring-[#bc9cf4]" />
          <span className="text-[9px] text-gray-400">
            I agree to the <a href="#" className="underline decoration-gray-400">Terms and Conditions</a> and <a href="#" className="underline decoration-gray-400">Privacy Policy</a>
          </span>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full max-w-[380px] py-3 rounded-xl bg-[#f8f9fd] border border-[#f0f2ff] text-[#cbaeff] font-semibold text-lg hover:brightness-95 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Sign In'}
        </button>
      </form>

    </AuthLayout>
  );
}