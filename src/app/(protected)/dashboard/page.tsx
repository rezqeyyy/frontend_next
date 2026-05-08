'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link buat navigasi antar page
import { 
  ArrowUp, 
  User, 
  UserX, 
  DollarSign, 
  Gauge, 
  LogOut, 
  HelpCircle, 
  AlertTriangle 
} from 'lucide-react';

// Import Komponen Clean Code
import { KpiCard } from '@/components/dashboard/KpiCard';
import { TableRow } from '@/components/dashboard/TableRow';
import { AlertItem } from '@/components/dashboard/AlertItem';
import { FilterDropdown } from '@/components/dashboard/FilterDropdown';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import ChurnRiskChart from '@/components/dashboard/ChurnRiskChart';

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState<string>('Memuat waktu...');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      
      setCurrentTime(`${hours}.${minutes} | ${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4 pt-20 sm:p-6 lg:p-8 lg:pt-8 max-w-[1600px] mx-auto text-gray-800">
      
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">Customer Churn</h1>
          <p className="text-gray-400 mt-1 text-sm">Real time prediction churn for users</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 shadow-sm font-medium flex-1 sm:flex-none text-center min-w-[220px]">
            {mounted ? currentTime : 'Memuat waktu...'}
          </div>
          <FilterDropdown />
        </div>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-5">
        <KpiCard title="Total Customer" value="3000" trend={8} isPositive={true} color="blue" icon={User} />
        <KpiCard title="High Risk Customer" value="30" trend={8} isPositive={true} color="red" icon={UserX} />
        <KpiCard title="Revenue at Risk" value="$284,000" trend={10.2} isPositive={true} color="red" icon={DollarSign} />
        <KpiCard title="Avg. Churn Risk Score" value="300" trend={8} isPositive={false} color="blue" icon={Gauge} />
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:flex-1 flex flex-col gap-5">
          {/* Charts Row Placeholder */}
          <div className="flex flex-col xl:flex-row gap-5">
            <DashboardSection title="Churn Risk Trend" chartType="Line Chart" />
            <DashboardSection title="Risk Distribution" chartType="Donut Chart" className="xl:w-[320px]" />
          </div>

          {/* Customer Table */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
            <SectionHeader title="Customer Priority List" linkText="View all" />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="pb-3 font-medium px-2">#</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Risk Score</th>
                    <th className="pb-3 font-medium">Rank</th>
                    <th className="pb-3 font-medium">Segment</th>
                    <th className="pb-3 font-medium">Revenue</th>
                    <th className="pb-3 font-medium">Activity</th>
                    <th className="pb-3 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <TableRow no={1} name="Tatang Suretang" score={82} rank="High" segment="All Risk User" revenue="$284,000" activity="5 days ago" />
                  <TableRow no={2} name="Asep Knalpot" score={65} rank="Medium" segment="Reguler User" revenue="$120,000" activity="2 days ago" />
                  <TableRow no={3} name="Ujang Racing" score={35} rank="Low" segment="Power User" revenue="$90,000" activity="1 day ago" />
                </tbody>
              </table>
            </div>
          </div>

          {/* Factors Section */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <SectionHeader title="Why Customers Are At Risk?" subtitle="Top factors contributing to churn" linkText="Chat Bot" />
            <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
              {[...Array(5)].map((_, i) => (
                <FactorItem key={i} label="Rarely login" value="30%" />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-[320px] flex flex-col gap-5">
          <div className="flex-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <SectionHeader title="Alerts" linkText="View all" />
            <div className="flex flex-col gap-3">
              <AlertItem type="danger" title="Customer Churn" desc="Real time prediction churn for users" time="3m ago" />
              <AlertItem type="warning" title="Activity Drop" desc="Drop 45%" time="3m ago" />
              <AlertItem type="info" title="No login" desc="Real time prediction churn for users" time="3m ago" />
            </div>
          </div>
          
          {/* UPDATE: Sekarang lu bisa masukin link tujuan di properti 'href' */}
          <InsightCard 
            title="AI Insight" 
            icon={HelpCircle} 
            desc="70% dari pelanggan beresiko tinggi mengalami penurunan aktivitas dalam 2 minggu terakhir." 
            href="/prediction-results" 
          />
          <InsightCard 
            title="Top Recommendation" 
            icon={AlertTriangle} 
            desc="Prioritaskan outreach ke 312 pelanggan beresiko tinggi dengan onboarding ulang." 
            href="/customer-list" 
          />
        </div>
      </div>
    </div>
  );
}

// --- SMALL INTERNAL HELPERS ---
function SectionHeader({ title, subtitle, linkText }: any) {
  return (
    <div className="flex justify-between items-center mb-5">
      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <span className="text-sm text-blue-500 font-medium cursor-pointer flex items-center gap-1 hover:underline">
        {linkText} <ArrowUp className="rotate-45" size={14} />
      </span>
    </div>
  );
}

// UPDATE: Ditambah prop 'href' dan dibungkus komponen <Link>
function InsightCard({ title, icon: Icon, desc, href }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Icon size={20} /></div>
        <h3 className="font-bold text-gray-900 mt-1">{title}</h3>
      </div>
      <p className="text-[13px] text-gray-500 leading-relaxed mb-4">{desc}</p>
      
      {/* Tombol dibungkus Link agar navigasi ke page tujuan jalan */}
      <Link href={href || "#"}>
        <button className="w-full border border-blue-500 text-blue-500 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition">
            View Details
        </button>
      </Link>
    </div>
  );
}

function FactorItem({ label, value }: any) {
  return (
    <div className="flex items-center gap-4 min-w-[160px] flex-shrink-0">
      <div className="w-12 h-12 rounded-full border-2 border-blue-200 bg-blue-50/20 flex items-center justify-center text-blue-500"><LogOut size={20} /></div>
      <div className="flex flex-col">
        <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">{label}</span>
        <span className="text-xl font-bold text-gray-800 leading-tight">{value}</span>
      </div>
    </div>
  );
}

function DashboardSection({ title, chartType, data, className = "" }: any) { // 1. Tambah 'data' di sini
  return (
    <div className={`flex-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        <select className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white outline-none">
          <option>Last 30 days</option>
        </select>
      </div>
      
      <div className="w-full h-[220px]">
        {chartType === "Line Chart" ? (
          <ChurnRiskChart data={data} /> // 2. Kirim data ke sini
        ) : (
          <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200 text-gray-400 text-sm">
            [{chartType}]
          </div>
        )}
      </div>
    </div>
  );
}