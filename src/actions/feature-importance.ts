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
    desc: "Volume tiket tinggi menandakan ketidakpuasan dan frustrasi.",
    impact: "Tinggi: Banyak komplain dan antrean dukungan teknis.",
    recom: "Prioritaskan resolusi tiket dan penjangkauan proaktif.",
  },
  {
    key: "monthly_usage_hrs",
    title: "Monthly Usage Hours",
    shortName: "usage_hrs",
    iconName: "Activity",
    color: "#8b5cf6",
    desc: "Jam pemakaian bulanan mencerminkan keterikatan pengguna.",
    impact: "Menengah: Pengguna jarang menggunakan fitur utama.",
    recom: "Kirim email retensi atau tawarkan tur fitur baru.",
  },
  {
    key: "inactivity_days",
    title: "Inactivity Days",
    shortName: "inactivity_days",
    iconName: "Clock",
    color: "#f59e0b",
    desc: "Hari tanpa aktivitas adalah sinyal awal churn yang kuat.",
    impact: "Tinggi: Customer kehilangan habit penggunaan produk.",
    recom: "Jalankan kampanye re-engagement dan kirim notifikasi personal.",
  },
  {
    key: "average_nps_score",
    title: "NPS Score",
    shortName: "nps_score",
    iconName: "Smile",
    color: "#10b981",
    desc: "NPS rendah berkorelasi langsung dengan niat berhenti berlangganan.",
    impact: "Menengah: Sentimen pelanggan menurun.",
    recom: "Follow up detractor dan minta feedback terstruktur.",
  },
  {
    key: "feature_adoption_pct",
    title: "Feature Adoption",
    shortName: "feature_adoption",
    iconName: "Zap",
    color: "#3b82f6",
    desc: "Tingkat adopsi fitur kunci menunjukkan nilai yang diterima.",
    impact: "Menengah: Customer belum mendapat full value produk.",
    recom: "Aktifkan in-app guidance dan training onboarding.",
  },
  {
    key: "average_payment_delay",
    title: "Payment Delay",
    shortName: "payment_delay",
    iconName: "Wallet",
    color: "#ef4444",
    desc: "Rata-rata keterlambatan pembayaran mengindikasikan masalah niat lanjut.",
    impact: "Tinggi: Risiko gagal bayar dan churn finansial.",
    recom: "Kirim reminder pembayaran dan opsi pembayaran fleksibel.",
  },
  {
    key: "subscription_age",
    title: "Subscription Age",
    shortName: "subscription_age",
    iconName: "Calendar",
    color: "#14b8a6",
    desc: "Usia langganan berkaitan dengan loyalitas pelanggan.",
    impact: "Rendah-Menengah: Pelanggan baru lebih rentan churn.",
    recom: "Berikan onboarding khusus untuk pelanggan di bawah 3 bulan.",
  },
  {
    key: "sum_payment_value",
    title: "Total Payment Value",
    shortName: "payment_value",
    iconName: "DollarSign",
    color: "#0ea5e9",
    desc: "Total nilai pembayaran menggambarkan komitmen finansial.",
    impact: "Menengah: Pelanggan high-value memiliki revenue-at-risk besar.",
    recom: "Tugaskan account manager khusus untuk segmen high value.",
  },
  {
    key: "engagement_score",
    title: "Engagement Score",
    shortName: "engagement",
    iconName: "TrendingUp",
    color: "#a855f7",
    desc: "Skor keterlibatan agregat dari aktivitas produk.",
    impact: "Tinggi: Skor rendah hampir selalu mendahului churn.",
    recom: "Buat playbook re-engagement berbasis skor.",
  },
  {
    key: "loyalty_score",
    title: "Loyalty Score",
    shortName: "loyalty",
    iconName: "Award",
    color: "#f97316",
    desc: "Indikator loyalitas berdasarkan retensi historis.",
    impact: "Menengah: Customer dengan loyalty rendah cepat berpindah.",
    recom: "Tawarkan program reward dan benefit eksklusif.",
  },
  {
    key: "low_usage_flag",
    title: "Low Usage Flag",
    shortName: "low_usage",
    iconName: "AlertTriangle",
    color: "#eab308",
    desc: "Flag biner pemakaian di bawah ambang minimum.",
    impact: "Menengah: Sinyal awal akun yang tidak aktif.",
    recom: "Trigger kampanye otomatis ketika flag aktif.",
  },
  {
    key: "late_payment_flag",
    title: "Late Payment Flag",
    shortName: "late_payment",
    iconName: "AlertCircle",
    color: "#dc2626",
    desc: "Flag pelanggan yang pernah telat membayar.",
    impact: "Tinggi: Indikator kuat niat berhenti berlangganan.",
    recom: "Lakukan retensi proaktif sebelum siklus tagihan berikutnya.",
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
    if (!user) throw new Error("Sesi habis.");

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
