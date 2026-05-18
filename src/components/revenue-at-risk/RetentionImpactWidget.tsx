import { Target } from "lucide-react";
import { RetentionData } from "@/types/revenue";

export default function RetentionImpactWidget({ data }: { data: RetentionData }) {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 lg:p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
          <Target size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Retention Impact</h3>
      </div>
      <div className="flex-1 space-y-0">
        <div className="flex justify-between items-center py-4 border-b border-gray-100">
          <span className="text-sm text-gray-500">Current monthly churn</span>
          <span className="font-bold text-gray-900">{data.currentChurn} customers</span>
        </div>
        <div className="flex justify-between items-center py-4 border-b border-gray-100">
          <span className="text-sm text-gray-500">If churn reduced by 50%</span>
          <span className="font-bold text-emerald-500">{data.savedBy50Percent} saved</span>
        </div>
        <div className="flex justify-between items-center py-4 border-b border-gray-100">
          <span className="text-sm text-gray-500">Annual savings potential</span>
          <span className="font-bold text-emerald-500">{data.annualSavings} saved</span>
        </div>
      </div>
      <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <p className="text-xs font-semibold text-emerald-600 mb-1">ROI of retention efforts</p>
        <h4 className="text-4xl font-black text-emerald-600 mb-2">{data.roiPercentage}%</h4>
        <p className="text-[11px] text-emerald-600/80 font-medium">Average return on retention investment</p>
      </div>
    </div>
  );
}