import React from 'react';
import { Users, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingStatsCardsProps {
  stats: {
    total: number;
    completed: number;
    conversionRate: number;
    avgTime: number;
  };
}

export const OnboardingStatsCards: React.FC<OnboardingStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { label: 'Wszystkie Sesje', value: stats.total, icon: <Users />, color: 'text-white' },
        { label: 'Ukończone (Lead)', value: stats.completed, icon: <CheckCircle2 />, color: 'text-emerald-500' },
        { label: 'Konwersja', value: `${stats.conversionRate}%`, icon: <TrendingUp />, color: 'text-brand-blue' },
        { label: 'Śr. Czas Sesji', value: `${stats.avgTime}s`, icon: <Clock />, color: 'text-amber-500' },
      ].map((stat, i) => (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          key={i} 
          className="bg-[#0f172a] p-8 rounded-[var(--radius-brand-card)] border border-slate-800 shadow-xl"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-900 rounded-[var(--radius-brand-button)] text-slate-400">
              {stat.icon}
            </div>
          </div>
          <p className="text-4xl font-black text-white mb-1">{stat.value}</p>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};
