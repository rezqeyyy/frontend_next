// src/components/dashboard/DashboardSection.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import ChurnRiskChart from './ChurnRiskChart';
import { MonthYearPicker } from './MonthYearPicker';
import { RiskDonutChart } from './RiskDonutChart';           
import { RiskLegendItem } from './RiskLegendItem';           

export function DashboardSection({ title, chartType, data, className = "" }: any) {
  const months: string[] = Array.isArray(data) && chartType === "Line Chart" ? data.map((d: any) => d.fullName || d.name) : [];
  const monthSet = new Set(months);

  const [fromKey, setFromKey] = useState<string>('');
  const [toKey, setToKey] = useState<string>('');

  useEffect(() => {
    if (chartType === "Line Chart" && months.length > 0) {
      setFromKey(months[0]);
      setToKey(months[months.length - 1]);
    } else {
      setFromKey('');
      setToKey('');
    }
  }, [months.length, months[0], months[months.length - 1], chartType]);

  const fromIdx = months.indexOf(fromKey);
  const toIdx = months.indexOf(toKey);
  const safeFrom = Math.min(fromIdx === -1 ? 0 : fromIdx, toIdx === -1 ? 0 : toIdx);
  const safeTo = Math.max(fromIdx === -1 ? 0 : fromIdx, toIdx === -1 ? 0 : toIdx);
  const displayData = Array.isArray(data) && months.length > 0 && chartType === "Line Chart" ? data.slice(safeFrom, safeTo + 1) : [];

  const donutData = useMemo(() => {
    if (chartType !== "Donut Chart" || !Array.isArray(data)) return [];
    const totalValue = data.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    return data.map((item: any, index: number) => {
      const val = Number(item.value) || 0;
      let color = '#E5E7EB';
      if (item.label?.toLowerCase().includes('high')) color = '#FF4D4F';
      if (item.label?.toLowerCase().includes('medium')) color = '#FFC53D';
      if (item.label?.toLowerCase().includes('low')) color = '#50C878';
      return { ...item, value: val, percentage: totalValue > 0 ? Number(((val / totalValue) * 100).toFixed(1)) : 0, color };
    });
  }, [data, chartType]);

  return (
    <div className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col ${className}`}>
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>

        {chartType === "Line Chart" && (
          <div className="flex items-center gap-2 flex-wrap">
            <MonthYearPicker value={fromKey} onChange={setFromKey} availableMonths={monthSet} ariaLabel="From month" align="right" />
            <span className="text-xs text-gray-400 font-medium">to</span>
            <MonthYearPicker value={toKey} onChange={setToKey} availableMonths={monthSet} ariaLabel="To month" align="right" />
          </div>
        )}
      </div>

      <div className={`w-full flex-1 flex flex-col justify-center ${chartType === "Donut Chart" ? "min-h-[220px]" : "h-[220px]"}`}>
        {chartType === "Line Chart" ? (
          <ChurnRiskChart data={displayData} />
        ) : chartType === "Donut Chart" ? (
          
          donutData.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 w-full py-2">
              <div className="w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] flex-shrink-0">
                <RiskDonutChart data={donutData} />
              </div>

              <div className="flex flex-col justify-center flex-grow min-w-[220px] max-w-[320px]">
                {donutData.map((item) => (
                  <RiskLegendItem key={item.id} data={item} />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-400 min-h-[220px]">
              Waiting for data from server...
            </div>
          )

        ) : (
          <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200 text-gray-400 text-sm">
            [{chartType}]
          </div>
        )}
      </div>
    </div>
  );
}