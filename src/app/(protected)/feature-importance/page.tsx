"use client";

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

// Imports - Hook
import { useFeatureImportance } from "@/hooks/useFeatureImportance";
import { useCurrentTime } from "@/hooks/useCurrentTime"; 

// Imports - Components
import FeatureImportanceChart from "@/components/feature-importance/FeatureImportanceChart";
import { SummaryCard } from "@/components/feature-importance/SummaryCard";
import { FeatureRankingCard } from "@/components/feature-importance/FeatureRankingCard";
import { ActionPanel } from "@/components/feature-importance/ActionPanel";

// --- TYPES & CONSTANTS ---
type FeatureData = {
  id: number | string;
  icon: any;
  title: string;
  importance: number;
  color: string;
  desc: string;
  impact: string;
  recom: string;
};

const ICON_MAP: Record<string, any> = {
  Headset, LogIn, Activity, Clock, Smile, Zap, Wallet, 
  Calendar, DollarSign, TrendingUp, Award, AlertTriangle, AlertCircle,
};

const DEFAULT_FEATURE_DATA: FeatureData[] = [
  {
    id: 1,
    icon: Headset,
    title: "Support Ticket Count",
    importance: 28.5,
    color: "#6366f1",
    desc: "High ticket volume indicates customer dissatisfaction and frustration.",
    impact: "High: Numerous complaints and technical support queues.",
    recom: "Prioritize ticket resolution and initiate proactive outreach.",
  },
  {
    id: 2,
    icon: LogIn,
    title: "Login Frequency",
    importance: 24.3,
    color: "#8b5cf6",
    desc: "A drop in login frequency is a strong indicator of potential churn.",
    impact: "Medium: Users are rarely engaging with core features.",
    recom: "Send retention emails or offer guided tours of new features.",
  },
  {
    id: 3,
    icon: Activity,
    title: "Low Usage",
    importance: 18.2,
    color: "#f59e0b",
    desc: "Core feature usage has dropped below the active average.",
    impact: "Medium: High risk of subscription downgrade.",
    recom: "Conduct retraining sessions or webinars for existing users.",
  },
];

// --- MAIN COMPONENT ---
export default function FeatureImportancePage() {
  const { currentTime, mounted } = useCurrentTime();
  const { stats, isLoading } = useFeatureImportance();

  const featureData: FeatureData[] = stats?.featureImportanceDetails
    ? stats.featureImportanceDetails.map((f: any) => ({
        ...f,
        icon: ICON_MAP[f.iconName] || Lightbulb,
      }))
    : DEFAULT_FEATURE_DATA;

  return (
    // PENTING: pt-20 dihapus dari sini
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto text-gray-800">
      
      {/* HEADER */}
      {/* PENTING: pt-20 dan lg:pt-0 dipindahkan ke sini */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 pt-20 lg:pt-0">
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
          {mounted ? currentTime : "Loading time..."}
        </div>
      </header>

      {/* CONTENT AREA */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
          <Loader2 size={32} className="animate-spin text-indigo-500 mb-4" />
          <p className="text-gray-500 font-medium">Analyzing customer data...</p>
        </div>
      ) : (
        <>
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SummaryCard title="Tracked Indicators" value={stats?.totalFeaturesTracked || "0"} unit="Total Features" icon={Target} color="bg-indigo-50" iconColor="text-indigo-600" />
            <SummaryCard title="High-Impact Indicators" value={stats?.highImpactCount || "0"} unit="Critical Factors" icon={Zap} color="bg-red-50" iconColor="text-red-600" />
            <SummaryCard title="Top Predictor Strength" value={`${featureData[0]?.importance || 0}%`} unit="Importance" icon={BarChart3} color="bg-blue-50" iconColor="text-blue-600" />
          </div>

          {/* AI INSIGHTS */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-[24px] p-6 mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500 text-white rounded-lg">
                <Lightbulb size={20} />
              </div>
              <h3 className="font-bold text-blue-900">AI Insights</h3>
            </div>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-2 ml-2">
              <li>Top 3 features account for over 70% of churn prediction accuracy.</li>
              <li>Support Ticket volume has a direct correlation with the High Risk segment.</li>
            </ul>
          </div>

          {/* CHARTS & RANKING DETAILS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
            <section className="flex flex-col h-full">
              <FeatureImportanceChart data={stats?.chartDataFeature} />
            </section>

            <section className="flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Feature Ranking Details</h3>
                <span className="text-[10px] font-bold text-amber-500 uppercase flex items-center gap-1 italic">
                  <Info size={12} /> Sorted by predictive power
                </span>
              </div>
              
              <div className="flex flex-col gap-4">
                {featureData.map((feature: FeatureData) => (
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

          {/* ACTION PANELS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ActionPanel
              title="Actionable Features"
              icon={Target}
              items={[
                "Improve support response speed.",
                "Monitor core feature usage closely.",
                "Implement segmented customer outreach.",
              ]}
            />
            <ActionPanel
              title="Early Warning Signals"
              icon={AlertTriangle}
              items={[
                "Sudden drops in login frequency.",
                "Unusual surges in support tickets.",
                "Delays in subscription payments.",
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}