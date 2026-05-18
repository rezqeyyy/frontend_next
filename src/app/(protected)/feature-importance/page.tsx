// src/app/(protected)/feature-importance/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Target,
  Zap,
  Headset,
  LogIn,
  Lightbulb,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  Loader2,
  Activity,
  Smile,
  Wallet,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
} from "lucide-react";

// Import action dan komponen
import { fetchFeatureImportanceStats } from "@/actions/feature-importance";
import CustomerPriorityList from "@/components/feature-importance/CustomerPriorityList";

// IMPORT YANG BENAR: Mengarah ke folder feature-importance
import FeatureImportanceChart from "@/components/feature-importance/FeatureImportanceChart";

export default function FeatureImportancePage() {
  const [currentTime, setCurrentTime] = useState<string>("Memuat waktu...");
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    setMounted(true);

    const loadStats = async () => {
      setLoadingStats(true);
      const data = await fetchFeatureImportanceStats();
      if (!data.error) {
        setStats(data);
      } else {
        console.error("Gagal memuat data:", data.error);
      }
      setLoadingStats(false);
    };

    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const days = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];
      const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
      setCurrentTime(
        `${hours}.${minutes} | ${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`,
      );
    };

    updateTime();
    loadStats();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const iconMap: Record<string, any> = {
    Headset,
    LogIn,
    Activity,
    Clock,
    Smile,
    Zap,
    Wallet,
    Calendar,
    DollarSign,
    TrendingUp,
    Award,
    AlertTriangle,
    AlertCircle,
  };

  const featureData = stats?.featureImportanceDetails
    ? stats.featureImportanceDetails.map((f: any) => ({
        ...f,
        icon: iconMap[f.iconName] || Lightbulb,
      }))
    : [
        {
          id: 1,
          icon: Headset,
          title: "Support Ticket Count",
          importance: 28.5,
          color: "#6366f1",
          desc: "Volume tiket tinggi menandakan ketidakpuasan dan frustrasi.",
          impact: "Tinggi: Banyak komplain dan antrean dukungan teknis.",
          recom: "Prioritaskan resolusi tiket dan penjangkauan proaktif.",
        },
        {
          id: 2,
          icon: LogIn,
          title: "Login Frequency",
          importance: 24.3,
          color: "#8b5cf6",
          desc: "Penurunan frekuensi login adalah indikator kuat churn.",
          impact: "Menengah: Pengguna jarang menggunakan fitur utama.",
          recom: "Kirim email retensi atau tawarkan tur fitur baru.",
        },
        {
          id: 3,
          icon: Activity,
          title: "Low Usage",
          importance: 18.2,
          color: "#f59e0b",
          desc: "Penggunaan fitur utama berada di bawah rata-rata.",
          impact: "Menengah: Risiko downgrade langganan tinggi.",
          recom: "Lakukan sesi pelatihan ulang untuk pengguna.",
        },
      ];

  return (
    <div className="p-4 pt-20 sm:p-6 lg:p-8 max-w-[1400px] mx-auto text-gray-800">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-[22px] md:text-[28px] font-bold text-gray-900 leading-tight">
            Feature Importance
          </h1>
          <p className="text-gray-500 mt-1">
            Understanding which factors drive customer churn
          </p>
        </div>
        <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 shadow-sm font-medium flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          {mounted ? currentTime : "Memuat waktu..."}
        </div>
      </header>

      {loadingStats ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
          <Loader2 size={32} className="animate-spin text-indigo-500 mb-4" />
          <p className="text-gray-500 font-medium">
            Menganalisis data pelanggan...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SummaryCard
              title="Tracked indicators"
              value={stats?.totalFeaturesTracked || "0"}
              unit="Total Features"
              icon={Target}
              color="bg-indigo-50"
              iconColor="text-indigo-600"
            />
            <SummaryCard
              title="High-impact indicators"
              value={stats?.highImpactCount || "0"}
              unit="Critical Factors"
              icon={Zap}
              color="bg-red-50"
              iconColor="text-red-600"
            />
            <SummaryCard
              title="Top Predictor Strength"
              value={`${featureData[0]?.importance || 0}%`}
              unit="Importance"
              icon={BarChart3}
              color="bg-blue-50"
              iconColor="text-blue-600"
            />
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-[24px] p-6 mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500 text-white rounded-lg">
                <Lightbulb size={20} />
              </div>
              <h3 className="font-bold text-blue-900">AI Insights</h3>
            </div>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-2 ml-2">
              <li>
                Top 3 features account for over 70% of churn prediction
                accuracy.
              </li>
              <li>
                Support Ticket volume has a direct correlation with the High
                Risk segment.
              </li>
            </ul>
          </div>

          {/* GRID UNTUK CHART & RANKING */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
            {/* Kolom Kiri: Bar Chart */}
            <section className="flex flex-col h-full">
              {/* Komponen dipanggil dari folder yang benar */}
              <FeatureImportanceChart data={stats?.chartDataFeature} />
            </section>

            {/* Kolom Kanan: Detail Ranking */}
            <section className="flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Feature Ranking Details
                </h3>
                <span className="text-[10px] font-bold text-amber-500 uppercase flex items-center gap-1 italic">
                  <Info size={12} /> Sorted by predictive power
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {featureData.map((feature: any) => (
                  <FeatureRankingCard
                    key={feature.id}
                    icon={feature.icon}
                    title={feature.title}
                    color={feature.color}
                    importance={feature.importance}
                    description={feature.desc}
                    recommendation={feature.recom}
                    businessImpact={feature.impact}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* <section className="mb-10">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Affected Customers
              </h3>
              <p className="text-sm text-gray-500">
                Pelanggan yang paling terdampak berdasarkan metrik di atas.
              </p>
            </div>
            <CustomerPriorityList customers={stats?.topCustomers} />
          </section> */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ActionPanel
              title="Actionable Features"
              icon={Target}
              items={[
                "Improve support speed.",
                "Feature usage monitoring.",
                "Segment outreach.",
              ]}
            />
            <ActionPanel
              title="Early Warning Signals"
              icon={AlertTriangle}
              items={[
                "Login Frequency drops.",
                "Support Tickets surge.",
                "Payment Delays.",
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SummaryCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
  iconColor,
}: any) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5">
      <div
        className={`w-14 h-14 rounded-2xl ${color} ${iconColor} flex items-center justify-center`}
      >
        <Icon size={28} />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 leading-tight mb-1">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-gray-900">{value}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}

function FeatureRankingCard({
  icon: Icon,
  title,
  description,
  importance,
  businessImpact,
  recommendation,
  color,
}: any) {
  return (
    <div className="relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-indigo-100 transition-colors">
      <div
        className="absolute top-0 left-0 h-full opacity-5 transition-all duration-1000"
        style={{ width: `${importance}%`, backgroundColor: color }}
      />
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 rounded-xl bg-gray-50 text-gray-600 mt-1 sm:mt-0">
            <Icon size={20} />
          </div>
          <div className="max-w-xl">
            <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {description}
            </p>
            <p className="text-[11px] text-gray-500 mt-1 italic">
              Impact: {businessImpact}
            </p>
            {recommendation && (
              <div className="mt-2 text-xs">
                <span className="text-blue-500 font-bold">💡 Tip: </span>
                <span className="text-gray-600">{recommendation}</span>
              </div>
            )}
          </div>
        </div>
        <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-gray-50 pt-3 sm:pt-0">
          <span className="text-xl font-black block" style={{ color }}>
            {importance}%
          </span>
        </div>
      </div>
    </div>
  );
}

function ActionPanel({ title, icon: Icon, items }: any) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-50 text-gray-600 rounded-xl border border-gray-100">
          <Icon size={20} />
        </div>
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>
      <ul className="space-y-4">
        {items.map((item: string, i: number) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
