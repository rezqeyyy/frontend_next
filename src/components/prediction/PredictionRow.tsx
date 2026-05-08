// src/components/prediction/PredictionRow.tsx
import { ArrowUp, ArrowDown } from 'lucide-react';

interface PredictionRowProps {
  no: number;
  data: any;
}

export function PredictionRow({ no, data }: PredictionRowProps) {
  const { customer_id, churn_risk_score: score, rank_level: rank, revenue_at_risk } = data;
  
  const rankColors: any = { 
    High: 'bg-red-100 text-red-600', 
    Medium: 'bg-orange-100 text-orange-600', 
    Low: 'bg-green-100 text-green-600' 
  };

  const barColor = score > 70 ? 'bg-red-500' : score > 40 ? 'bg-yellow-400' : 'bg-green-500';

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition">
      <td className="py-4 px-2">{no}</td>
      <td className="py-4 font-semibold text-gray-800">{customer_id ?? '-'}</td>
      <td className="py-4">
        <div className="flex items-center justify-center gap-3">
          <span className="font-medium w-6 text-center">{score ?? 0}</span>
          {score > 50 ? <ArrowUp size={12} className="text-red-500" /> : <ArrowDown size={12} className="text-green-500" />}
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
            <div className={`h-full ${barColor}`} style={{ width: `${score ?? 0}%` }} />
          </div>
        </div>
      </td>
      <td className="py-4 text-center">
        <span className={`px-3 py-1 rounded-md text-[11px] font-semibold ${rankColors[rank] || 'bg-gray-100 text-gray-600'}`}>
          {rank ?? '-'}
        </span>
      </td>
      <td className="py-4 text-center font-semibold text-gray-800">
        ${revenue_at_risk?.toLocaleString() ?? '0'}
      </td>
      <td className="py-4 text-center">
        {/* Action button here if needed */}
      </td>
    </tr>
  );
}