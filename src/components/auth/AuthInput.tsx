// src/components/auth/AuthInput.tsx
import { ReactNode, InputHTMLAttributes } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
}

export default function AuthInput({ label, icon, ...props }: AuthInputProps) {
  return (
    <div className="flex flex-col gap-1.5 mb-4 w-full max-w-[380px]">
      <label className="text-[15px] text-gray-900 font-medium">{label}</label>
      <div className="relative flex items-center">
        <span className="absolute left-4 text-[#dcbefa]">{icon}</span>
        <input 
          {...props} 
          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#f5eeff] shadow-[0_0_15px_rgba(225,200,255,0.4)] text-gray-700 focus:outline-none focus:border-[#dcbefa] transition-all placeholder:text-[#dcbefa] text-sm"
        />
      </div>
    </div>
  );
}