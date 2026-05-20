'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowUp,
  User,
  UserX,
  DollarSign,
  Gauge,
  LogOut,
  HelpCircle,
  AlertTriangle,
  Loader2,
  AlertCircle,
  Activity,
  CreditCard,
  MessageSquare,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Import Komponen Clean Code
import { KpiCard } from '@/components/dashboard/KpiCard';
import { AlertItem } from '@/components/dashboard/AlertItem';
import { FilterDropdown } from '@/components/dashboard/FilterDropdown';
import ChurnRiskChart from '@/components/dashboard/ChurnRiskChart';
import CustomerPriorityList from '@/components/dashboard/CustomerPriorityList';

// Import Server Action buat ambil data statistik Real-time
import { fetchDashboardStats } from '@/actions/dashboard';

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState<string>('Memuat waktu...');
  const [mounted, setMounted] = useState(false);
  
  // State untuk Statistik KPI & Alerts
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // 1. Fungsi Ngambil Data Real-time
    const loadStats = async () => {
      setLoadingStats(true);
      const data = await fetchDashboardStats();
      if (!data.error) {
        setStats(data);
      } else {
        console.error("Gagal load dashboard stats:", data.error);
      }
      setLoadingStats(false);
    };

    // 2. Fungsi Update Waktu
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      setCurrentTime(`${hours}.${minutes} | ${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
    };

    updateTime();
    loadStats(); // Tarik data pas page dibuka
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    // FIX BREAKPOINT: Menaikkan pt- untuk mobile (pt-24) dan sm/tablet (sm:pt-28) agar judul tidak tersembunyi di balik navbar saat bertumpuk vertikal, namun tetap ciamik di layar lebar (lg:pt-10)
    <div className="p-4 pt-24 sm:pt-28 md:pt-16 lg:pt-10 sm:p-6 lg:p-8 max-w-[1600px] mx-auto text-gray-800 overflow-x-hidden">
      
      {/* HEADER - OPTIMASI RESPONSIVE GRID/FLEX */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 w-full">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight break-words">
            Customer Churn Dashboard
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Real time prediction churn for users</p>
        </div>
        
        {/* Kontrol Waktu & Filter dibuat fleksibel tanpa memakan space berlebih */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-shrink-0">
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 shadow-sm font-medium text-center min-w-[200px] sm:min-w-[220px] flex-1 sm:flex-none flex items-center justify-center">
            {mounted ? currentTime : 'Memuat waktu...'}
          </div>
          <div className="flex-none">
            <FilterDropdown />
          </div>
        </div>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-5 min-h-[140px]">
        {loadingStats ? (
          <div className="col-span-full flex items-center justify-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm gap-2 text-gray-400">
             <Loader2 size={18} className="animate-spin" /> Menghitung statistik...
          </div>
        ) : (
          <>
            <KpiCard title="Total Customer" value={stats?.totalActiveCustomers?.toLocaleString() || "0"} trend={8} isPositive={true} color="blue" icon={User} />
            <KpiCard title="High Risk Customer" value={stats?.totalHighRisk?.toLocaleString() || "0"} trend={8} isPositive={false} color="red" icon={UserX} />
            <KpiCard title="Revenue at Risk" value={`$${stats?.revenueAtRisk?.toLocaleString() || "0"}`} trend={10.2} isPositive={false} color="red" icon={DollarSign} />
            <KpiCard title="Avg. Churn Risk Score" value={`${stats?.avgChurnScore || 0}%`} trend={8} isPositive={false} color="blue" icon={Gauge} />
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        
        {/* LEFT COLUMN */}
        <div className="w-full lg:flex-1 min-w-0 flex flex-col gap-5">
          {/* Charts Row Placeholder */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <DashboardSection title="Churn Risk Trend" chartType="Line Chart" data={stats?.chartData} className="xl:col-span-2" />
            <DashboardSection title="Risk Distribution" chartType="Donut Chart" className="xl:col-span-1" />
          </div>

          {/* CUSTOMER PRIORITY LIST */}
          <CustomerPriorityList />

          {/* Factors Section */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <SectionHeader title="Why Customers Are At Risk?" subtitle="Top factors contributing to churn" linkText="Chat Bot" />
            <div className="flex items-center gap-6 overflow-x-auto pb-2 custom-scrollbar">
              <FactorItem icon={AlertCircle} label="High Tickets" value="35%" color="text-red-500" bg="bg-red-50/50" border="border-red-200" />
              <FactorItem icon={LogOut} label="Rarely Login" value="28%" color="text-orange-500" bg="bg-orange-50/50" border="border-orange-200" />
              <FactorItem icon={Activity} label="Low Usage" value="24%" color="text-yellow-500" bg="bg-yellow-50/50" border="border-yellow-200" />
              <FactorItem icon={CreditCard} label="Payment Issue" value="15%" color="text-purple-500" bg="bg-purple-50/50" border="border-purple-200" />
              <FactorItem icon={MessageSquare} label="Low NPS" value="12%" color="text-blue-500" bg="bg-blue-50/50" border="border-blue-200" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-[320px] lg:flex-shrink-0 flex flex-col gap-5">
          
          {/* ALERTS SECTION */}
          <div className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col max-h-[420px]">
            <SectionHeader title="Alerts" linkText="View all" />
            <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
              {loadingStats ? (
                <div className="flex items-center justify-center p-6 text-gray-400 text-sm">
                  <Loader2 size={16} className="animate-spin mr-2" /> Mengecek sistem...
                </div>
              ) : stats?.alerts?.length > 0 ? (
                stats.alerts.map((alert: any, idx: number) => (
                  <AlertItem 
                    key={idx} 
                    type={alert.type} 
                    title={alert.title} 
                    desc={alert.desc} 
                    time={alert.time} 
                  />
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

function InsightCard({ title, icon: Icon, desc, href }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Icon size={20} /></div>
        <h3 className="font-bold text-gray-900 mt-1">{title}</h3>
      </div>
      <p className="text-[13px] text-gray-500 leading-relaxed mb-4">{desc}</p>
      <Link href={href || "#"}>
        <button className="w-full border border-blue-500 text-blue-500 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition">
            View Details
        </button>
      </Link>
    </div>
  );
}

function FactorItem({ label, value, icon: Icon, color, bg, border }: any) {
  return (
    <div className="flex items-center gap-4 min-w-[180px] flex-shrink-0">
      <div className={`w-12 h-12 rounded-full border-2 ${border} ${bg} flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">{label}</span>
        <span className="text-xl font-bold text-gray-800 leading-tight">{value}</span>
      </div>
    </div>
  );
}

