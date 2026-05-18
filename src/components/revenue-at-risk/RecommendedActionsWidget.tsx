import { AlertTriangle, PhoneCall, Sparkles, Target, Zap } from "lucide-react";
import { RecommendedAction } from "@/types/revenue";

export default function RecommendedActionsWidget({ actions }: { actions: RecommendedAction[] }) {
  const iconConfig = {
    alert: { icon: AlertTriangle, color: "text-red-500", bg: "bg-[#fef2f2]", border: "border-l-red-500" },
    call: { icon: PhoneCall, color: "text-orange-500", bg: "bg-[#fff7ed]", border: "border-l-orange-400" },
    sparkle: { icon: Sparkles, color: "text-purple-500", bg: "bg-[#f5f3ff]", border: "border-l-purple-500" },
    target: { icon: Target, color: "text-blue-500", bg: "bg-[#eff6ff]", border: "border-l-blue-500" },
  };

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 border border-purple-100">
          <Zap size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Recommended Actions</h3>
      </div>

      <div className="space-y-4">
        {actions.map((action) => {
          const style = iconConfig[action.type];
          const Icon = style.icon;

          return (
            <div key={action.id} className={`${style.bg} border border-gray-50 rounded-r-xl p-4 flex items-start gap-4 border-l-4 ${style.border}`}>
              <Icon size={18} className={`${style.color} mt-0.5 shrink-0`} />
              <div>
                <p className="text-sm font-semibold text-gray-900">{action.title}</p>
                <p className="text-[10px] text-gray-500 mt-1">Contribution to churn: {action.contribution.toFixed(1)}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}