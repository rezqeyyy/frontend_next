// src/app/prediction-results/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowUp, ArrowDown, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PredictionResultsPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('churn_risk_score', { ascending: false }) // Prioritas yang paling berisiko churn
      .limit(5000);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setCustomers(data || []);
    }
    setLoading(false);
  };

  const itemsLimit = itemsPerPage === 'all' ? customers.length : itemsPerPage;
  const totalPages = Math.ceil(customers.length / (itemsLimit || 1));
  const displayedData = customers.slice((currentPage - 1) * itemsLimit, currentPage * itemsLimit);

  if (errorMsg) return <div className="p-4 sm:p-8 text-red-500">Error: {errorMsg}</div>;

  return (
    // Penyesuaian padding top (pt-24) agar tidak tertutup navbar di mode HP
    <div className="p-4 pt-24 sm:p-6 sm:pt-28 lg:p-8 max-w-[1600px] mx-auto text-gray-800 w-full overflow-hidden">
      
      {/* HEADER: Stack di HP, Row di Tablet/Desktop */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
        <div className="w-full md:w-auto">
          <h1 className="text-[22px] md:text-[28px] font-bold text-gray-900 leading-tight">Prediction Results</h1>
          <p className="text-gray-400 mt-1 text-xs md:text-sm">AI-driven churn prediction and segmentation analysis</p>
        </div>
        
        {/* Kontrol Pencarian & Filter: Full width di HP */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search customer ID..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-[250px] focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition">
            <Filter size={16} /> <span>Filter</span>
          </button>
        </div>
      </header>

      {/* KONTROL PAGINATION ATAS: Stack di HP */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>
          <select 
            value={itemsPerPage} 
            onChange={(e) => {
              setItemsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value));
              setCurrentPage(1);
            }} 
            className="border border-gray-200 rounded-md px-2 py-1 focus:outline-none bg-white"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
          <span>entries</span>
        </div>
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
          Total Analyzed: <span className="font-semibold text-gray-800">{customers.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full">
        
        {/* AREA TABEL: Scroll Horizontal */}
        <div className="overflow-x-auto p-4 md:p-5">
          <table className="w-full text-left text-sm min-w-[1200px]">
            <thead className="text-gray-500 border-b border-gray-100 bg-gray-50/30">
              <tr>
                <th className="py-3 px-2 font-medium">#</th>
                <th className="py-3 font-medium">Customer ID</th>
                <th className="py-3 font-medium text-center">Churn Risk Score</th>
                <th className="py-3 font-medium text-center">Rank Level</th>
                <th className="py-3 font-medium text-center">Segment</th>
                <th className="py-3 font-medium text-center">Revenue at Risk</th>
                <th className="py-3 font-medium text-center">Level Activity</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {loading ? (
                <tr><td colSpan={7} className="py-8 text-center text-gray-400">Loading predictions...</td></tr>
              ) : displayedData.length > 0 ? (
                displayedData.map((cust, idx) => (
                  <PredictionRow 
                    key={cust.id} 
                    no={(currentPage - 1) * (itemsPerPage === 'all' ? customers.length : itemsPerPage) + idx + 1} 
                    data={cust} 
                  />
                ))
              ) : (
                <tr><td colSpan={7} className="py-8 text-center text-gray-400">Belum ada hasil prediksi.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* KONTROL PAGINATION BAWAH: Stack di HP */}
        {itemsPerPage !== 'all' && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 md:px-5 py-4 border-t border-gray-50 bg-gray-50/50">
            <p className="text-xs md:text-sm text-gray-500 text-center sm:text-left">
              Showing {(currentPage - 1) * Number(itemsPerPage) + 1} to {Math.min(currentPage * Number(itemsPerPage), customers.length)} of {customers.length} entries
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1} 
                className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs md:text-sm font-medium px-2 flex items-center">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages} 
                className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-komponen khusus halaman prediksi
function PredictionRow({ no, data }: any) {
  const { 
    customer_id, 
    churn_risk_score: score, 
    rank_level: rank, 
    segment, 
    revenue_at_risk, 
    level_activity: activity 
  } = data;
  
  const rankColors: any = { 
    High: 'bg-red-100 text-red-600', 
    Medium: 'bg-orange-100 text-orange-600', 
    Low: 'bg-green-100 text-green-600' 
  };
  
  const segmentColors: any = { 
    'All Risk User': 'bg-red-50 text-red-500', 
    'Reguler User': 'bg-blue-50 text-blue-500', 
    'Power User': 'bg-green-50 text-green-500' 
  };

  const barColor = score > 70 ? 'bg-red-500' : score > 40 ? 'bg-yellow-400' : 'bg-green-500';

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition">
      <td className="py-4 px-2">{no}</td>
      <td className="py-4 font-semibold text-gray-800">{customer_id ?? '-'}</td>
      <td className="py-4">
        <div className="flex items-center justify-center gap-3">
          <span className="font-medium w-6 text-center">{score ?? 0}</span>
          {score > 50 ? <ArrowUp size={12} className="text-red-500" /> : <ArrowDown size={12} className="text-green-500" />}
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
            <div className={`h-full ${barColor}`} style={{ width: `${score ?? 0}%` }} />
          </div>
        </div>
      </td>
      <td className="py-4 text-center">
        <span className={`px-3 py-1 rounded-md text-[11px] font-semibold ${rankColors[rank] || 'bg-gray-100 text-gray-600'}`}>
          {rank ?? '-'}
        </span>
      </td>
      <td className="py-4 text-center">
        <span className={`px-3 py-1 rounded-md text-[11px] font-semibold ${segmentColors[segment] || 'bg-gray-50 text-gray-500'}`}>
          {segment ?? '-'}
        </span>
      </td>
      <td className="py-4 text-center font-semibold text-gray-800">
        ${revenue_at_risk?.toLocaleString() ?? '0'}
      </td>
      <td className="py-4 text-center text-gray-500">
        {activity ?? '-'}
      </td>
    </tr>
  );
}