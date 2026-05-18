// src/components/feature-importance/CustomerPriorityList.tsx
import Link from 'next/link';
import { MoreVertical } from 'lucide-react';

interface CustomerData {
    id: string;
    riskScore: number;
    rank: string;
    segment: string;
    revenue: number;
    inactivityDays: number;
    }

    export default function CustomerPriorityList({ customers }: { customers?: CustomerData[] }) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
        }).format(value);
    };

    const formatActivity = (days: number) => {
        if (days === 0) return "Active today";
        if (days < 30) return `${days} days ago`;
        if (days >= 30 && days < 365) return `${Math.floor(days / 30)} months ago`;
        return "1 year+";
    };

    const getRankBadge = (rank: string) => {
        const baseStyle = "px-2 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wider text-white shadow-sm";
        switch (rank?.toUpperCase()) {
        case 'HIGH': return <span className={`${baseStyle} bg-red-500`}>HIGH</span>;
        case 'MEDIUM': return <span className={`${baseStyle} bg-orange-500`}>MEDIUM</span>;
        case 'LOW': return <span className={`${baseStyle} bg-green-500`}>LOW</span>;
        default: return <span className={`${baseStyle} bg-gray-400`}>{rank || '-'}</span>;
        }
    };

    const getSegmentBadge = (segment: string) => {
        const baseStyle = "px-2 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wider text-white shadow-sm";
        if (segment === 'POWER USER') return <span className={`${baseStyle} bg-green-500`}>POWER USER</span>;
        return <span className={`${baseStyle} bg-blue-500`}>REGULER USER</span>;
    };

    return (
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm w-full overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
                <tr className="border-b border-gray-100">
                <th className="py-3 px-2 text-xs font-bold text-gray-900">#</th>
                <th className="py-3 px-2 text-xs font-bold text-gray-900">Customer</th>
                <th className="py-3 px-2 text-xs font-bold text-gray-900">Risk Score</th>
                <th className="py-3 px-2 text-xs font-bold text-gray-900">Rank</th>
                <th className="py-3 px-2 text-xs font-bold text-gray-900">Segment</th>
                <th className="py-3 px-2 text-xs font-bold text-gray-900">Revenue</th>
                <th className="py-3 px-2 text-xs font-bold text-gray-900">Activity</th>
                <th className="py-3 px-2 text-xs font-bold text-gray-900 text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                {!customers || customers.length === 0 ? (
                <tr>
                    <td colSpan={8} className="py-8 text-center text-sm text-gray-400 font-medium border-b border-gray-50">
                    Menganalisis data pelanggan yang terdampak...
                    </td>
                </tr>
                ) : (
                customers.map((customer, index) => (
                    <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-2 text-sm text-gray-500 font-medium">{index + 1}</td>
                    <td className="py-3 px-2 text-sm text-gray-900 font-bold">{customer.id}</td>
                    <td className="py-3 px-2 text-sm text-gray-600 font-medium">{customer.riskScore}</td>
                    <td className="py-3 px-2">{getRankBadge(customer.rank)}</td>
                    <td className="py-3 px-2">{getSegmentBadge(customer.segment)}</td>
                    <td className="py-3 px-2 text-sm text-gray-900 font-bold">{formatCurrency(customer.revenue)}</td>
                    <td className="py-3 px-2 text-sm text-gray-500 font-medium">{formatActivity(customer.inactivityDays)}</td>
                    <td className="py-3 px-2 text-center">
                        <button className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-white shadow-sm transition">
                        <MoreVertical size={16} />
                        </button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
        </div>
    );
}