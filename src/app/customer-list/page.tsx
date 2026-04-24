// src/app/customer-list/page.tsx
import { supabase } from '@/lib/supabase';
import { ArrowUp, ArrowDown, Search, Filter } from 'lucide-react';

export default async function CustomerListPage() {
  // Fetch data langsung dari Supabase di sisi server
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-4 md:p-8 text-red-500">Error fetching data: {error.message}</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto text-gray-800 w-full overflow-hidden">
      
      {/* HEADER RESPONSIF */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-[24px] md:text-[28px] font-bold text-gray-900 leading-tight">Customer List</h1>
          <p className="text-gray-400 mt-1 text-sm">Manage and monitor all your customers</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search customer..." 
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full sm:w-[250px]"
            />
          </div>
          <button className="w-full sm:w-auto bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition font-medium">
            <Filter size={16} /> <span>Filter</span>
          </button>
        </div>
      </header>

      {/* TABLE RESPONSIF */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden w-full">
        <div className="overflow-x-auto p-4 md:p-5">
          {/* min-w-[900px] penting agar tabel rapi dan bisa di-scroll horizontal di HP */}
          <table className="w-full text-left text-sm min-w-[900px]">
            <thead className="text-gray-500 border-b border-gray-100">
              <tr>
                <th className="pb-3 font-medium px-2">#</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Churn Risk Score</th>
                <th className="pb-3 font-medium">Rank Level</th>
                <th className="pb-3 font-medium">Segment</th>
                <th className="pb-3 font-medium">Revenue at Risk</th>
                <th className="pb-3 font-medium">Level Activity</th>
                <th className="pb-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {customers && customers.length > 0 ? (
                customers.map((cust, idx) => (
                  <TableRow 
                    key={cust.id}
                    no={idx + 1} 
                    name={cust.name} 
                    score={cust.churn_risk_score} 
                    rank={cust.rank_level} 
                    segment={cust.segment} 
                    revenue={`$${cust.revenue_at_risk?.toLocaleString()}`} 
                    activity={cust.level_activity} 
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    Belum ada data pelanggan. Silakan upload CSV terlebih dahulu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Sub-komponen baris tabel
function TableRow({ no, name, score, rank, segment, revenue, activity }: any) {
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
      <td className="py-4 font-semibold text-gray-800">{name}</td>
      <td className="py-4">
        <div className="flex items-center gap-3">
          <span className="font-medium w-4">{score}</span>
          {score > 50 ? <ArrowUp size={12} className="text-red-500" /> : <ArrowDown size={12} className="text-green-500" />}
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
            <div className={`h-full ${barColor}`} style={{ width: `${score}%` }} />
          </div>
        </div>
      </td>
      <td className="py-4">
        <span className={`px-3 py-1 rounded-md text-[11px] font-semibold ${rankColors[rank] || 'bg-gray-100 text-gray-600'}`}>
          {rank}
        </span>
      </td>
      <td className="py-4">
        <span className={`px-3 py-1 rounded-md text-[11px] font-semibold border border-transparent whitespace-nowrap ${segmentColors[segment] || 'bg-gray-50 text-gray-500'}`}>
          {segment}
        </span>
      </td>
      <td className="py-4 font-semibold text-gray-800">{revenue}</td>
      <td className="py-4 text-gray-500">{activity}</td>
      <td className="py-4 text-center">
        <button className="text-blue-500 border border-blue-200 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition text-xs font-medium">
          View
        </button>
      </td>
    </tr>
  );
}