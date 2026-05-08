// src/components/dashboard/AlertItem.tsx
import { AlertTriangle, Activity } from 'lucide-react';

interface AlertItemProps {
  type: 'danger' | 'warning' | 'info';
  title: string;
  desc: string;
  time: string;
}

export function AlertItem({ type, title, desc, time }: AlertItemProps) {
  const styles = {
    danger: { 
      bg: 'bg-red-50', 
      border: 'border-red-100', 
      text: 'text-red-700', 
      icon: <AlertTriangle size={14} /> 
    },
    warning: { 
      bg: 'bg-orange-50', 
      border: 'border-orange-100', 
      text: 'text-orange-700', 
      icon: <Activity size={14} /> 
    },
    info: { 
      bg: 'bg-blue-50', 
      border: 'border-blue-100', 
      text: 'text-blue-700', 
      icon: <AlertTriangle size={14} /> 
    }
  };
  
  const current = styles[type];

  return (
    <div className={`${current.bg} p-3 rounded-xl border ${current.border} transition-all hover:shadow-sm`}>
      <h4 className={`text-[13px] font-bold ${current.text} flex items-center gap-2`}>
        {current.icon} {title}
      </h4>
      <p className="text-[11px] text-gray-500 mt-1 pl-5 leading-tight">{desc}</p>
      <p className="text-[10px] text-gray-400 text-right mt-1 font-medium">{time}</p>
    </div>
  );
}