'use client';

// Tambahkan useState dari react
import { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import InlineChat from '@/components/chat/InlineChat'; 
import { usePredictionResults } from '@/hooks/usePredictionResults';
import { PredictionRow } from '@/components/prediction/PredictionRow';

// IMPOR MODAL DETAIL CUSTOMER (Sesuaikan path file modal Anda jika berbeda)
import CustomerDetailModal from '@/components/dashboard/CustomerDetailModal';

export default function PredictionResultsPage() {
  const {
    filteredCustomers,
    searchTerm,
    selectedRank,
    isLoading,
    errorMessage,
    itemsPerPage,
    currentPage,
    isPredicting,
    predictProgress,
    predictError,
    totalPages,
    displayedData,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
    handleRankFilterChange
  } = usePredictionResults();

  // STATE UNTUK MODAL DETAIL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Fungsi handler saat tombol View di baris tabel diklik
  const handleViewClick = (customer: any) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  if (errorMessage) {
    return <div className="p-4 sm:p-8 text-red-500 font-medium">Error: {errorMessage}</div>;
  }

  return (
    <div className="p-4 pt-24 sm:p-6 sm:pt-28 lg:p-8 max-w-[1600px] mx-auto text-gray-800 w-full overflow-hidden">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
        <div className="w-full md:w-auto">
          <h1 className="text-[22px] md:text-[28px] font-bold text-gray-900 leading-tight">Prediction Results</h1>
          <p className="text-gray-400 mt-1 text-xs md:text-sm">AI-driven churn prediction and segmentation analysis</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* SEARCH INPUT */}
          <div className="relative w-full sm:w-auto">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search customer ID..." 
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-base sm:text-sm w-full sm:w-[250px] focus:outline-none focus:border-blue-500"
            />
          </div>
          
          {/* RANK LEVEL FILTER DROPDOWN */}
          <div className="relative w-full sm:w-auto">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
            <select
              value={selectedRank}
              onChange={(e) => handleRankFilterChange(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-base sm:text-sm bg-white text-gray-600 focus:outline-none focus:border-blue-500 cursor-pointer w-full sm:w-auto appearance-none"
            >
              <option value="all">All Ranks</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">▼</div>
          </div>
        </div>
      </header>

      {/* BATCH PROGRESS BAR PANEL */}
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
                ? "Failed to predict remaining records. Please check the backend service connection." 
                : "Processing automatic model predictions... (You may safely switch tabs)"}
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

      {/* TOP DATATABLE FILTERS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>
          <select 
            value={itemsPerPage} 
            onChange={(e) => handleItemsPerPageChange(e.target.value)} 
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
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
          Total Analyzed: <span className="font-semibold text-gray-800">{filteredCustomers.length}</span>
        </div>
      </div>

      {/* TABLE ELEMENT VIEW */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto p-4 md:p-5 custom-scrollbar">
          <table className="w-full text-left text-sm min-w-[1200px]">
            <thead className="text-gray-500 border-b border-gray-100 bg-gray-50/30">
              <tr>
                <th className="py-3 px-2 font-medium">#</th>
                <th className="py-3 font-medium">Customer ID</th>
                <th className="py-3 font-medium text-center">Churn Risk Score</th>
                <th className="py-3 font-medium text-center">Rank Level</th>
                <th className="py-3 font-medium text-center">Revenue at Risk</th>
                <th className="py-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {isLoading ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400">Loading prediction metrics...</td></tr>
              ) : displayedData.length > 0 ? (
                displayedData.map((cust, idx) => (
                  <PredictionRow 
                    key={cust.id || `${cust.customer_id}-${idx}`} 
                    no={(currentPage - 1) * (itemsPerPage === 'all' ? filteredCustomers.length : itemsPerPage) + idx + 1} 
                    data={cust} 
                    onViewClick={handleViewClick} // PASSED PROPS HANDLER KE ROW
                  />
                ))
              ) : (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400">No records found matching the criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* BOTTOM PAGINATION CONTROLS */}
        {itemsPerPage !== 'all' && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 md:px-5 py-4 border-t border-gray-50 bg-gray-50/50">
            <p className="text-xs md:text-sm text-gray-500 text-center sm:text-left">
              Showing {(currentPage - 1) * Number(itemsPerPage) + 1} to {Math.min(currentPage * Number(itemsPerPage), filteredCustomers.length)} of {filteredCustomers.length} entries
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
                disabled={currentPage === 1} 
                className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs md:text-sm font-medium px-2 flex items-center">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} 
                disabled={currentPage === totalPages} 
                className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI ASSISTANT BOTTOM SECTION */}
      <div className="mt-10 lg:mt-14 w-full">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Ask AI Assistant</h2>
        <p className="text-sm text-gray-500 mb-6">Have questions about the analytical prediction metrics displayed above? Discuss insights immediately with KEEVA AI below.</p>
        <InlineChat tableData={displayedData} />
      </div>

      {/* RENDER MODAL DI SINI */}
      <CustomerDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} 
        customer={selectedCustomer} 
      />

    </div>
  );
}