// src/components/dashboard/RiskLegendItem.tsx
import { RiskData } from '@/types';

export const RiskLegendItem = ({ data }: { data: RiskData }) => {
  return (
    <div className="flex items-center w-full py-2 group">
      
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div 
          className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" 
          style={{ backgroundColor: data.color }} 
        />
        <span className="text-[13px] font-medium text-gray-600 whitespace-nowrap">
          {data.label}
        </span>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        <span className="text-[14px] font-bold text-gray-900 text-right w-10">
          {data.value.toLocaleString('id-ID')}
        </span>
        
        <div 
          className="flex items-center justify-center py-1 rounded-md border shadow-sm w-[52px] flex-shrink-0"
          style={{ 
            backgroundColor: `${data.color}15`,
            borderColor: `${data.color}30`, 
          }}
        >
          <span className="text-[11px] font-bold" style={{ color: data.color }}>
            {data.percentage}%
          </span>
        </div>
      </div>
      
    </div>
  );
};