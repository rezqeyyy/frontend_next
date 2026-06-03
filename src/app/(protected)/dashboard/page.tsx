'use client';

import {
  User,
  UserX,
  DollarSign,
  Gauge,
  HelpCircle,
  AlertTriangle,
  Loader2,
  AlertCircle,
  Activity,
  CreditCard,
  MessageSquare,
  LogOut
} from 'lucide-react';

import { useCurrentTime } from '@/hooks/useCurrentTime';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { AlertItem } from '@/components/dashboard/AlertItem';
import { FilterDropdown } from '@/components/dashboard/FilterDropdown';
import CustomerPriorityList from '@/components/dashboard/CustomerPriorityList';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import { FactorItem } from '@/components/dashboard/FactorItem';
import { InsightCard } from '@/components/dashboard/InsightCard';

export default function DashboardPage() {
  const { currentTime, mounted } = useCurrentTime();
  const { stats, loadingStats } = useDashboardStats(); 

  return (
    <div className="p-4 pt-24 sm:pt-28 md:pt-16 lg:pt-10 sm:p-6 lg:p-8 max-w-[1600px] mx-auto text-gray-800 overflow-x-hidden">
      
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 w-full">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight break-words">
            Customer Churn Dashboard
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Real time prediction churn for users</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-shrink-0">
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 shadow-sm font-medium text-center min-w-[200px] sm:min-w-[220px] flex-1 sm:flex-none flex items-center justify-center">
            {mounted ? currentTime : 'Memuat waktu...'}
          </div>
          <div className="flex-none">
            <FilterDropdown />
          </div>
        </div>
      </header>

      {/* KPI CARDS (Full Width) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-5 min-h-[140px]">
        {loadingStats ? (
          <div className="col-span-full flex items-center justify-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm gap-2 text-gray-400">
             <Loader2 size={18} className="animate-spin" /> Menghitung statistik...
          </div>
        ) : (
          <>
            <KpiCard title="Total Customer" value={stats?.totalActiveCustomers?.value?.toLocaleString() || "0"} trend={stats?.totalActiveCustomers?.trend || 0} isPositive={stats?.totalActiveCustomers?.isPositive} color="blue" icon={User} />
            <KpiCard title="High Risk Customer" value={stats?.totalHighRisk?.value?.toLocaleString() || "0"} trend={stats?.totalHighRisk?.trend || 0} isPositive={stats?.totalHighRisk?.isPositive} color="red" icon={UserX} />
            <KpiCard title="Revenue at Risk" value={`$${stats?.revenueAtRisk?.value?.toLocaleString() || "0"}`} trend={stats?.revenueAtRisk?.trend || 0} isPositive={stats?.revenueAtRisk?.isPositive} color="red" icon={DollarSign} />
            <KpiCard title="Avg. Churn Risk Score" value={`${stats?.avgChurnScore?.value || 0}%`} trend={stats?.avgChurnScore?.trend || 0} isPositive={stats?.avgChurnScore?.isPositive} color="blue" icon={Gauge} />
          </>
        )}
      </div>

      {/* 2-COLUMN LAYOUT (Kiri & Kanan) */}
      <div className="flex flex-col lg:flex-row gap-5 items-start mb-5">
        
        {/* LEFT COLUMN */}
        <div className="w-full lg:flex-1 min-w-0 flex flex-col gap-5">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <DashboardSection title="Churn Risk Trend" chartType="Line Chart" data={stats?.chartData} className="xl:col-span-2" />
            <DashboardSection title="Risk Distribution" chartType="Donut Chart" className="xl:col-span-1" />
          </div>
          <CustomerPriorityList />
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-[320px] lg:flex-shrink-0 flex flex-col gap-5">
          <div className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col max-h-[420px]">
            <SectionHeader title="Alerts" linkText="View all" />
            <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
              {loadingStats ? (
                <div className="flex items-center justify-center p-6 text-gray-400 text-sm">
                  <Loader2 size={16} className="animate-spin mr-2" /> Mengecek sistem...
                </div>
              ) : stats?.alerts?.length > 0 ? (
                stats.alerts.map((alert: any, idx: number) => (
                  <AlertItem key={idx} type={alert.type} title={alert.title} desc={alert.desc} time={alert.time} />
                ))
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">Belum ada peringatan aktivitas.</div>
              )}
            </div>
          </div>
          
          <InsightCard title="AI Insight" icon={HelpCircle} desc="70% dari pelanggan beresiko tinggi mengalami penurunan aktivitas dalam 2 minggu terakhir." href="/prediction-results" />
          <InsightCard title="Top Recommendation" icon={AlertTriangle} desc="Prioritaskan outreach ke 312 pelanggan beresiko tinggi dengan onboarding ulang." href="/customer-list" />
        </div>
      </div>

      {/* FACTORS SECTION (Full Width - Udah di luar dari kolom kiri) */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <SectionHeader title="Why Customers Are At Risk?" subtitle="Top factors contributing to churn" linkText="Chat Bot" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          <FactorItem icon={AlertCircle} label="High Tickets" value="35%" color="text-red-500" bg="bg-red-50/50" border="border-red-200" />
          <FactorItem icon={LogOut} label="Rarely Login" value="28%" color="text-orange-500" bg="bg-orange-50/50" border="border-orange-200" />
          <FactorItem icon={Activity} label="Low Usage" value="24%" color="text-yellow-500" bg="bg-yellow-50/50" border="border-yellow-200" />
          <FactorItem icon={CreditCard} label="Payment Issue" value="15%" color="text-purple-500" bg="bg-purple-50/50" border="border-purple-200" />
          <FactorItem icon={MessageSquare} label="Low NPS" value="12%" color="text-blue-500" bg="bg-blue-50/50" border="border-blue-200" />
        </div>
      </div>

    </div>
  );
}