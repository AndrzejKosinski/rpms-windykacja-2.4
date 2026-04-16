import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useOnboardingLogic } from '../hooks/useOnboardingLogic';

import { OnboardingHeader } from './onboarding/OnboardingHeader';
import { OnboardingStatsCards } from './onboarding/OnboardingStatsCards';
import { OnboardingCharts } from './onboarding/OnboardingCharts';
import { OnboardingContactStats } from './onboarding/OnboardingContactStats';
import { OnboardingDeviceStats } from './onboarding/OnboardingDeviceStats';
import { OnboardingSessionsTable } from './onboarding/OnboardingSessionsTable';

const OnboardingDashboard: React.FC = () => {
  const {
    isLoading,
    timeRange,
    setTimeRange,
    fetchLogs,
    filteredSessions,
    funnelData,
    contactStats,
    choiceData,
    deviceStats,
    stats
  } = useOnboardingLogic();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <RefreshCw className="animate-spin text-brand-blue mb-4" size={48} />
        <p className="text-slate-500 font-bold">Analizowanie podróży użytkowników...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <OnboardingHeader 
        timeRange={timeRange} 
        setTimeRange={setTimeRange} 
        isLoading={isLoading} 
        onRefresh={fetchLogs} 
      />

      <OnboardingStatsCards stats={stats} />

      <OnboardingCharts funnelData={funnelData} choiceData={choiceData} />

      <OnboardingContactStats contactStats={contactStats} />

      <OnboardingDeviceStats deviceStats={deviceStats} />

      <OnboardingSessionsTable filteredSessions={filteredSessions} />
    </div>
  );
};

export default OnboardingDashboard;
