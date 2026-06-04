// src/components/dashboard/RiskLegendItem.tsx
import { RiskData } from '@/types';

interface RiskLegendItemProps {
  data: RiskData;
}

export const RiskLegendItem = ({ data }: RiskLegendItemProps) => {
  return (
    <div className="flex items-center justify-between group p-1.5 sm:p-2 mb-1 last:mb-0 rounded-xl hover:bg-gray-50/80 border border-transparent hover:border-gray-100 transition-all duration-200 w-full overflow-hidden">
      
      {/* Kiri: Dot & Label (Bisa nyusut kalau layar sempit) */}
      <div className="flex items-center gap-2 min-w-0">
        <div 
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" 
          style={{ backgroundColor: data.color }} 
        />
        <span className="text-xs sm:text-[13px] font-medium text-gray-500 group-hover:text-gray-700 transition-colors truncate">
          {data.label}
        </span>
      </div>

      {/* Kanan: Angka & Persentase (Ukurannya fix, ga akan kepotong) */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
        <span className="text-[13px] sm:text-[14px] font-bold text-gray-900 tracking-tight text-right w-6 sm:w-8">
          {data.value.toLocaleString('id-ID')}
        </span>
        <div 
          className="flex items-center justify-center px-1.5 py-0.5 rounded-md border shadow-sm min-w-[42px] sm:min-w-[48px]"
          style={{ 
            backgroundColor: `${data.color}10`,
            borderColor: `${data.color}30`, 
          }}
        >
          <span 
            className="text-[10px] sm:text-[11px] font-bold"
            style={{ color: data.color }}
          >
            {data.percentage}%
          </span>
        </div>
      </div>
      
    </div>
  );
};