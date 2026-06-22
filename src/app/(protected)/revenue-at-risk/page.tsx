"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

// Imports - Sesuaikan path alias '@' dengan project kamu
import { RevenueDashboardData } from "@/types/revenue";
import { fetchRevenueData } from "@/actions/revenue";
import TopMetricCard from "@/components/revenue-at-risk/TopMetricCard";
import RevenueDistributionSection from "@/components/revenue-at-risk/RevenueDistributionSection";
import HighImpactCustomersSection from "@/components/revenue-at-risk/HighImpactCustomersSection";
import RetentionImpactWidget from "@/components/revenue-at-risk/RetentionImpactWidget";
import RecommendedActionsWidget from "@/components/revenue-at-risk/RecommendedActionsWidget";

export default function RevenueAtRiskPage() {
  const [data, setData] = useState<RevenueDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchRevenueData();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch revenue data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-8">
        <Loader2 size={40} className="animate-spin text-indigo-500 mb-4" />
        <p className="text-gray-500 font-medium">Loading revenue data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8 font-sans text-gray-800">
      {/* Ubah xl:pt-0 menjadi lg:pt-0 atau md:pt-0 */}
      <header className="mb-8 pt-20 lg:pt-0">
        <h1 className="text-[22px] md:text-[28px] font-bold text-gray-900 leading-tight">
          Revenue at Risk
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Track and protect your revenue from customer churn
        </p>
      </header>

      {/* Grid Component untuk Metric Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {data.metrics.map((metric, idx) => (
          <TopMetricCard key={idx} metric={metric} />
        ))}
      </div>

      {/* Middle Sections */}
      <RevenueDistributionSection distribution={data.distribution} summary={data.distributionSummary} />
      <HighImpactCustomersSection customers={data.highImpactCustomers} />

      {/* Bottom Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <RetentionImpactWidget data={data.retentionImpact} />
        <RecommendedActionsWidget actions={data.recommendedActions} />
      </div>
    </div>
  );
}