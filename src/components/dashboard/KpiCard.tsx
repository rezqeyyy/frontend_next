import { ArrowUp, ArrowDown, LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  trend: number;
  isPositive: boolean;
  color: 'red' | 'blue';
  icon: LucideIcon;
}

export function KpiCard({ title, value, trend, isPositive, color, icon: Icon }: KpiCardProps) {
  const borderColor = color === 'red' ? 'border-red-200' : 'border-blue-200';
  const textColor = isPositive ? 'text-green-500' : 'text-red-500';
  const iconColor = color === 'red' ? 'text-red-400' : 'text-blue-400';

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] ${borderColor} flex items-center justify-center flex-shrink-0`}>
        <Icon size={24} className={iconColor} />
      </div>
      <div className="min-w-0">
        <h3 className="text-[13px] text-gray-500 font-medium truncate">{title}</h3>
        <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
        <div className="flex items-center gap-1 text-[11px] font-medium truncate">
          <span className={`flex items-center ${textColor}`}>
            {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {trend}%
          </span>
          <span className="text-gray-400 hidden sm:inline">last 30 days</span>
        </div>
      </div>
    </div>
  );
}