// src/components/dashboard/FilterDropdown.tsx
'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';

export function FilterDropdown() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRanks, setSelectedRanks] = useState<string[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  const toggleRank = (r: string) => {
    setSelectedRanks(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  };

  const toggleSegment = (s: string) => {
    setSelectedSegments(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const resetFilter = () => {
    setSelectedRanks([]);
    setSelectedSegments([]);
  };

  return (
    <div className="relative flex-1 sm:flex-none">
      <button 
        onClick={() => setIsFilterOpen(!isFilterOpen)} 
        className={`w-full border px-4 py-2 rounded-lg text-sm shadow-sm flex items-center justify-center gap-2 transition font-medium ${
          isFilterOpen ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Filter size={16} /> <span>Filter</span>
      </button>

      {isFilterOpen && (
        <div className="absolute right-0 top-full mt-2 w-[320px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 p-5 z-50 text-left">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-gray-900 text-base">Filter</h3>
            <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-gray-600 transition bg-gray-50 p-1 rounded-md">
              <X size={16} />
            </button>
          </div>

          {/* Date Range */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Date</label>
            <select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-blue-500">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>

          {/* Rank Toggles */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Rank</label>
            <div className="flex flex-wrap gap-2">
              {['High', 'Medium', 'Low'].map(rank => (
                <button 
                  key={rank} 
                  onClick={() => toggleRank(rank)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                    selectedRanks.includes(rank) ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {rank}
                </button>
              ))}
            </div>
          </div>

          {/* Segment Toggles */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Segment</label>
            <div className="flex flex-wrap gap-2">
              {['Reguler User', 'All Risk User', 'Power User'].map(seg => (
                <button 
                  key={seg} 
                  onClick={() => toggleSegment(seg)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                    selectedSegments.includes(seg) ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {seg}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button onClick={resetFilter} className="flex-1 px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-lg">
              Reset
            </button>
            <button onClick={() => setIsFilterOpen(false)} className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}