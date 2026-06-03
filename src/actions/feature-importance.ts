"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type FeatureMeta = {
  key: string;
  title: string;
  shortName: string;
  iconName: string;
  color: string;
  desc: string;
  impact: string;
  recom: string;
};

const FEATURES: FeatureMeta[] = [
  {
    key: "count_ticket_id",
    title: "Support Ticket Count",
    shortName: "support_tickets",
    iconName: "Headset",
    color: "#6366f1",
    desc: "High ticket volume indicates customer dissatisfaction and frustration.",
    impact: "High: Numerous complaints and technical support queues.",
    recom: "Prioritize ticket resolution and initiate proactive outreach.",
  },
  {
    key: "monthly_usage_hrs",
    title: "Monthly Usage Hours",
    shortName: "usage_hrs",
    iconName: "Activity",
    color: "#8b5cf6",
    desc: "Monthly usage hours reflect user engagement and product stickiness.",
    impact: "Medium: Users are rarely engaging with core features.",
    recom: "Send retention emails or offer guided tours of new features.",
  },
  {
    key: "inactivity_days",
    title: "Inactivity Days",
    shortName: "inactivity_days",
    iconName: "Clock",
    color: "#f59e0b",
    desc: "Days spent without activity serve as a strong early signal of customer churn.",
    impact: "High: Customers are completely losing their product usage habits.",
    recom: "Launch a re-engagement campaign and send personalized notifications.",
  },
  {
    key: "average_nps_score",
    title: "NPS Score",
    shortName: "nps_score",
    iconName: "Smile",
    color: "#10b981",
    desc: "A low NPS correlates directly with a customer's intention to unsubscribe.",
    impact: "Medium: Declining customer sentiment.",
    recom: "Follow up with detractors and request structured feedback.",
  },
  {
    key: "feature_adoption_pct",
    title: "Feature Adoption",
    shortName: "feature_adoption",
    iconName: "Zap",
    color: "#3b82f6",
    desc: "Core feature adoption rates demonstrate the realized value of the product.",
    impact: "Medium: Customers have not yet realized the full value of the product.",
    recom: "Enable in-app guidance and provide focused onboarding training sessions.",
  },
  {
    key: "average_payment_delay",
    title: "Payment Delay",
    shortName: "payment_delay",
    iconName: "Wallet",
    color: "#ef4444",
    desc: "Average payment delays indicate potential issues with retention intent.",
    impact: "High: Risk of invoice default and financial subscription churn.",
    recom: "Send timely payment reminders and offer flexible payment options.",
  },
  {
    key: "subscription_age",
    title: "Subscription Age",
    shortName: "subscription_age",
    iconName: "Calendar",
    color: "#14b8a6",
    desc: "Subscription age relates closely to customer loyalty and account maturity.",
    impact: "Low-Medium: Newer customers are substantially more susceptible to churn.",
    recom: "Provide tailored onboarding support for customers under 3 months old.",
  },
  {
    key: "sum_payment_value",
    title: "Total Payment Value",
    shortName: "payment_value",
    iconName: "DollarSign",
    color: "#0ea5e9",
    desc: "Total payment value reflects overall customer financial commitment.",
    impact: "Medium: High-value accounts present significant revenue at risk.",
    recom: "Assign a dedicated account manager to look after high-value segments.",
  },
  {
    key: "engagement_score",
    title: "Engagement Score",
    shortName: "engagement",
    iconName: "TrendingUp",
    color: "#a855f7",
    desc: "An aggregate engagement score derived from various product activity metrics.",
    impact: "High: Low engagement scores almost always precede a customer churn event.",
    recom: "Build a standardized, score-based customer re-engagement playbook.",
  },
  {
    key: "loyalty_score",
    title: "Loyalty Score",
    shortName: "loyalty",
    iconName: "Award",
    color: "#f97316",
    desc: "A loyalty indicator based on historical account retention and tenure data.",
    impact: "Medium: Customers with low loyalty ratings are quick to switch competitors.",
    recom: "Offer reward programs and exclusive value-add membership benefits.",
  },
  {
    key: "low_usage_flag",
    title: "Low Usage Flag",
    shortName: "low_usage",
    iconName: "AlertTriangle",
    color: "#eab308",
    desc: "A binary flag indicating that usage falls below the defined minimum threshold.",
    impact: "Medium: An early warning indicator pointing to an inactive user account.",
    recom: "Trigger automated re-engagement email campaigns as soon as the flag is active.",
  },
  {
    key: "late_payment_flag",
    title: "Late Payment Flag",
    shortName: "late_payment",
    iconName: "AlertCircle",
    color: "#dc2626",
    desc: "A tracking flag indicating customers who have previously paid bills late.",
    impact: "High: A strong predictable indicator of intent to unsubscribe.",
    recom: "Perform proactive retention outreach before the next billing cycle begins.",
  },
];

