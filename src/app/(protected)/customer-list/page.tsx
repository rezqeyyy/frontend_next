// src/app/(protected)/customer-list/page.tsx

'use client';

import { Search, Filter, Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCustomers } from '@/hooks/useCustomers';

export default function CustomerListPage() {
  const router = useRouter();
  const {
    loading,
    errorMsg,
    searchTerm,
    handleSearch,
    itemsPerPage,
    handleItemsPerPage,
    currentPage,
    handlePageChange,
    filteredCustomers,
    totalPages,
    displayedData,
    handleDelete,
    handleDeleteAll, // Panggil dari hooks
    churnFilter,
    setChurnFilter
  } = useCustomers();

  if (errorMsg) return <div className="p-4 sm:p-8 text-red-500 font-medium">Error: {errorMsg}</div>;

  return (
    <div className="p-4 pt-28 sm:p-6 sm:pt-24 lg:p-8 lg:pt-8 max-w-[1600px] mx-auto text-gray-800">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
        <div className="w-full md:w-auto">
          <h1 className="text-[22px] md:text-[28px] font-bold text-gray-900 leading-tight">Customer List (Private Data)</h1>
          <p className="text-gray-400 mt-1 text-xs md:text-sm">Manage your technical customer database metrics</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* SEARCH INPUT */}
          <div className="relative w-full sm:w-auto">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search customer ID..." 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-base sm:text-sm w-full sm:w-[250px] focus:outline-none focus:border-blue-500"
            />
          </div>
          
          {/* DROPDOWN FILTER CHURN */}
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Filter size={16} className="text-gray-400" />
            </div>
            <select
              value={churnFilter}
              onChange={(e) => setChurnFilter(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-base sm:text-sm text-gray-600 appearance-none focus:outline-none focus:border-blue-500 hover:bg-gray-50 transition cursor-pointer w-full"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="churned">Churned</option>
            </select>
          </div>
        </div>
      </header>

      {/* KONTROL PAGINATION ATAS & TOMBOL DELETE ALL */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>
          <select 
            value={itemsPerPage} 
            onChange={(e) => handleItemsPerPage(e.target.value)} 
            className="border border-gray-200 rounded-md px-2 py-1 focus:outline-none bg-white text-base sm:text-sm cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
          <span>entries</span>
        </div>
        
        {/* TOTAL DATA & TOMBOL HAPUS SEMUA */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            Total: <span className="font-semibold text-gray-800">{filteredCustomers.length}</span>
          </div>
          
          <button 
            onClick={handleDeleteAll}
            disabled={loading || filteredCustomers.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            Hapus Semua Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* AREA TABEL */}
        <div className="overflow-x-auto p-4 md:p-5 custom-scrollbar">
          <table className="w-full text-left text-sm min-w-[1400px]">
            <thead className="text-gray-500 border-b border-gray-100 bg-white">
              <tr>
                <th className="pb-3 font-medium px-2">#</th>
                <th className="pb-3 font-medium">Customer ID</th>
                <th className="pb-3 font-medium text-center">Total Users</th>
                <th className="pb-3 font-medium text-center">Usage (Hrs)</th>
                <th className="pb-3 font-medium text-center">Inactivity (Days)</th>
                <th className="pb-3 font-medium text-center">Total Payment</th>
                <th className="pb-3 font-medium text-center">Avg NPS</th>
                <th className="pb-3 font-medium text-center">Tickets</th>
                <th className="pb-3 font-medium text-center">Sub. Age</th>
                <th className="pb-3 font-medium text-center">Actual Churn</th>
                <th className="pb-3 font-medium text-center sticky right-0 bg-white shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.05)] z-10">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {loading ? (
                <tr><td colSpan={11} className="py-8 text-center text-gray-400">Loading your data...</td></tr>
              ) : displayedData.length > 0 ? (
                displayedData.map((cust, idx) => (
                  <tr key={cust.id || `${cust.customer_id}-${idx}`} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-4 px-2">
                      {(currentPage - 1) * (itemsPerPage === 'all' ? filteredCustomers.length : Number(itemsPerPage)) + idx + 1}
                    </td>
                    <td className="py-4 font-semibold text-gray-800">{cust.customer_id ?? '-'}</td>
                    <td className="py-4 text-center">{cust.total_users ?? 0}</td>
                    <td className="py-4 text-center text-gray-600">{cust.monthly_usage_hrs?.toFixed(1) ?? '0'}</td>
                    <td className="py-4 text-center text-gray-600">{cust.inactivity_days ?? 0} days</td>
                    <td className="py-4 text-center font-medium text-gray-800">${cust.sum_payment_value?.toLocaleString() ?? '0'}</td>
                    <td className="py-4 text-center text-gray-600">{cust.average_nps_score ?? '-'}</td>
                    <td className="py-4 text-center text-gray-600">{cust.count_ticket_id ?? 0}</td>
                    <td className="py-4 text-center text-gray-600">{cust.subscription_age?.toFixed(0) ?? '-'}</td>
                    <td className="py-4 text-center">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${cust.churn_actual === 1 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {cust.churn_actual === 1 ? 'CHURNED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-4 text-center sticky right-0 bg-white group-hover:bg-gray-50/50 shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.05)] z-10 transition-colors">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => router.push('/upload-csv')} className="p-1.5 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-md transition" title="Update Data via CSV">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(cust.customer_id)} className="p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-md transition" title="Delete Customer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={11} className="py-8 text-center text-gray-400">Tidak ada data pelanggan yang cocok dengan filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* KONTROL PAGINATION BAWAH */}
        {itemsPerPage !== 'all' && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 md:px-5 py-4 border-t border-gray-50 bg-gray-50/50">
            <p className="text-xs md:text-sm text-gray-500 text-center sm:text-left">
              Showing {filteredCustomers.length === 0 ? 0 : (currentPage - 1) * Number(itemsPerPage) + 1} to {Math.min(currentPage * Number(itemsPerPage), filteredCustomers.length)} of {filteredCustomers.length} entries
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange('prev')} 
                disabled={currentPage === 1} 
                className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs md:text-sm font-medium px-2 flex items-center">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => handlePageChange('next')} 
                disabled={currentPage === totalPages || totalPages === 0} 
                className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition cursor-pointer"
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