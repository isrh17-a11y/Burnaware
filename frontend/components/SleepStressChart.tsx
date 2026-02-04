'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BurnoutHistory } from '@/lib/types';
import { Moon } from 'lucide-react';

interface SleepStressChartProps {
  data: BurnoutHistory[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
        <p className="text-sm text-gray-600 mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[#763A12]">
            Sleep: {payload[0].value} hrs
          </p>
          <p className="text-sm font-semibold text-[#E08600]">
            Stress Level: {payload[1].value}/10
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function SleepStressChart({ data }: SleepStressChartProps) {

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 animate-fadeIn flex items-center justify-center h-96">
        <p className="text-gray-500">No sleep/stress data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#F2EEEC]/60 to-[#F5DE7A]/20 backdrop-blur-2xl rounded-3xl shadow-xl shadow-[#763A12]/5 p-6 animate-fadeIn border border-[#763A12]/10">
      <div className="flex items-center gap-2 mb-6">
        <Moon className="text-[#763A12]" size={24} />
        <h2 className="text-2xl font-bold text-[#763A12] font-serif">Sleep vs Stress</h2>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#763A12" 
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis 
              yAxisId="left"
              stroke="#763A12"
              orientation="left"
              style={{ fontSize: '12px' }}
              label={{ value: 'Sleep (hrs)', angle: -90, position: 'insideLeft', style: { fill: '#763A12' } }}
            />
            <YAxis 
              yAxisId="right"
              stroke="#E08600"
              orientation="right"
              style={{ fontSize: '12px' }}
              label={{ value: 'Stress (1-10)', angle: 90, position: 'insideRight', style: { fill: '#E08600' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#763A12' }} />
            <Bar 
              yAxisId="left"
              dataKey="sleep_hours" 
              name="Sleep Hours" 
              fill="#763A12" 
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar 
              yAxisId="right"
              dataKey="stress_level" 
              name="Stress Level" 
              fill="#E08600" 
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-sm text-[#763A12]/70 mt-4 text-center">
        Compare your sleep (brown) against reported stress levels (orange).
      </p>
    </div>
  );
}
