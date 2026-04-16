import React from 'react';

export const DashboardSkeleton = () => (
  <div className="bg-white rounded-[var(--radius-brand-card)] border border-slate-100 p-8 lg:p-10 shadow-sm animate-pulse">
    <div className="flex flex-col lg:flex-row justify-between gap-8 mb-10">
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-slate-100 rounded-[var(--radius-brand-button)]"></div>
          <div className="space-y-2">
            <div className="h-6 w-48 bg-slate-100 rounded-[var(--radius-brand-input)]"></div>
            <div className="h-3 w-32 bg-slate-50 rounded-[var(--radius-brand-input)]"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-24 bg-slate-50 rounded-[var(--radius-brand-input)]"></div>
          <div className="h-10 w-40 bg-slate-100 rounded-[var(--radius-brand-input)]"></div>
        </div>
      </div>
      <div className="flex flex-col gap-3 min-w-[240px]">
        <div className="h-14 w-full bg-slate-100 rounded-[var(--radius-brand-button)]"></div>
        <div className="h-14 w-full bg-slate-50 rounded-[var(--radius-brand-button)]"></div>
      </div>
    </div>
    <div className="h-1 bg-slate-50 w-full rounded-full"></div>
  </div>
);
