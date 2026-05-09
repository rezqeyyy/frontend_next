// src/components/dashboard/CustomerPriorityList.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/actions/auth';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

// Panggil komponen Modal-nya di sini
import CustomerDetailModal from './CustomerDetailModal';

export default function CustomerPriorityList() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  useEffect(() => {
    fetchPriorityCustomers();
  }, []);

  const fetchPriorityCustomers = async () => {
    try {
      const user = await getCurrentUser() as any;
      if (!user || !user.id) return;

      const { data: userDatasets } = await supabase.from('datasets').select('id').eq('user_id', user.id);
      const datasetIds = userDatasets?.map(d => d.id) || [];
      
      if (datasetIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .in('dataset_id', datasetIds)
        .order('churn_risk_score', { ascending: false })
        .limit(5);

      if (!error && data) {
        setCustomers(data);
      }
    } catch (err) {
      console.error("Gagal menarik data priority list:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRankStyle = (rank: string) => {
    const r = rank?.toLowerCase() || '';
    if (r === 'high') return 'bg-red-50 text-red-500';
    if (r === 'medium') return 'bg-orange-50 text-orange-500';
    return 'bg-green-50 text-green-500'; 
  };

  const getSegmentStyle = (rank: string) => {
    const r = rank?.toLowerCase() || '';
    if (r === 'high') return { text: 'ALL RISK USER', style: 'bg-red-50 text-red-500' };
    if (r === 'medium') return { text: 'REGULER USER', style: 'bg-blue-50 text-blue-500' };
    return { text: 'POWER USER', style: 'bg-green-50 text-green-500' };
  };

  const handleViewClick = (customer: any) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full">
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Customer Priority List</h3>
          <Link href="/prediction-results" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
            View all <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto p-5">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="text-gray-500 border-b border-gray-100">
              <tr>
                <th className="pb-3 font-medium px-2">#</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Risk Score</th>
                <th className="pb-3 font-medium">Rank</th>
                <th className="pb-3 font-medium">Segment</th>
                <th className="pb-3 font-medium">Revenue</th>
                <th className="pb-3 font-medium">Activity</th>
                <th className="pb-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {loading ? (
                <tr><td colSpan={8} className="py-8 text-center text-gray-400">Menganalisis pelanggan prioritas...</td></tr>
              ) : customers.length > 0 ? (
                customers.map((cust, idx) => {
                  const segment = getSegmentStyle(cust.rank_level);
                  return (
                    <tr key={cust.id || `${cust.customer_id}-${idx}`} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition">
                      <td className="py-4 px-2 text-gray-500">{idx + 1}</td>
                      <td className="py-4 font-semibold text-gray-900">{cust.customer_id || '-'}</td>
                      <td className="py-4 font-medium text-gray-800">{cust.churn_risk_score || 0}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${getRankStyle(cust.rank_level)}`}>
                          {cust.rank_level || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${segment.style}`}>
                          {segment.text}
                        </span>
                      </td>
                      <td className="py-4 font-bold text-gray-900">
                        ${(cust.revenue_at_risk || 0).toLocaleString()}
                      </td>
                      <td className="py-4 text-gray-500">
                        {cust.inactivity_days || 0} days ago
                      </td>
                      <td className="py-4 text-center">
                        <button 
                          onClick={() => handleViewClick(cust)}
                          className="px-4 py-1.5 border border-blue-200 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-50 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={8} className="py-8 text-center text-gray-400">Belum ada data pelanggan yang dianalisis.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal ditaruh di sini biar dipanggil pas tombol View diklik */}
      <CustomerDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        customer={selectedCustomer} 
      />
    </>
  );
}