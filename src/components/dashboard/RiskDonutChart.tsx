// src/components/dashboard/RiskDonutChart.tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { RiskData } from '@/types';

interface RiskDonutChartProps {
  data: RiskData[];
}

export const RiskDonutChart = ({ data }: RiskDonutChartProps) => {
  return (
    <div className="w-[160px] h-[160px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            nameKey="label" // <-- INI OBATNYA BIAR GAK MUNCUL "0"
            dataKey="value"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={4}
            cornerRadius={6}
            stroke="none"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry) => (
              <Cell 
                key={`cell-${entry.id}`} 
                fill={entry.color} 
                className="hover:opacity-80 transition-opacity duration-300 outline-none" 
              />
            ))}
          </Pie>
          {/* Tooltip dibikin lebih bersih */}
          <Tooltip 
            cursor={false}
            formatter={(value: any) => [`${value} Customers`, 'Total']}
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
            itemStyle={{ fontWeight: 600 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};