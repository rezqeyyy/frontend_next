// src/app/customer-list/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Filter, Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomerListPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5000); 

    if (error) {
      setErrorMsg(error.message);
    } else {
      setCustomers(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const isConfirm = window.confirm('Yakin ingin menghapus data mentah pelanggan ini?');
    if (!isConfirm) return;

    const { error } = await supabase.from('customers').delete().eq('id', id);

    if (error) {
      alert(`Gagal menghapus data: ${error.message}`);
    } else {
      setCustomers((prev) => prev.filter((cust) => cust.id !== id));
    }
  };

  const itemsLimit = itemsPerPage === 'all' ? customers.length : itemsPerPage;
  const totalPages = Math.ceil(customers.length / (itemsLimit || 1));
  const displayedData = customers.slice((currentPage - 1) * itemsLimit, currentPage * itemsLimit);

  if (errorMsg) return <div className="p-4 sm:p-8 text-red-500">Error: {errorMsg}</div>;

  return (
    <div className="p-4 pt-28 sm:p-6 sm:pt-24 lg:p-8 lg:pt-8 max-w-[1600px] mx-auto text-gray-800">
      
      {/* HEADER: Stack di HP, Row di Tablet/Desktop */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
        <div className="w-full md:w-auto">
          <h1 className="text-[22px] md:text-[28px] font-bold text-gray-900 leading-tight">Customer List (Raw Data)</h1>
          <p className="text-gray-400 mt-1 text-xs md:text-sm">Manage your raw customer database</p>
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
          Total: <span className="font-semibold text-gray-800">{customers.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* AREA TABEL: Otomatis bisa di-scroll horizontal jika tidak muat */}
        <div className="overflow-x-auto p-4 md:p-5 custom-scrollbar">
          <table className="w-full text-left text-sm min-w-[1200px]">
            <thead className="text-gray-500 border-b border-gray-100 bg-white">
              <tr>
                <th className="pb-3 font-medium px-2">#</th>
                <th className="pb-3 font-medium">Customer ID</th>
                <th className="pb-3 font-medium">Plan Type</th>
                <th className="pb-3 font-medium">Contract Type</th>
                <th className="pb-3 font-medium">Join Date</th>
                <th className="pb-3 font-medium text-center">Total Users</th>
                <th className="pb-3 font-medium text-center">Usage (Hrs)</th>
                <th className="pb-3 font-medium text-center">Last Login</th>
                <th className="pb-3 font-medium text-center">Total Revenue</th>
                <th className="pb-3 font-medium text-center">Tickets</th>
                {/* Aksi tetap menempel (sticky) di sebelah kanan */}
                <th className="pb-3 font-medium text-center sticky right-0 bg-white shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.05)] z-10">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {loading ? <tr><td colSpan={11} className="py-8 text-center text-gray-400">Loading data...</td></tr> : 
               displayedData.length > 0 ? displayedData.map((cust, idx) => (
                <tr key={cust.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-4 px-2">{(currentPage - 1) * (itemsPerPage === 'all' ? customers.length : itemsPerPage) + idx + 1}</td>
                  <td className="py-4 font-semibold text-gray-800">{cust.customer_id ?? '-'}</td>
                  <td className="py-4 text-gray-600">{cust.plan_type ?? '-'}</td>
                  <td className="py-4 text-gray-600">{cust.contract_type ?? '-'}</td>
                  <td className="py-4 text-gray-600">{cust.join_date ?? '-'}</td>
                  <td className="py-4 text-gray-600 text-center">{cust.total_users ?? '-'}</td>
                  <td className="py-4 text-gray-600 text-center">{cust.monthly_usage_hrs ?? '-'}</td>
                  <td className="py-4 text-gray-600 text-center">{cust.last_login_days ?? '-'} days</td>
                  <td className="py-4 text-gray-600 text-center font-medium">${cust.total_revenue?.toLocaleString() ?? '-'}</td>
                  <td className="py-4 text-gray-600 text-center">{cust.total_tickets ?? '-'}</td>
                  <td className="py-4 text-center sticky right-0 bg-white group-hover:bg-gray-50/50 shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.05)] z-10 transition-colors">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => router.push('/upload-csv')} className="p-1.5 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-md transition" title="Edit Data">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(cust.id)} className="p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-md transition" title="Delete Data">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan={11} className="py-8 text-center text-gray-400">Belum ada data pelanggan.</td></tr>}
            </tbody>
          </table>
        </div>
        
        {/* KONTROL PAGINATION BAWAH: Stack di HP agar tidak bertumpuk */}
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