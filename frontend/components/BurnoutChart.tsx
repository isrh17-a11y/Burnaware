'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BurnoutHistory } from '@/lib/types';
import { Calendar } from 'lucide-react';

interface BurnoutChartProps {
  data: BurnoutHistory[];
}

export default function BurnoutChart({ data }: BurnoutChartProps) {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const filterData = () => {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    return data.slice(-days);
  };

  const chartData = filterData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
          <p className="text-sm text-gray-600">{payload[0].payload.date}</p>
          <p className="text-lg font-bold text-[var(--primary)]">
            Score: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-[#F2EEEC]/60 to-[#F5DE7A]/20 backdrop-blur-2xl rounded-3xl shadow-xl shadow-[#763A12]/5 p-6 animate-fadeIn border border-[#763A12]/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="text-[#AA4C0A]" size={24} />
          <h2 className="text-2xl font-bold text-[#763A12] font-serif">Burnout Trends</h2>
        </div>
        
        {/* Period Selector */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                period === p
                  ? 'bg-gradient-to-r from-[#AA4C0A] to-[#E08600] text-white shadow-md'
                  : 'text-[#763A12]/60 hover:text-[#763A12]'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#AA4C0A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E08600" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                stroke="#763A12"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#AA4C0A"
                strokeWidth={3}
                dot={{ fill: '#AA4C0A', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#E08600' }}
                fill="url(#colorScore)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>No data available yet</p>
              <p className="text-sm mt-2">Complete assessments to see your trends</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {chartData.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-[var(--success)]/20 to-[var(--primary)]/20 p-4 rounded-2xl">
            <div className="text-sm text-gray-600 mb-1">Lowest</div>
            <div className="text-2xl font-bold text-green-600">
              {Math.min(...chartData.map((d) => d.score))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20 p-4 rounded-2xl">
            <div className="text-sm text-gray-600 mb-1">Average</div>
            <div className="text-2xl font-bold text-[var(--primary)]">
              {Math.round(chartData.reduce((sum, d) => sum + d.score, 0) / chartData.length)}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[var(--danger)]/20 to-[var(--accent)]/20 p-4 rounded-2xl">
            <div className="text-sm text-gray-600 mb-1">Highest</div>
            <div className="text-2xl font-bold text-red-600">
              {Math.max(...chartData.map((d) => d.score))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
