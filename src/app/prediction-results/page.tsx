// src/app/prediction-results/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowUp, ArrowDown, Search, Filter, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import InlineChat from '@/components/chat/InlineChat'; 

export default function PredictionResultsPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(10);
  const [currentPage, setCurrentPage] = useState(1);

  // State untuk Progress Bar & Error Handling
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictProgress, setPredictProgress] = useState(0);
  const [predictError, setPredictError] = useState(false);
  
  const isPredictingRef = useRef(false);

  useEffect(() => {
    fetchResults();
    autoPredictAllDatabase();

    // SENSOR BANGUN TIDUR: Jalanin ulang kalau user balik ke tab ini dan proses sempet mati
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (!isPredictingRef.current && !predictError) {
          autoPredictAllDatabase();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predictError]);

  const fetchResults = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('churn_risk_score', { ascending: false })
      .limit(5000);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setCustomers(data || []);
    }
    setLoading(false);
  };

  const runPredictionSilent = async (customerData: any) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData), 
      });

      if (!response.ok) return false;
      const predictionResult = await response.json();

      const newScore = Math.round(predictionResult.risk_score);
      const newRank = predictionResult.risk_category;
      const newRevenue = Math.round(predictionResult.revenue_at_risk);

      const { error: supabaseError } = await supabase
        .from('customers')
        .update({
          churn_risk_score: newScore,
          rank_level: newRank,
          revenue_at_risk: newRevenue,
        })
        .eq('customer_id', customerData.customer_id);

      if (supabaseError) throw supabaseError;
      
      setCustomers((prevData) => {
        const updatedData = prevData.map((c) => 
          c.customer_id === customerData.customer_id 
            ? { ...c, churn_risk_score: newScore, rank_level: newRank, revenue_at_risk: newRevenue }
            : c
        );
        return updatedData.sort((a, b) => (b.churn_risk_score || 0) - (a.churn_risk_score || 0));
      });

      return true;

    } catch (error) {
      console.error(`Gagal auto-predict untuk ${customerData.customer_id}:`, error);
      return false; 
    }
  };

  const autoPredictAllDatabase = async () => {
    if (isPredictingRef.current) return; 

    try {
      setPredictError(false);
      
      // 1. Ambil jumlah TOTAL semua data di database buat patokan akurat persentase
      const { count: totalDataCount, error: countError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      // 2. Ambil data yang sisa/belum diprediksi
      const { data: allUnpredicted, error } = await supabase
        .from('customers')
        .select('*')
        .or('rank_level.is.null,rank_level.eq.-');

      if (error || countError) throw error || countError;
      
      if (!allUnpredicted || allUnpredicted.length === 0) return;

      isPredictingRef.current = true;
      setIsPredicting(true);

      const total = totalDataCount || 1;
      // Hitung data yang udah beres biar persenan nggak ngulang dari 0%
      let completed = total - allUnpredicted.length; 
      setPredictProgress(Math.round((completed / total) * 100));

      // 3. Eksekusi sisanya
      for (let i = 0; i < allUnpredicted.length; i++) {
        // Cek kalau tiba-tiba disuruh stop
        if (!isPredictingRef.current) break;

        const success = await runPredictionSilent(allUnpredicted[i]);
        
        if (!success) {
          throw new Error(`Gagal memprediksi data ID: ${allUnpredicted[i].customer_id}`);
        }
        
        completed++;
        const currentPercentage = Math.round((completed / total) * 100);
        setPredictProgress(currentPercentage);
      }

      // Kalau sukses 100%
      if (isPredictingRef.current) {
        setTimeout(() => {
          setIsPredicting(false);
          isPredictingRef.current = false;
          fetchResults();
        }, 1000);
      }

    } catch (err) {
      console.error("Error saat mass predict:", err);
      setPredictError(true); 
      isPredictingRef.current = false;
    }
  };

  const itemsLimit = itemsPerPage === 'all' ? customers.length : itemsPerPage;
  const totalPages = Math.ceil(customers.length / (itemsLimit || 1));
  const displayedData = customers.slice((currentPage - 1) * itemsLimit, currentPage * itemsLimit);

  if (errorMsg) return <div className="p-4 sm:p-8 text-red-500">Error: {errorMsg}</div>;

  return (
    <div className="p-4 pt-24 sm:p-6 sm:pt-28 lg:p-8 max-w-[1600px] mx-auto text-gray-800 w-full overflow-hidden">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
        <div className="w-full md:w-auto">
          <h1 className="text-[22px] md:text-[28px] font-bold text-gray-900 leading-tight">Prediction Results</h1>
          <p className="text-gray-400 mt-1 text-xs md:text-sm">AI-driven churn prediction and segmentation analysis</p>
        </div>
        
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

      {/* TAMPILAN PROGRESS BAR */}
      {isPredicting && (
        <div className={`mb-6 border rounded-xl p-4 flex flex-col gap-3 transition-colors ${predictError ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-100'}`}>
          <div className={`flex justify-between items-center text-sm font-medium ${predictError ? 'text-red-800' : 'text-blue-800'}`}>
            <span className="flex items-center gap-2">
              {predictError ? (
                <AlertCircle size={16} className="text-red-600" />
              ) : (
                <Loader2 size={16} className="animate-spin text-blue-600" />
              )}
              {predictError 
                ? "Gagal memprediksi sisa data. Cek koneksi backend atau console." 
                : "Sedang memprediksi sisa data otomatis... (Bisa ditinggal pindah tab)"}
            </span>
            <span>{predictProgress}%</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${predictError ? 'bg-red-200' : 'bg-blue-200'}`}>
            <div 
              className={`h-full transition-all duration-300 ease-out ${predictError ? 'bg-red-600' : 'bg-blue-600'}`}
              style={{ width: `${predictProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* KONTROL PAGINATION ATAS */}
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

      {/* AREA TABEL */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto p-4 md:p-5">
          <table className="w-full text-left text-sm min-w-[1200px]">
            <thead className="text-gray-500 border-b border-gray-100 bg-gray-50/30">
              <tr>
                <th className="py-3 px-2 font-medium">#</th>
                <th className="py-3 font-medium">Customer ID</th>
                <th className="py-3 font-medium text-center">Churn Risk Score</th>
                <th className="py-3 font-medium text-center">Rank Level</th>
                {/* <th className="py-3 font-medium text-center">Segment</th> */}
                <th className="py-3 font-medium text-center">Revenue at Risk</th>
                {/* <th className="py-3 font-medium text-center">Level Activity</th> */}
                <th className="py-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {loading ? (
                <tr><td colSpan={8} className="py-8 text-center text-gray-400">Memuat data tabel...</td></tr>
              ) : displayedData.length > 0 ? (
                displayedData.map((cust, idx) => (
                  <PredictionRow 
                    key={cust.customer_id} 
                    no={(currentPage - 1) * (itemsPerPage === 'all' ? customers.length : itemsPerPage) + idx + 1} 
                    data={cust} 
                  />
                ))
              ) : (
                <tr><td colSpan={8} className="py-8 text-center text-gray-400">Belum ada data.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* KONTROL PAGINATION BAWAH */}
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

      <div className="mt-10 lg:mt-14 w-full">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Tanya AI Assistant</h2>
        <p className="text-sm text-gray-500 mb-6">Punya pertanyaan tentang data prediksi di atas? Diskusikan langsung dengan AI KEEVA di sini.</p>
        <InlineChat />
      </div>

    </div>
  );
}

// Sub-komponen PredictionRow
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
      {/* <td className="py-4 text-center">
        <span className={`px-3 py-1 rounded-md text-[11px] font-semibold ${segmentColors[segment] || 'bg-gray-50 text-gray-500'}`}>
          {segment ?? '-'}
        </span>
      </td> */}
      <td className="py-4 text-center font-semibold text-gray-800">
        ${revenue_at_risk?.toLocaleString() ?? '0'}
      </td>
      {/* <td className="py-4 text-center text-gray-500">
        {activity ?? '-'}
      </td> */}
      <td className="py-4 text-center">
      </td>
    </tr>
  );
}