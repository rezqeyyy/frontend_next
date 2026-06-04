// src/components/dashboard/ChurnRiskChart.tsx
'use client';

// KITA GANTI IMPORTNYA JADI AreaChart & Area
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ChurnRiskChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-gray-400 text-sm">Waiting for trend data...</div>;
  }

  // --- WARNA UNGU KHAS DESAIN LU (#8b5cf6) ---
  const primaryPurple = '#8b5cf6'; 

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        
        {/* INI KUNCI BUAT BIKIN EFEK GRADIEN UNGU DI BAWAH GARIS */}
        <defs>
          <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={primaryPurple} stopOpacity={0.5}/>
            <stop offset="95%" stopColor={primaryPurple} stopOpacity={0}/>
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#9ca3af' }} 
          dy={10}
          padding={{ left: 30, right: 10 }} 
        />
        
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#9ca3af' }} 
          dx={-10} 
        />
        
        <Tooltip 
          contentStyle={{ 
            borderRadius: '12px', 
            border: 'none', 
            boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.2)', 
            padding: '12px 16px',
            backgroundColor: 'white'
          }}
          labelStyle={{ color: '#1f2937', fontWeight: 'bold', marginBottom: '4px' }}
          itemStyle={{ color: primaryPurple, fontWeight: 'bold' }}
          formatter={(value: any) => [`${value}%`]}
        />
        
        {/* GANTI <Line> JADI <Area> */}
        <Area 
          type="monotone" 
          dataKey="risk" 
          name="Avg Risk Score"
          stroke={primaryPurple} 
          strokeWidth={3} 
          fillOpacity={1}
          fill="url(#colorRisk)" // PANGGIL GRADIEN DI SINI
          
          // Bunderan persis kayak desain lu: dalem putih, luar ungu
          dot={{ 
            r: 5, 
            strokeWidth: 2, 
            fill: '#fff', 
            stroke: primaryPurple 
          }} 
          activeDot={{ 
            r: 7, 
            strokeWidth: 3,
            fill: '#fff', 
            stroke: primaryPurple 
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}