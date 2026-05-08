// src/components/dashboard/ChurnRiskChart.tsx
'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
    data: any[];
}

export default function ChurnRiskChart({ data = [] }: { data?: any[] }) {
    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-400 text-xs">Belum ada data prediksi</div>;
    }
    return (
        <div className="w-full h-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                dot={{ r: 4, fill: '#fff', stroke: '#8b5cf6', strokeWidth: 2 }}
            />
            </AreaChart>
        </ResponsiveContainer>
        </div>
    );
}