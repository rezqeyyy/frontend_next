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
    if (!user) throw new Error("Sesi habis jink.");

    const { data: userDatasets } = await supabase
      .from("datasets")
      .select("id")
      .eq("user_id", user.id);
    const datasetIds = userDatasets?.map((d) => d.id) || [];

    if (datasetIds.length === 0) {
      return {
        totalActiveCustomers: 0,
        totalHighRisk: 0,
        revenueAtRisk: 0,
        avgChurnScore: 0,
        alerts: [],
        chartData: [],
        availableMonths: 0,
      };
    }

    // 1. Ambil data asli (Hanya yang churn_actual = 0 / pelanggan aktif)
    const { data: scoreData } = await supabase
      .from("customers")
      .select(
        "churn_risk_score, recorded_month, sum_payment_value, rank_level, inactivity_days, monthly_usage_hrs",
      )
      .eq("churn_actual", 0)
      .in("dataset_id", datasetIds);

    if (!scoreData)
      return {
        totalActiveCustomers: 0,
        totalHighRisk: 0,
        revenueAtRisk: 0,
        avgChurnScore: 0,
        alerts: [],
        chartData: [],
        availableMonths: 0,
      };

    // 2. Hitung KPI Card
    const totalActiveCustomers = scoreData.length;
    const highRiskCustomers = scoreData.filter(
      (c) => c.rank_level === "High",
    ).length;
    const revenueAtRisk = scoreData
      .filter((c) => c.rank_level === "High" || c.rank_level === "Medium")
      .reduce((sum, curr) => sum + (curr.sum_payment_value || 0), 0);
    const avgChurnScore = Math.round(
      scoreData.reduce((s, c) => s + (c.churn_risk_score || 0), 0) /
        (totalActiveCustomers || 1),
    );

    // 3. Logic Chart — parse recorded_month robustly biar urutannya beneran kronologis
    //    apapun format yang masuk dari CSV (ISO date, "May 2024", "May", "5/1/2024", dst.)
    const MONTH_NAMES = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const MONTH_ABBR = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const ID_MONTH_NAMES = [
      "januari",
      "februari",
      "maret",
      "april",
      "mei",
      "juni",
      "juli",
      "agustus",
      "september",
      "oktober",
      "november",
      "desember",
    ];

    const parseRecordedMonth = (
      raw: string,
    ): { year: number; month: number } | null => {
      if (!raw) return null;
      const s = String(raw).trim();

      // Format ISO: "2024-05", "2024-05-01", "2024/05/01"
      const iso = s.match(/^(\d{4})[-/](\d{1,2})/);
      if (iso) {
        const y = parseInt(iso[1], 10);
        const m = parseInt(iso[2], 10) - 1;
        if (m >= 0 && m <= 11) return { year: y, month: m };
      }

      // Format Month name (EN/ID), opsional dengan tahun: "May", "Mei 2024", "Sep 2024"
      const lower = s.toLowerCase();
      const yearMatch = s.match(/(\d{4})/);
      const fallbackYear = yearMatch
        ? parseInt(yearMatch[1], 10)
        : new Date().getFullYear();
      for (let i = 0; i < 12; i++) {
        if (
          lower.includes(MONTH_NAMES[i].toLowerCase()) ||
          lower.includes(MONTH_ABBR[i].toLowerCase()) ||
          lower.includes(ID_MONTH_NAMES[i])
        ) {
          return { year: fallbackYear, month: i };
        }
      }

      // Format numeric "M/D/YYYY" atau "D/M/YYYY" — anggap bulan di posisi pertama (US-style)
      const numeric = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
      if (numeric) {
        const m = parseInt(numeric[1], 10) - 1;
        const y = parseInt(numeric[3], 10);
        if (m >= 0 && m <= 11) return { year: y, month: m };
      }

      // Last resort: Date.parse
      const d = new Date(s);
      if (!isNaN(d.getTime()))
        return { year: d.getFullYear(), month: d.getMonth() };

      return null;
    };

    const monthGroups: Record<
      string,
      { total: number; count: number; year: number; month: number }
    > = {};
    scoreData.forEach((item) => {
      if (!item.recorded_month || item.churn_risk_score === null) return;
      const parsed = parseRecordedMonth(item.recorded_month);
      if (!parsed) return;
      const key = `${parsed.year}-${String(parsed.month + 1).padStart(2, "0")}`;
      if (!monthGroups[key])
        monthGroups[key] = {
          total: 0,
          count: 0,
          year: parsed.year,
          month: parsed.month,
        };
      monthGroups[key].total += item.churn_risk_score;
      monthGroups[key].count += 1;
    });

    const yearsInData = new Set(Object.values(monthGroups).map((g) => g.year));
    const isMultiYear = yearsInData.size > 1;

    const sortedChartData = Object.entries(monthGroups)
      .sort(([, a], [, b]) => a.year - b.year || a.month - b.month)
      .map(([key, val]) => ({
        fullName: key,
        name: isMultiYear
          ? `${MONTH_ABBR[val.month]} '${String(val.year).slice(-2)}`
          : MONTH_ABBR[val.month],
        risk: Math.round(val.total / val.count),
      }));

    // 4. Logic Alerts
    const alerts = [];
    const inactiveCount = scoreData.filter(
      (c) => (c.inactivity_days || 0) > 14,
    ).length;
    const lowUsageCount = scoreData.filter(
      (c) => (c.monthly_usage_hrs || 0) < 5,
    ).length;

    if (highRiskCustomers > 0)
      alerts.push({
        type: "danger",
        title: "High Churn Risk",
        desc: `${highRiskCustomers} pelanggan berisiko kabur.`,
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
      totalHighRisk: highRiskCustomers,
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
