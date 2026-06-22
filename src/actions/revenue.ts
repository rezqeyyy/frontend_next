"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { RevenueDashboardData, RecommendedAction } from "@/types/revenue";

function formatMoney(n: number): string {
  if (!isFinite(n) || n === 0) return "$0";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

function formatLastLogin(inactivityDays: number): string {
  const d = Math.max(0, Math.round(inactivityDays || 0));
  if (d === 0) return "today";
  if (d === 1) return "1 day ago";
  if (d < 7) return `${d} days ago`;
  if (d < 30) return `${Math.round(d / 7)} weeks ago`;
  if (d < 365) return `${Math.round(d / 30)} months ago`;
  return `${(d / 365).toFixed(1)} years ago`;
}

function formatAccountAge(subscriptionAge: number): string {
  const m = Math.max(0, Math.round(subscriptionAge || 0));
  if (m < 12) return `${m} months`;
  const years = m / 12;
  return years >= 2 ? `${years.toFixed(1)} day` : `${m} months`;
}

function deriveChurnFactors(c: any, avgs: Record<string, number>): string[] {
  const factors: { label: string; weight: number }[] = [];
  if ((c.count_ticket_id || 0) > avgs.tickets)
    factors.push({
      label: "Support Tickets",
      weight: c.count_ticket_id / (avgs.tickets || 1),
    });
  if ((c.inactivity_days || 0) > avgs.inactivity)
    factors.push({
      label: "Long Inactivity",
      weight: c.inactivity_days / (avgs.inactivity || 1),
    });
  if ((c.average_nps_score || 0) > 0 && c.average_nps_score < avgs.nps)
    factors.push({ label: "Low NPS", weight: avgs.nps - c.average_nps_score });
  if ((c.feature_adoption_pct || 0) < avgs.adoption)
    factors.push({
      label: "Low Feature Adoption",
      weight: avgs.adoption - c.feature_adoption_pct,
    });
  if (c.late_payment_flag === 1)
    factors.push({ label: "Late Payment", weight: 2 });
  if (c.low_usage_flag === 1) factors.push({ label: "Low Usage", weight: 2 });
  return factors
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((f) => f.label);
}

export async function fetchRevenueData(): Promise<RevenueDashboardData> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const empty: RevenueDashboardData = {
    metrics: [
      {
        title: "Total Revenue at Risk",
        amount: "$0",
        subtitle: "From high-risk customers",
        subtext: "No data yet",
        type: "danger",
      },
      {
        title: "Active Revenue",
        amount: "$0",
        subtitle: "From active customers",
        subtext: "—",
        type: "warning",
      },
      {
        title: "Avg Churn Score",
        amount: "0%",
        subtitle: "Across portfolio",
        subtext: "—",
        type: "caution",
      },
      {
        title: "Protected Revenue",
        amount: "$0",
        subtitle: "From low-risk customers",
        subtext: "—",
        type: "success",
      },
    ],
    distribution: [
      {
        level: "High Risk",
        amount: "$0",
        percentage: 0,
        colorClass: "bg-red-500",
        bgClass: "bg-red-50",
      },
      {
        level: "Medium Risk",
        amount: "$0",
        percentage: 0,
        colorClass: "bg-orange-400",
        bgClass: "bg-orange-50",
      },
      {
        level: "Low Risk",
        amount: "$0",
        percentage: 0,
        colorClass: "bg-emerald-500",
        bgClass: "bg-emerald-50",
      },
    ],
    distributionSummary: { totalRevenue: "$0", atRisk: "$0", protected: "$0" },
    highImpactCustomers: [],
    retentionImpact: {
      currentChurn: 0,
      savedBy50Percent: "$0",
      annualSavings: "$0",
      roiPercentage: 0,
    },
    recommendedActions: [],
  };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return empty;

  const { data: userDatasets } = await supabase
    .from("datasets")
    .select("id")
    .eq("user_id", user.id);
  const datasetIds = userDatasets?.map((d) => d.id) || [];
  if (datasetIds.length === 0) return empty;

  const { data: rowsRaw } = await supabase
    .from("customers")
    .select(
      "customer_id, sum_payment_value, churn_risk_score, churn_actual, rank_level, revenue_at_risk, inactivity_days, subscription_age, count_ticket_id, average_nps_score, feature_adoption_pct, late_payment_flag, low_usage_flag",
    )
    .in("dataset_id", datasetIds)
    .limit(10000);

  const rows = (rowsRaw as any[]) || [];
  if (rows.length === 0) return empty;

  const sumPay = (filter: (r: any) => boolean) =>
    rows
      .filter(filter)
      .reduce((s, r) => s + (Number(r.sum_payment_value) || 0), 0);

  const totalRevenue = sumPay(() => true);
  const highRevenue = sumPay((r) => r.rank_level === "High");
  const mediumRevenue = sumPay((r) => r.rank_level === "Medium");
  const lowRevenue = sumPay((r) => r.rank_level === "Low");
  const activeRevenue = sumPay((r) => Number(r.churn_actual) === 0);
  const atRiskRevenue = highRevenue + mediumRevenue;

  const avgChurnScore = Math.round(
    rows.reduce((s, r) => s + (Number(r.churn_risk_score) || 0), 0) /
      rows.length,
  );
  const highRiskCount = rows.filter((r) => r.rank_level === "High").length;
  const mediumRiskCount = rows.filter((r) => r.rank_level === "Medium").length;
  const lowRiskCount = rows.filter((r) => r.rank_level === "Low").length;

  const pct = (part: number, whole: number) =>
    whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0;

  const metrics: RevenueDashboardData["metrics"] = [
    {
      title: "Total Revenue at Risk",
      amount: formatMoney(atRiskRevenue),
      subtitle: "High + Medium risk customers",
      subtext: `${highRiskCount + mediumRiskCount} customers exposed`,
      type: "danger",
    },
    {
      title: "Active Revenue",
      amount: formatMoney(activeRevenue),
      subtitle: "From active (non-churned) customers",
      subtext: `${rows.filter((r) => Number(r.churn_actual) === 0).length} active accounts`,
      type: "warning",
    },
    {
      title: "Avg Churn Score",
      amount: `${avgChurnScore}%`,
      subtitle: "Portfolio average risk",
      subtext: `${highRiskCount} customers in High tier`,
      type: "caution",
    },
    {
      title: "Protected Revenue",
      amount: formatMoney(lowRevenue),
      subtitle: "From low-risk customers",
      subtext: `${lowRiskCount} loyal accounts`,
      type: "success",
    },
  ];

  const distribution: RevenueDashboardData["distribution"] = [
    {
      level: "High Risk",
      amount: formatMoney(highRevenue),
      percentage: pct(highRevenue, totalRevenue),
      colorClass: "bg-red-500",
      bgClass: "bg-red-50",
    },
    {
      level: "Medium Risk",
      amount: formatMoney(mediumRevenue),
      percentage: pct(mediumRevenue, totalRevenue),
      colorClass: "bg-orange-400",
      bgClass: "bg-orange-50",
    },
    {
      level: "Low Risk",
      amount: formatMoney(lowRevenue),
      percentage: pct(lowRevenue, totalRevenue),
      colorClass: "bg-emerald-500",
      bgClass: "bg-emerald-50",
    },
  ];

  const distributionSummary: RevenueDashboardData["distributionSummary"] = {
    totalRevenue: formatMoney(totalRevenue),
    atRisk: formatMoney(atRiskRevenue),
    protected: formatMoney(lowRevenue),
  };

  const avgs = {
    tickets:
      rows.reduce((s, r) => s + (Number(r.count_ticket_id) || 0), 0) /
      rows.length,
    inactivity:
      rows.reduce((s, r) => s + (Number(r.inactivity_days) || 0), 0) /
      rows.length,
    nps:
      rows.reduce((s, r) => s + (Number(r.average_nps_score) || 0), 0) /
      rows.length,
    adoption:
      rows.reduce((s, r) => s + (Number(r.feature_adoption_pct) || 0), 0) /
      rows.length,
  };

  const scoreCustomer = (r: any) => {
    const explicit = Number(r.revenue_at_risk) || 0;
    if (explicit > 0) return explicit;
    return (
      (Number(r.sum_payment_value) || 0) *
      ((Number(r.churn_risk_score) || 0) / 100)
    );
  };

  const highImpactCustomers: RevenueDashboardData["highImpactCustomers"] = rows
    .filter((r) => r.rank_level === "High" || r.rank_level === "Medium")
    .sort((a, b) => scoreCustomer(b) - scoreCustomer(a))
    .slice(0, 3)
    .map((r) => {
      const potential = scoreCustomer(r);
      const riskLevel: "high" | "medium" | "low" =
        r.rank_level === "High"
          ? "high"
          : r.rank_level === "Medium"
            ? "medium"
            : "low";
      return {
        id: String(r.customer_id ?? "—"),
        churnRisk: Math.round(Number(r.churn_risk_score) || 0),
        lastLogin: formatLastLogin(Number(r.inactivity_days) || 0),
        impactCustomers: 1,
        impactTotal: formatMoney(potential),
        totalSpent: formatMoney(Number(r.sum_payment_value) || 0),
        potentialLoss: formatMoney(potential),
        accountAge: formatAccountAge(Number(r.subscription_age) || 0),
        churnFactors: deriveChurnFactors(r, avgs),
        riskLevel,
      };
    });

  const churnedCount = rows.filter((r) => Number(r.churn_actual) === 1).length;
  const avgRevPerCustomer = totalRevenue / rows.length;
  const monthlyChurnLoss = churnedCount * avgRevPerCustomer;
  const savedBy50 = monthlyChurnLoss * 0.5;
  const annualSavings = savedBy50 * 12;
  const retentionCostAssumption = Math.max(annualSavings * 0.2, 1);
  const roi = Math.round((annualSavings / retentionCostAssumption) * 100);

  const retentionImpact: RevenueDashboardData["retentionImpact"] = {
    currentChurn: churnedCount,
    savedBy50Percent: formatMoney(savedBy50),
    annualSavings: formatMoney(annualSavings),
    roiPercentage: Math.min(roi, 999),
  };

  const churners = rows.filter((r) => Number(r.churn_actual) === 1);
  const churnerN = Math.max(churners.length, 1);
  const pctChurnersWith = (predicate: (r: any) => boolean) =>
    Math.round((churners.filter(predicate).length / churnerN) * 1000) / 10;

  const actionsList: RecommendedAction[] = [
    {
      id: "tickets",
      title: "Escalate support cases & resolve top tickets",
      contribution: pctChurnersWith(
        (r) => (Number(r.count_ticket_id) || 0) > avgs.tickets,
      ),
      type: "alert",
    },
    {
      id: "inactivity",
      title: "Run re-engagement outreach to inactive accounts",
      contribution: pctChurnersWith(
        (r) => (Number(r.inactivity_days) || 0) > avgs.inactivity,
      ),
      type: "call",
    },
    {
      id: "adoption",
      title: "Launch feature adoption campaign",
      contribution: pctChurnersWith(
        (r) => (Number(r.feature_adoption_pct) || 0) < avgs.adoption,
      ),
      type: "sparkle",
    },
    {
      id: "payment",
      title: "Offer flexible payment terms for late payers",
      contribution: pctChurnersWith((r) => Number(r.late_payment_flag) === 1),
      type: "target",
    },
  ];
  const recommendedActions = actionsList.sort(
    (a, b) => b.contribution - a.contribution,
  );

  return {
    metrics,
    distribution,
    distributionSummary,
    highImpactCustomers,
    retentionImpact,
    recommendedActions,
  };
}
