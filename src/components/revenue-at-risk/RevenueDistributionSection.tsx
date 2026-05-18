import { RiskDistribution, DistributionSummary } from "@/types/revenue";

interface Props {
  distribution: RiskDistribution[];
  summary: DistributionSummary;
}

export default function RevenueDistributionSection({ distribution, summary }: Props) {
  return (
    <section className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 lg:p-8 mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-8">Revenue Distribution by Risk Level</h3>
      <div className="space-y-6 mb-12">
        {distribution.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.colorClass}`}></div>
                <span className="text-sm text-gray-600 font-medium">{item.level}</span>
              </div>
              <div className="text-right">
                <span className="block text-xl font-black text-gray-900">{item.amount}</span>
                <span className="text-[11px] text-gray-400 font-medium">{item.percentage}% of total</span>
              </div>
            </div>
            <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden">
              <div className={`${item.colorClass} h-full rounded-full`} style={{ width: `${item.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row justify-around items-center pt-8 border-t border-gray-100 gap-6">
        <div className="text-center">
          <h4 className="text-[22px] font-black text-gray-900">{summary.totalRevenue}</h4>
          <p className="text-[11px] text-gray-500 font-medium uppercase mt-1">Total Revenue</p>
        </div>
        <div className="text-center">
          <h4 className="text-[22px] font-black text-red-600">{summary.atRisk}</h4>
          <p className="text-[11px] text-gray-500 font-medium uppercase mt-1">At Risk</p>
        </div>
        <div className="text-center">
          <h4 className="text-[22px] font-black text-emerald-500">{summary.protected}</h4>
          <p className="text-[11px] text-gray-500 font-medium uppercase mt-1">Protected</p>
        </div>
      </div>
    </section>
  );
}