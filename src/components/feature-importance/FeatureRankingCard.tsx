// src/components/feature-importance/FeatureRankingCard.tsx
import { LucideIcon } from 'lucide-react';

interface FeatureRankingCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  importance: number;
  businessImpact: string;
  recommendation?: string;
  color: string;
}

export function FeatureRankingCard({ 
  icon: Icon, title, description, importance, businessImpact, recommendation, color 
}: FeatureRankingCardProps) {
  return (
    <div className="relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm">
      {/* Background Progress Bar */}
      <div 
        className="absolute top-0 left-0 h-full opacity-5 transition-all duration-1000" 
        style={{ width: `${importance}%`, backgroundColor: color }}
      />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex gap-4">
          <div className={`p-3 rounded-xl bg-gray-50 text-gray-600`}>
            <Icon size={24} />
          </div>
          <div className="max-w-2xl">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              {title} 
              <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full uppercase tracking-widest">Feature</span>
            </h4>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>
            
            {recommendation && (
              <div className="mt-2 text-xs">
                <span className="text-blue-500 font-bold">💡 Recommendation: </span>
                <span className="text-gray-600">{recommendation}</span>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-xs italic text-gray-400">
                <span className="font-bold not-italic text-gray-600">Business Impact:</span> {businessImpact}
              </p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-gray-900" style={{ color: color }}>
            {importance}%
          </span>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Importance</p>
        </div>
      </div>
    </div>
  );
}