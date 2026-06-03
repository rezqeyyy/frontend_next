'use client';

import { useState, useEffect } from 'react';
import ChurnRiskChart from './ChurnRiskChart';
import { MonthYearPicker } from './MonthYearPicker';

export function DashboardSection({ title, chartType, data, className = "" }: any) {
  // Logic filter tanggal asli dari lu
  const months: string[] = Array.isArray(data) ? data.map((d: any) => d.fullName || d.name) : [];
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