'use client';

import { BurnoutHistory } from '@/lib/types';
import { Clock, Download } from 'lucide-react';

interface HistoryTableProps {
  data: BurnoutHistory[];
}

export default function HistoryTable({ data }: HistoryTableProps) {
  // Sort by date descending (newest first)
  const sortedData = [...data].reverse();

  return (
    <div className="bg-gradient-to-br from-[#F2EEEC]/60 to-[#F5DE7A]/20 backdrop-blur-2xl rounded-3xl shadow-xl shadow-[#763A12]/5 p-6 animate-fadeIn border border-[#763A12]/10">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Clock className="text-[#763A12]" size={24} />
          <h2 className="text-2xl font-bold text-[#763A12] font-serif">History</h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#763A12]/10">
              <th className="pb-4 font-semibold text-[#763A12]/70">Date</th>
              <th className="pb-4 font-semibold text-[#763A12]/70">Score</th>
              <th className="pb-4 font-semibold text-[#763A12]/70">Status</th>
              <th className="pb-4 font-semibold text-[#763A12]/70">Sleep</th>
              <th className="pb-4 font-semibold text-[#763A12]/70">Stress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedData.map((record, index) => (
              <tr key={index} className="group hover:bg-[#F5DE7A]/10 transition-colors">
                <td className="py-4 text-[#763A12] font-medium">{record.date}</td>
                <td className="py-4">
                  <span className={`inline-block px-2 py-1 rounded-lg text-sm font-bold ${
                    record.score < 30 ? 'bg-green-100 text-green-800' :
                    record.score < 60 ? 'bg-[#F5DE7A]/30 text-[#AA4C0A]' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {record.score}
                  </span>
                </td>
                <td className="py-4 text-[#763A12]/80">
                    {record.score < 30 ? 'Low Risk' : record.score < 60 ? 'Moderate' : 'High Risk'}
                </td>
                <td className="py-4 text-[#763A12]/80">{record.sleep_hours}h</td>
                <td className="py-4 text-[#763A12]/80">{record.stress_level}/10</td>
              </tr>
            ))}
            {sortedData.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
