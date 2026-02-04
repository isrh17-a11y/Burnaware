'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface BurnoutScoreCardProps {
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations?: string[];
  previousScore?: number;
}

export default function BurnoutScoreCard({
  score,
  riskLevel,
  recommendations = [],
  previousScore,
}: BurnoutScoreCardProps) {
  const getColorClasses = () => {
    switch (riskLevel) {
      case 'low':
        return {
          bg: 'from-[var(--success)] to-[var(--primary)]',
          text: 'text-green-700',
          icon: 'text-green-600',
          border: 'border-green-200',
        };
      case 'medium':
        return {
          bg: 'from-[var(--warning)] to-[var(--accent)]',
          text: 'text-orange-700',
          icon: 'text-orange-600',
          border: 'border-orange-200',
        };
      case 'high':
        return {
          bg: 'from-[#763A12] to-[#AA4C0A]',
          text: 'text-[#763A12]',
          icon: 'text-[#AA4C0A]',
          border: 'border-[#AA4C0A]/20',
        };
    }
  };

  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'low':
        return <CheckCircle size={32} className={getColorClasses().icon} />;
      case 'medium':
        return <AlertTriangle size={32} className={getColorClasses().icon} />;
      case 'high':
        return <AlertCircle size={32} className={getColorClasses().icon} />;
    }
  };

  const getTrendIcon = () => {
    if (!previousScore) return <Minus size={20} className="text-gray-400" />;
    if (score < previousScore) return <TrendingDown size={20} className="text-green-600" />;
    if (score > previousScore) return <TrendingUp size={20} className="text-red-600" />;
    return <Minus size={20} className="text-gray-400" />;
  };

  const colors = getColorClasses();
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-[#F2EEEC]/60 to-[#F5DE7A]/20 backdrop-blur-2xl rounded-3xl shadow-xl shadow-[#763A12]/5 p-8 animate-fadeIn border border-[#763A12]/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#763A12] font-serif">Burnout Score</h2>
        {getRiskIcon()}
      </div>

      {/* Circular Progress */}
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="#E5E7EB"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={cn('stop-color-[var(--primary)]', riskLevel === 'low' && 'stop-color-[var(--success)]', riskLevel === 'medium' && 'stop-color-[var(--warning)]', riskLevel === 'high' && 'stop-color-[var(--danger)]')} />
                <stop offset="100%" className={cn('stop-color-[var(--secondary)]', riskLevel === 'low' && 'stop-color-[var(--primary)]', riskLevel === 'medium' && 'stop-color-[var(--accent)]', riskLevel === 'high' && 'stop-color-[var(--accent)]')} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={cn('text-5xl font-bold', colors.text)}>{score}</div>
            <div className="text-gray-500 text-sm">/ 100</div>
          </div>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className={cn('px-6 py-2 rounded-full text-sm font-semibold shadow-sm border border-white/20', `bg-gradient-to-r ${colors.bg} text-white`)}>
          {riskLevel.toUpperCase()} RISK
        </div>
        {previousScore && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            {getTrendIcon()}
            <span>{Math.abs(score - previousScore)} pts</span>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className={cn('p-4 rounded-2xl border', colors.border, 'bg-opacity-10')}>
          <h3 className="font-semibold text-gray-900 mb-2">Recommendations</h3>
          <ul className="space-y-2">
            {recommendations.slice(0, 3).map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-[var(--primary)] mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
