// src/components/dashboard/CustomerDetailModal.tsx
'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
}

export default function CustomerDetailModal({ isOpen, onClose, customer }: CustomerDetailModalProps) {
  // Prevent scrolling di background pas modal kebuka
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-[500px] max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Tombol Close Silang - Diberi jarak aman dari scrollbar (right-6) */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-6 p-1.5 bg-white hover:bg-gray-100 text-gray-600 rounded-full transition z-50 shadow-md border border-gray-100"
        >
          <X size={16} />
        </button>

        <div className="overflow-y-auto custom-scrollbar">
          {/* HEADER GRADIENT */}
          <div className="bg-gradient-to-br from-[#f3eefe] to-[#e4f0ff] p-6 pb-8 relative">
            
            {/* Ditambah pr-14 khusus di baris ini agar teks persentase berjarak aman dan tidak nempel ke tombol close */}
            <div className="flex justify-between items-start mb-6 pr-14"> 
              <h2 className="text-2xl font-bold text-gray-900">{customer.customer_id}</h2>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900 leading-none">{customer.churn_risk_score}%</span>
                <p className="text-[11px] text-gray-500 font-medium">Churn Risk</p>
              </div>
            </div>

            {/* 3 Kotak Stats di atas */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-white/50 shadow-sm">
                <div className="text-lg font-bold text-blue-500">{customer.subscription_age || 0}</div>
                <div className="text-[10px] text-gray-500 font-medium uppercase">Months</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-white/50 shadow-sm">
                <div className="text-lg font-bold text-blue-500">${customer.revenue_at_risk?.toLocaleString() || 0}</div>
                <div className="text-[10px] text-gray-500 font-medium uppercase">Total Spent</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-white/50 shadow-sm">
                <div className="text-lg font-bold text-blue-500">{customer.average_nps_score || 0}/10</div>
                <div className="text-[10px] text-gray-500 font-medium uppercase">Avg NPS</div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-7">
            {/* SECTION: WHY CUSTOMER MIGHT CHURN */}
            <section>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Why This Customer Might Churn</h3>
              <div className="space-y-3">
                {/* Reason 1 - High Impact */}
                <div className="flex bg-red-50/50 border border-red-100 rounded-xl overflow-hidden relative">
                  <div className="w-1 bg-red-500 absolute left-0 top-0 bottom-0"></div>
                  <div className="p-3 pl-4 flex gap-3 w-full items-start">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-red-500 font-bold text-xs shadow-sm shrink-0 mt-0.5">1</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-semibold text-gray-900 leading-tight">Too many complaints and support tickets (12 tickets in 30 days)</p>
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-bold rounded uppercase tracking-wider shrink-0">High Impact</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Contribution to churn: 35.0%</p>
                    </div>
                  </div>
                </div>

                {/* Reason 2 - Medium Impact */}
                <div className="flex bg-orange-50/50 border border-orange-100 rounded-xl overflow-hidden relative">
                  <div className="w-1 bg-orange-400 absolute left-0 top-0 bottom-0"></div>
                  <div className="p-3 pl-4 flex gap-3 w-full items-start">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-orange-500 font-bold text-xs shadow-sm shrink-0 mt-0.5">2</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-semibold text-gray-900 leading-tight">Customer rarely logs into platform (only {customer.inactivity_days || 0} days inactivity)</p>
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[9px] font-bold rounded uppercase tracking-wider shrink-0">Medium Impact</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Contribution to churn: 28.0%</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION: RECOMMENDED ACTIONS */}
            <section>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Recommended Actions</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2.5 bg-[#ecfdf3] border border-[#a6f4c5] rounded-xl">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#12b76a] text-white font-bold text-xs shrink-0">1</div>
                  <p className="text-sm font-medium text-gray-900">Prioritize resolution of pending issues</p>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-[#ecfdf3] border border-[#a6f4c5] rounded-xl">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#12b76a] text-white font-bold text-xs shrink-0">2</div>
                  <p className="text-sm font-medium text-gray-900">Follow up with phone call from senior support</p>
                </div>
              </div>
            </section>

            {/* SECTION: ACTIVITY STATISTICS */}
            <section>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Activity Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Monthly Usage</p>
                  <p className="text-lg font-bold text-gray-900">{customer.monthly_usage_hrs?.toFixed(1) || 0} hrs</p>
                  <p className="text-[10px] text-gray-400 mt-1">per month</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Support Tickets</p>
                  <p className="text-lg font-bold text-gray-900">{customer.count_ticket_id || 0}</p>
                  <p className="text-[10px] text-gray-400 mt-1">total recorded</p>
                </div>
              </div>
            </section>
          </div>
          
        </div>
      </div>
    </div>
  );
}