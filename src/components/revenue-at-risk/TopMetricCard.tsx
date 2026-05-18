import { AlertTriangle, DollarSign, TrendingDown, Target } from "lucide-react";
import { MetricData } from "@/types/revenue";

export default function TopMetricCard({ metric }: { metric: MetricData }) {
  const styleConfig = {
    danger: { icon: AlertTriangle, iconColor: "text-red-500", bg: "bg-red-50", border: "border-red-100", subtextColor: "text-red-500" },
    warning: { icon: DollarSign, iconColor: "text-amber-500", bg: "bg-orange-50", border: "border-orange-100", subtextColor: "text-gray-400" },
    caution: { icon: TrendingDown, iconColor: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-100", subtextColor: "text-gray-400" },
    success: { icon: Target, iconColor: "text-emerald-500", bg: "bg-green-50", border: "border-green-100", subtextColor: "text-gray-400" },
  };

  const style = styleConfig[metric.type];
  const Icon = style.icon;

  return (
    <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
      <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center mb-4 border ${style.border}`}>
        <Icon className={style.iconColor} size={20} />
      </div>
      <div>
        <h2 className="text-2xl font-black text-gray-900">{metric.amount}</h2>
        <p className="text-xs text-gray-500 font-medium mb-2">{metric.subtitle}</p>
        <p className={`text-[10px] font-bold ${style.subtextColor}`}>{metric.subtext}</p>
      </div>
    </div>
  );
}