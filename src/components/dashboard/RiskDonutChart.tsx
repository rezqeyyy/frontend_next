// src/components/dashboard/RiskDonutChart.tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { RiskData } from '@/types';

export const RiskDonutChart = ({ data }: { data: RiskData[] }) => {
  return (
    <div className="w-full h-full relative drop-shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            nameKey="label"
            dataKey="value"
            innerRadius="60%"
            outerRadius="90%"
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
                className="hover:opacity-80 transition-opacity duration-300 outline-none cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip 
            cursor={false}
            formatter={(value: any) => [`${value} Customers`, 'Total']}
            contentStyle={{ 
              borderRadius: '10px', 
              border: '1px solid #f3f4f6', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              backgroundColor: '#ffffff'
            }}
            itemStyle={{ fontWeight: 600, color: '#111827' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};