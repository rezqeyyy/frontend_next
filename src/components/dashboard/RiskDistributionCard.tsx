// @/components/dashboard/RiskDistributionCard.tsx
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { RiskDonutChart } from './RiskDonutChart';
import { RiskLegendItem } from './RiskLegendItem';

export const RiskDistributionCard = () => {
  // Panggil data dari hook!
  const { riskDistributionData } = useDashboardStats();

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm w-full h-full">
      <h3 className="text-[16px] font-semibold text-gray-900 mb-5">
        Risk Distribution
      </h3>
      
      <div className="flex items-center justify-between gap-4 px-2">
        <div className="flex-shrink-0">
          <RiskDonutChart data={riskDistributionData} />
        </div>

        <div className="flex flex-col flex-grow ml-4">
          {riskDistributionData.map((item) => (
            <RiskLegendItem key={item.id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};