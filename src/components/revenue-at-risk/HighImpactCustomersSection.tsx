// src\components\revenue-at-risk\HighImpactCustomersSection.tsx

import { Users, ArrowRight } from "lucide-react";
import { CustomerData } from "@/types/revenue";

export default function HighImpactCustomersSection({ customers }: { customers: CustomerData[] }) {
  return (
    <section className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 lg:p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
          <Users size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">High Revenue Impact Customers</h3>
          <p className="text-xs text-gray-500">Prioritized by revenue at risk</p>
        </div>
      </div>

      <div className="space-y-4">
        {customers.map((customer, idx) => {
          const isHighRisk = customer.riskLevel === "high";
          const borderColor = isHighRisk ? "border-l-red-500" : "border-l-orange-400";
          const badgeBg = isHighRisk ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600";

            return (
            <div key={`${customer.id}-${idx}`} className={`bg-[#fcfaf8] border border-gray-100 rounded-[16px] p-6 border-l-4 ${borderColor} relative`}>
                <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-white border border-gray-200 rounded-md flex items-center justify-center text-xs font-bold text-gray-700">
                    {idx + 1}
                    </span>
                    <div>
                    <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">{customer.id}</h4>
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${badgeBg}`}>
                        {customer.churnRisk}% Churn Risk
                        </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Last login: {customer.lastLogin}</p>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {customer.impactCustomers} customers • {customer.impactTotal} total
                </p>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                  <p className="text-xl font-bold text-gray-900">{customer.totalSpent}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Potential Loss</p>
                  <p className="text-xl font-bold text-red-600">{customer.potentialLoss}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Account Age</p>
                  <p className="text-xl font-bold text-gray-900">{customer.accountAge}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs font-medium text-gray-700 mb-2">Top Churn Factors :</p>
                <div className="flex flex-wrap gap-2">
                  {customer.churnFactors.map((factor, i) => (
                    <span key={`factor-${customer.id}-${idx}-${i}`} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-[11px] rounded-full">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-4 pt-2">
                <div className="flex gap-3">
                  <button className="px-5 py-2 border border-red-500 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors">Call Now</button>
                  <button className="px-5 py-2 border border-indigo-500 text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors">Special Offer</button>
                </div>
                <button className="flex items-center gap-2 px-5 py-2 bg-[#e6ebff] text-indigo-900 text-sm font-semibold rounded-lg hover:bg-indigo-100 transition-colors">
                  View Full Profile <ArrowRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}