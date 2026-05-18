// src/components/feature-importance/FeatureImportanceChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function FeatureImportanceChart({ data }: { data?: any[] }) {
  const primaryPurple = "#8b5cf6"; // Indigo-500

  const chartData = Array.isArray(data)
    ? data.filter((d) => (d?.value || 0) > 0)
    : [];
  const hasData = chartData.length > 0;

  return (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm w-full h-full min-h-[400px] flex flex-col">
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 text-lg tracking-tight">
          Feature Impact Score
        </h3>
        <p className="text-xs text-gray-400 font-medium">
          Distribusi kekuatan prediksi masing-masing fitur
        </p>
      </div>

      <div className="flex-1 w-full">
        {!hasData ? (
          <div className="h-full w-full flex flex-col items-center justify-center text-center px-6 py-12 text-gray-400">
            <p className="text-sm font-medium">Belum ada data fitur</p>
            <p className="text-xs mt-1">
              Upload dataset di halaman Upload CSV untuk melihat kekuatan
              prediksi tiap fitur.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              // PERBAIKAN 1: margin left diubah jadi 0 agar label tidak terdorong keluar layar
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#f1f5f9"
              />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
              />

              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                // PERBAIKAN 2: fontSize jadi 10 dan width diperlebar jadi 140
                tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }}
                width={140}
              />

              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(139, 92, 246, 0.1)",
                  padding: "8px 12px",
                }}
                labelStyle={{
                  color: "#1f2937",
                  fontWeight: "bold",
                  marginBottom: "2px",
                }}
                itemStyle={{
                  color: primaryPurple,
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
                formatter={(value: any) => [value, "Importance"]}
              />

              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={primaryPurple}
                    fillOpacity={1 - index * 0.08}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}