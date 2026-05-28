// src/actions/dashboard.ts
"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function fetchDashboardStats() {
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

const { data: latestDataset } = await supabase
      .from("datasets")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }) // Ambil yang paling baru di-upload
      .limit(1); // Batasi hanya 1 dataset teratas

    const datasetIds = latestDataset?.map((d) => d.id) || [];

    if (datasetIds.length === 0) {
      return {
        totalActiveCustomers: { value: 0, trend: 0, isPositive: true },
        totalHighRisk: { value: 0, trend: 0, isPositive: true },
        revenueAtRisk: { value: 0, trend: 0, isPositive: true },
        avgChurnScore: { value: 0, trend: 0, isPositive: true },
        alerts: [],
        chartData: [],
        availableMonths: 0,
      };
    }

    // Ambil data pelanggan aktif (churn_actual = 0)
// Ambil seluruh data pelanggan hasil prediksi tanpa memandang status churn lama
    const { data: scoreData } = await supabase
      .from("customers")
      .select(
        "churn_risk_score, recorded_month, sum_payment_value, rank_level, inactivity_days, monthly_usage_hrs",
      )
      // .eq("churn_actual", 0) // <--- SEBAIKNYA DI-KOMENTAR ATAU DIHAPUS AGAR MUNCUL 9
      .in("dataset_id", datasetIds);

    if (!scoreData || scoreData.length === 0) {
      return {
        totalActiveCustomers: { value: 0, trend: 0, isPositive: true },
        totalHighRisk: { value: 0, trend: 0, isPositive: true },
        revenueAtRisk: { value: 0, trend: 0, isPositive: true },
        avgChurnScore: { value: 0, trend: 0, isPositive: true },
        alerts: [],
        chartData: [],
        availableMonths: 0,
      };
    }

    // --- 1. HITUNG ANGKA BESAR UTAMA (GLOBAL DARI HASIL PREDICTION DATASET) ---
    const globalTotalCustomers = scoreData.length;
    const globalHighRisk = scoreData.filter((c) => c.rank_level === "High").length;
    const globalRevenueAtRisk = scoreData
      .filter((c) => c.rank_level === "High" || c.rank_level === "Medium")
      .reduce((sum, curr) => sum + (curr.sum_payment_value || 0), 0);
    const globalAvgScore = Math.round(
      scoreData.reduce((s, c) => s + (c.churn_risk_score || 0), 0) / (globalTotalCustomers || 1),
    );

    // Helper Parser Month (Bawaan asli kodemu)
    const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const parseRecordedMonth = (raw: string) => {
      if (!raw) return null;
      const s = String(raw).trim();
      const iso = s.match(/^(\d{4})[-/](\d{1,2})/);
      if (iso) return { year: parseInt(iso[1], 10), month: parseInt(iso[2], 10) - 1 };
      
      const lower = s.toLowerCase();
      const yearMatch = s.match(/(\d{4})/);
      const fallbackYear = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
      const MONTH_NAMES = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
      const ID_MONTH_NAMES = ["januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"];
      
      for (let i = 0; i < 12; i++) {
        if (lower.includes(MONTH_NAMES[i]) || lower.includes(MONTH_ABBR[i].toLowerCase()) || lower.includes(ID_MONTH_NAMES[i])) {
          return { year: fallbackYear, month: i };
        }
      }
      const d = new Date(s);
      if (!isNaN(d.getTime())) return { year: d.getFullYear(), month: d.getMonth() };
      return null;
    };

    // Kelompokkan data berdasarkan standarisasi key "YYYY-MM" (Bawaan asli kodemu)
    const monthGroups: Record<string, typeof scoreData> = {};
    scoreData.forEach((item) => {
      if (!item.recorded_month) return;
      const parsed = parseRecordedMonth(item.recorded_month);
      if (!parsed) return;
      const key = `${parsed.year}-${String(parsed.month + 1).padStart(2, "0")}`;
      if (!monthGroups[key]) monthGroups[key] = [];
      monthGroups[key].push(item);
    });

    // Urutkan key bulan secara kronologis untuk memisahkan data MoM
    const sortedMonthKeys = Object.keys(monthGroups).sort();
    
    // Tentukan Current Month & Previous Month dari rentang data hasil prediksi
    const currentMonthKey = sortedMonthKeys[sortedMonthKeys.length - 1];
    const prevMonthKey = sortedMonthKeys.length > 1 ? sortedMonthKeys[sortedMonthKeys.length - 2] : null;

    const currentData = monthGroups[currentMonthKey] || [];
    const prevData = prevMonthKey ? monthGroups[prevMonthKey] : [];

    // --- 2. HITUNG AGREGAT INTERNAL BULANAN UNTUK KEBUTUHAN TREN MoM ---
    const calculateMetrics = (dataList: typeof scoreData) => {
      const totalCustomers = dataList.length;
      if (totalCustomers === 0) return { totalCust: 0, highRisk: 0, revAtRisk: 0, avgScore: 0 };

      const highRisk = dataList.filter((c) => c.rank_level === "High").length;
      const revAtRisk = dataList
        .filter((c) => c.rank_level === "High" || c.rank_level === "Medium")
        .reduce((sum, curr) => sum + (curr.sum_payment_value || 0), 0);
      const avgScore = dataList.reduce((s, c) => s + (c.churn_risk_score || 0), 0) / totalCustomers;

      return { totalCust: totalCustomers, highRisk, revAtRisk, avgScore };
    };

    const currentMetrics = calculateMetrics(currentData);
    const prevMetrics = calculateMetrics(prevData);

    // Fungsi pembantu kalkulasi tren % MoM (Bawaan asli kodemu)
    const calculateTrend = (current: number, previous: number, lowerIsBetter: boolean = false) => {
      if (previous === 0) return { trend: 0, isPositive: true };
      const pctChange = ((current - previous) / previous) * 100;
      const roundedTrend = Math.abs(Math.round(pctChange * 10) / 10);

      let isPositive = pctChange >= 0;
      if (lowerIsBetter) {
        isPositive = pctChange <= 0;
      }
      return { trend: roundedTrend, isPositive };
    };

    // --- 3. PASANG ANGKA UTAMA GLOBAL + INDIKATOR TREN MoM ---
    const latestAvgScore = currentData.length > 0 
      ? currentData.reduce((sum, c: any) => sum + (c.churn_risk_score || 0), 0) / currentData.length 
      : 0;

    const prevAvgScore = prevData.length > 0 
      ? prevData.reduce((sum, c: any) => sum + (c.churn_risk_score || 0), 0) / prevData.length 
      : 0;

    // 2. Gabungkan nilai total global berkas dengan persentase tren MoM
    const totalActiveCustomers = {
      value: globalTotalCustomers, // Mengunci angka besar ke total file (33)
      ...calculateTrend(currentMetrics.totalCust, prevMetrics.totalCust, false)
    };

    const totalHighRisk = {
      value: globalHighRisk, // Mengunci angka besar ke total High Risk di file
      ...calculateTrend(currentMetrics.highRisk, prevMetrics.highRisk, true)
    };

    const revenueAtRisk = {
      value: globalRevenueAtRisk, // Mengunci angka besar ke total Revenue Risk di file
      ...calculateTrend(currentMetrics.revAtRisk, prevMetrics.revAtRisk, true)
    };

    const avgChurnScore = {
      value: globalAvgScore, // Mengunci angka besar ke rata-rata global file
      trend: prevAvgScore === 0 
        ? 0 
        : Math.abs(Math.round(((latestAvgScore - prevAvgScore) / prevAvgScore) * 100 * 10) / 10),
      isPositive: latestAvgScore <= prevAvgScore
    };

    // --- 4. LOGIC CHART (Bawaan asli kodemu, 100% AMAN TIDAK DIUBAH) ---
    const sortedChartData = sortedMonthKeys.map((key) => {
      const items = monthGroups[key];
      const parsed = parseRecordedMonth(items[0].recorded_month!);
      const totalScore = items.reduce((sum, item) => sum + (item.churn_risk_score || 0), 0);
      return {
        fullName: key,
        name: `${MONTH_ABBR[parsed!.month]} '${String(parsed!.year).slice(-2)}`,
        risk: Math.round(totalScore / items.length),
      };
    });

    // --- 5. LOGIC ALERTS (Bawaan asli kodemu) ---
    const alerts = [];
    
    // Hitung berdasarkan keseluruhan scoreData (bukan dikunci per bulan berjalan saja)
    const totalHighRiskAlert = scoreData.filter((c: any) => c.rank_level === "High").length;
    const inactiveCount = scoreData.filter((c: any) => (c.inactivity_days || 0) > 14).length;
    const lowUsageCount = scoreData.filter((c: any) => (c.monthly_usage_hrs || 0) < 5).length;

    if (totalHighRiskAlert > 0)
      alerts.push({
        type: "danger",
        title: "High Churn Risk",
        desc: `${totalHighRiskAlert} pelanggan berisiko kabur.`,
        time: "Baru saja",
      });
    if (inactiveCount > 0)
      alerts.push({
        type: "warning",
        title: "Activity Drop",
        desc: `${inactiveCount} pelanggan belum login > 14 hari.`,
        time: "Hari ini",
      });
    if (lowUsageCount > 0)
      alerts.push({
        type: "info",
        title: "Low Usage",
        desc: `${lowUsageCount} pelanggan jarang pakai fitur.`,
        time: "Hari ini",
      });

    return {
      totalActiveCustomers,
      totalHighRisk,
      revenueAtRisk,
      avgChurnScore,
      alerts,
      chartData: sortedChartData,
      availableMonths: sortedChartData.length,
    };
  } catch (err: any) {
    return { error: err.message };
  }
}