function pearson(xs: number[], ys: number[]): number {
  const n = xs.length;
  if (n === 0) return 0;
  let sx = 0,
    sy = 0;
  for (let i = 0; i < n; i++) {
    sx += xs[i];
    sy += ys[i];
  }
  const mx = sx / n,
    my = sy / n;
  let num = 0,
    dx = 0,
    dy = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx,
      b = ys[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : num / den;
}

export async function fetchFeatureImportanceStats() {
  try {
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

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Session expired.");

    const { data: userDatasets } = await supabase
      .from("datasets")
      .select("id")
      .eq("user_id", user.id);
    const datasetIds = userDatasets?.map((d) => d.id) || [];

    if (datasetIds.length === 0) {
      return {
        totalFeaturesTracked: 0,
        highImpactCount: 0,
        featureImportanceDetails: [],
        chartDataFeature: [],
        topCustomers: [],
      };
    }

    const selectCols = ["churn_actual", ...FEATURES.map((f) => f.key)].join(
      ",",
    );
    const { data: rows } = await supabase
      .from("customers")
      .select(selectCols)
      .in("dataset_id", datasetIds)
      .limit(5000);

    const { data: topCustomers } = await supabase
      .from("customers")
      .select("*")
      .in("dataset_id", datasetIds)
      .order("churn_risk_score", { ascending: false })
      .limit(5);

    const sample = (rows as any[]) || [];
    if (sample.length === 0) {
      return {
        totalFeaturesTracked: 0,
        highImpactCount: 0,
        featureImportanceDetails: [],
        chartDataFeature: [],
        topCustomers: topCustomers || [],
      };
    }

    const y = sample.map((r) => Number(r.churn_actual) || 0);

    const correlations = FEATURES.map((f) => {
      const x = sample.map((r) => Number((r as any)[f.key]) || 0);
      const r = pearson(x, y);
      return { meta: f, corr: r, mag: Math.abs(r) };
    });

    const totalMag = correlations.reduce((s, c) => s + c.mag, 0);
    const scored = correlations
      .map((c) => ({
        ...c,
        importance: totalMag > 0 ? (c.mag / totalMag) * 100 : 0,
      }))
      .sort((a, b) => b.importance - a.importance);

    const highImpactCount = scored.filter((c) => c.mag >= 0.15).length;
    const totalFeaturesTracked = scored.filter((c) => c.mag > 0).length;

    const featureImportanceDetails = scored.slice(0, 3).map((c, idx) => ({
      id: idx + 1,
      iconName: c.meta.iconName,
      title: c.meta.title,
      importance: Math.round(c.importance * 10) / 10,
      color: c.meta.color,
      desc: c.meta.desc,
      impact: c.meta.impact,
      recom: c.meta.recom,
    }));

    const chartDataFeature = scored.map((c) => ({
      name: c.meta.shortName,
      value: Math.round((c.importance / 100) * 1000) / 1000,
    }));

    return {
      totalFeaturesTracked,
      highImpactCount,
      featureImportanceDetails,
      chartDataFeature,
      topCustomers: topCustomers || [],
    };
  } catch (err: any) {
    return { error: err.message };
  }
}