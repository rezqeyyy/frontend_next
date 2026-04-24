// src/components/dashboard/KpiCard.tsx
import { KPIData } from '@/types';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function KpiCard({ data }: { data: KPIData }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
      {/* Circle Placeholder */}
      <div className="w-14 h-14 rounded-full border-2 border-blue-100 flex-shrink-0" />
      
      <div>
        <h3 className="text-sm text-gray-500 font-medium">{data.title}</h3>
        <p className="text-2xl font-bold mt-1">{data.value}</p>
        <div className="flex items-center space-x-1 mt-1 text-xs">
          {data.isPositive ? (
            <span className="flex items-center text-green-500"><ArrowUp size={12} /> {data.trend}%</span>
          ) : (
             <span className="flex items-center text-red-500"><ArrowDown size={12} /> {data.trend}%</span>
          )}
          <span className="text-gray-400">{data.timeframe}</span>
        </div>
      </div>
    </div>
  );
}