import { useState, useEffect, useMemo } from 'react';
import { analyticsService } from '@/shared/api/apiClientFactory';

export interface LogEntry {
  timestamp: string;
  event_name: string;
  user_email: string;
  session_id: string;
  metadata: string;
  url: string;
  user_agent: string;
}

export interface Session {
  id: string;
  user: string;
  startTime: string;
  endTime: string;
  duration: number;
  events: LogEntry[];
  steps: string[];
  isCompleted: boolean;
  choice: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
}

export const useOnboardingLogic = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'all' | 'today' | '7d' | '30d'>('all');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await analyticsService.getLogs();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const sessions = useMemo(() => {
    const grouped: Record<string, LogEntry[]> = {};
    logs.forEach(log => {
      if (!grouped[log.session_id]) grouped[log.session_id] = [];
      grouped[log.session_id].push(log);
    });

    const getDeviceType = (ua: string): 'Desktop' | 'Mobile' | 'Tablet' => {
      const lowerUA = (ua || '').toLowerCase();
      if (lowerUA.includes('tablet') || lowerUA.includes('ipad')) return 'Tablet';
      if (lowerUA.includes('mobile') || lowerUA.includes('android') || lowerUA.includes('iphone')) return 'Mobile';
      return 'Desktop';
    };

    return Object.entries(grouped).map(([id, events]) => {
      const sortedEvents = [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const start = new Date(sortedEvents[0].timestamp);
      const end = new Date(sortedEvents[sortedEvents.length - 1].timestamp);
      
      const onboardingSteps = sortedEvents
        .filter(e => e.event_name.startsWith('onboarding_step_'))
        .map(e => e.event_name.replace('onboarding_step_', ''));

      const choiceEvent = sortedEvents.find(e => e.event_name === 'onboarding_choice_made');
      let choice = 'unknown';
      if (choiceEvent) {
        try {
          const meta = JSON.parse(choiceEvent.metadata);
          choice = meta.choice;
        } catch(e) {}
      } else {
        if (sortedEvents.some(e => e.event_name.includes('lawyer'))) choice = 'lawyer_consultation';
        else if (sortedEvents.some(e => e.event_name.includes('consultation'))) choice = 'expert_audit';
        else if (sortedEvents.some(e => e.event_name.includes('lead_form'))) choice = 'offer_request';
      }

      const successEvents = ['onboarding_step_thanks', 'lead_form_submitted', 'lawyer_form_submitted', 'consultation_form_submitted'];

      return {
        id,
        user: sortedEvents[0].user_email,
        startTime: sortedEvents[0].timestamp,
        endTime: sortedEvents[sortedEvents.length - 1].timestamp,
        duration: Math.round((end.getTime() - start.getTime()) / 1000),
        events: sortedEvents,
        steps: onboardingSteps,
        isCompleted: sortedEvents.some(e => successEvents.includes(e.event_name)),
        choice,
        deviceType: getDeviceType(sortedEvents[0].user_agent || '')
      } as Session;
    }).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }, [logs]);

  const filteredSessions = useMemo(() => {
    const now = new Date();
    return sessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      if (timeRange === 'today') {
        return sessionDate.toDateString() === now.toDateString();
      }
      if (timeRange === '7d') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return sessionDate >= sevenDaysAgo;
      }
      if (timeRange === '30d') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return sessionDate >= thirtyDaysAgo;
      }
      return true;
    });
  }, [sessions, timeRange]);

  const funnelData = useMemo(() => {
    const steps = ['started', 'entry', 'file_management', 'contact', 'thanks'];
    return steps.map(stepName => {
      const count = filteredSessions.filter(s => {
        if (stepName === 'started') return s.events.some(e => e.event_name === 'onboarding_started');
        return s.steps.includes(stepName);
      }).length;
      return { name: stepName, value: count };
    });
  }, [filteredSessions]);

  const contactStats = useMemo(() => {
    const allEvents = filteredSessions.flatMap(s => s.events);
    const lawyerOpens = allEvents.filter(l => l.event_name === 'lawyer_modal_opened').length;
    const lawyerSubmits = allEvents.filter(l => l.event_name === 'lawyer_form_submitted').length;
    const consultationOpens = allEvents.filter(l => l.event_name === 'consultation_modal_opened').length;
    const consultationSubmits = allEvents.filter(l => l.event_name === 'consultation_form_submitted').length;
    const leadSubmits = allEvents.filter(l => l.event_name === 'lead_form_submitted').length;
    const leadStarts = allEvents.filter(l => l.event_name === 'lead_form_started').length;

    return [
      { name: 'Prawnik (Lawyer)', opens: lawyerOpens, submits: lawyerSubmits },
      { name: 'Konsultacja (Audit)', opens: consultationOpens, submits: consultationSubmits },
      { name: 'Oferta (Lead Form)', opens: leadStarts, submits: leadSubmits }
    ];
  }, [filteredSessions]);

  const choiceData = useMemo(() => {
    const counts: Record<string, number> = { 
      upload_file: 0, 
      manual_entry: 0, 
      client_panel: 0, 
      unknown: 0,
      lawyer_consultation: 0,
      expert_audit: 0,
      offer_request: 0
    };
    filteredSessions.forEach(s => {
      if (s.choice) counts[s.choice] = (counts[s.choice] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredSessions]);

  const deviceStats = useMemo(() => {
    const stats = {
      Desktop: { count: 0, completed: 0 },
      Mobile: { count: 0, completed: 0 },
      Tablet: { count: 0, completed: 0 }
    };

    filteredSessions.forEach(s => {
      stats[s.deviceType].count++;
      if (s.isCompleted) stats[s.deviceType].completed++;
    });

    return Object.entries(stats).map(([type, data]) => ({
      type,
      count: data.count,
      completed: data.completed,
      rate: data.count > 0 ? Math.round((data.completed / data.count) * 100) : 0
    }));
  }, [filteredSessions]);

  const stats = useMemo(() => {
    const total = filteredSessions.length;
    const completed = filteredSessions.filter(s => s.isCompleted).length;
    const avgTime = filteredSessions.length > 0 
      ? Math.round(filteredSessions.reduce((acc, s) => acc + s.duration, 0) / filteredSessions.length) 
      : 0;

    return {
      total,
      completed,
      conversionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      avgTime
    };
  }, [filteredSessions]);

  return {
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
  };
};
