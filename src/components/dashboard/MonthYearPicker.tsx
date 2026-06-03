'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTH_ABBR_LABEL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatMonthLabel(key: string) {
  const [y, m] = key.split('-');
  const idx = parseInt(m, 10) - 1;
  if (!y || isNaN(idx) || idx < 0 || idx > 11) return key;
  return `${MONTH_ABBR_LABEL[idx]} ${y}`;
}

export function MonthYearPicker({
  value,
  onChange,
  availableMonths,
  align = 'right',
  ariaLabel,
}: {
  value: string;
  onChange: (key: string) => void;
  availableMonths: Set<string>;
  align?: 'left' | 'right';
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const initialYear = (() => {
    const y = parseInt(value?.split('-')[0] || '', 10);
    return isNaN(y) ? new Date().getFullYear() : y;
  })();
  const [viewYear, setViewYear] = useState(initialYear);

  const yearsAvailable = Array.from(availableMonths).map((m) => parseInt(m.split('-')[0], 10));
  const minYear = yearsAvailable.length ? Math.min(...yearsAvailable) : initialYear;
  const maxYear = yearsAvailable.length ? Math.max(...yearsAvailable) : initialYear;

  useEffect(() => {
    const y = parseInt(value?.split('-')[0] || '', 10);
    if (!isNaN(y)) setViewYear(y);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const isDisabled = availableMonths.size === 0;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => !isDisabled && setOpen((o) => !o)}
        disabled={isDisabled}
        aria-label={ariaLabel}
        className={`text-xs border rounded-md px-2.5 py-1.5 bg-white outline-none transition font-medium shadow-sm flex items-center gap-1.5 ${
          isDisabled
            ? 'border-gray-100 text-gray-300 cursor-not-allowed'
            : open
            ? 'border-blue-400 text-blue-600'
            : 'border-gray-200 text-gray-600 hover:border-blue-400 cursor-pointer'
        }`}
      >
        <Calendar size={12} />
        <span>{value ? formatMonthLabel(value) : '—'}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className={`absolute top-full mt-2 w-[260px] bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 p-4 z-50 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setViewYear((y) => Math.max(minYear, y - 1))}
              disabled={viewYear <= minYear}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Previous year"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-bold text-sm text-gray-900 tracking-tight">{viewYear}</span>
            <button
              type="button"
              onClick={() => setViewYear((y) => Math.min(maxYear, y + 1))}
              disabled={viewYear >= maxYear}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Next year"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {MONTH_ABBR_LABEL.map((m, i) => {
              const key = `${viewYear}-${String(i + 1).padStart(2, '0')}`;
              const isAvailable = availableMonths.has(key);
              const isSelected = key === value;
              return (
                <button
                  key={m}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                  className={`py-2 rounded-lg text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                      : isAvailable
                      ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}