// Convert "YYYY-MM" -> "May 2024"
const MONTH_ABBR_LABEL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function formatMonthLabel(key: string) {
  const [y, m] = key.split('-');
  const idx = parseInt(m, 10) - 1;
  if (!y || isNaN(idx) || idx < 0 || idx > 11) return key;
  return `${MONTH_ABBR_LABEL[idx]} ${y}`;
}

// Calendar-style month/year picker
function MonthYearPicker({
  value,
  onChange,
  availableMonths,
  align = 'right',
  ariaLabel,
}: {
  value: string;
  onChange: (key: string) => void;
  availableMonths: Set<string>;
  align?: 'left' | 'right';
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const initialYear = (() => {
    const y = parseInt(value?.split('-')[0] || '', 10);
    return isNaN(y) ? new Date().getFullYear() : y;
  })();
  const [viewYear, setViewYear] = useState(initialYear);

  const yearsAvailable = Array.from(availableMonths).map((m) => parseInt(m.split('-')[0], 10));
  const minYear = yearsAvailable.length ? Math.min(...yearsAvailable) : initialYear;
  const maxYear = yearsAvailable.length ? Math.max(...yearsAvailable) : initialYear;

  useEffect(() => {
    const y = parseInt(value?.split('-')[0] || '', 10);
    if (!isNaN(y)) setViewYear(y);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const isDisabled = availableMonths.size === 0;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => !isDisabled && setOpen((o) => !o)}
        disabled={isDisabled}
        aria-label={ariaLabel}
        className={`text-xs border rounded-md px-2.5 py-1.5 bg-white outline-none transition font-medium shadow-sm flex items-center gap-1.5 ${
          isDisabled
            ? 'border-gray-100 text-gray-300 cursor-not-allowed'
            : open
            ? 'border-blue-400 text-blue-600'
            : 'border-gray-200 text-gray-600 hover:border-blue-400 cursor-pointer'
        }`}
      >
        <Calendar size={12} />
        <span>{value ? formatMonthLabel(value) : '—'}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className={`absolute top-full mt-2 w-[260px] bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 p-4 z-50 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setViewYear((y) => Math.max(minYear, y - 1))}
              disabled={viewYear <= minYear}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Previous year"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-bold text-sm text-gray-900 tracking-tight">{viewYear}</span>
            <button
              type="button"
              onClick={() => setViewYear((y) => Math.min(maxYear, y + 1))}
              disabled={viewYear >= maxYear}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Next year"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {MONTH_ABBR_LABEL.map((m, i) => {
              const key = `${viewYear}-${String(i + 1).padStart(2, '0')}`;
              const isAvailable = availableMonths.has(key);
              const isSelected = key === value;
              return (
                <button
                  key={m}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                  className={`py-2 rounded-lg text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                      : isAvailable
                      ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardSection({ title, chartType, data, className = "" }: any) {
  const months: string[] = Array.isArray(data) ? data.map((d: any) => d.fullName) : [];
  const monthSet = new Set(months);

  const [fromKey, setFromKey] = useState<string>('');
  const [toKey, setToKey] = useState<string>('');

  useEffect(() => {
    if (months.length > 0) {
      setFromKey(months[0]);
      setToKey(months[months.length - 1]);
    } else {
      setFromKey('');
      setToKey('');
    }
  }, [months.length, months[0], months[months.length - 1]]);

  const fromIdx = months.indexOf(fromKey);
  const toIdx = months.indexOf(toKey);
  const safeFrom = Math.min(fromIdx === -1 ? 0 : fromIdx, toIdx === -1 ? 0 : toIdx);
  const safeTo = Math.max(fromIdx === -1 ? 0 : fromIdx, toIdx === -1 ? 0 : toIdx);
  const displayData = Array.isArray(data) && months.length > 0 ? data.slice(safeFrom, safeTo + 1) : [];

  return (
    <div className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>

        {chartType === "Line Chart" && (
          <div className="flex items-center gap-2 flex-wrap">
            <MonthYearPicker
              value={fromKey}
              onChange={setFromKey}
              availableMonths={monthSet}
              ariaLabel="From month"
              align="right"
            />
            <span className="text-xs text-gray-400 font-medium">to</span>
            <MonthYearPicker
              value={toKey}
              onChange={setToKey}
              availableMonths={monthSet}
              ariaLabel="To month"
              align="right"
            />
          </div>
        )}
      </div>

      <div className="w-full h-[220px]">
        {chartType === "Line Chart" ? (
          <ChurnRiskChart data={displayData} />
        ) : (
          <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200 text-gray-400 text-sm">
            [{chartType}]
          </div>
        )}
      </div>
    </div>
  );
}