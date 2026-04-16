import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, RefreshCw, Clock, User, Tag, Globe, Info, 
  ChevronRight, ChevronDown, MousePointer2, Timer, 
  CheckCircle2, AlertCircle, ArrowRight, UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyticsService } from '@/shared/api/apiClientFactory';
import { ActivityLogSessionItem } from './ActivityLogSessionItem';

interface LogEntry {
  timestamp: string;
  event_name: string;
  user_email: string;
  session_id: string;
  metadata: string;
  url: string;
  user_agent: string;
}

interface SessionGroup {
  sessionId: string;
  userEmail: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  events: LogEntry[];
  isCompleted: boolean;
  mainAction: string;
}

const ActivityLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await analyticsService.getLogs();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Grupowanie logów w sesje (Podróże Użytkownika)
  const sessions = useMemo(() => {
    const grouped: Record<string, LogEntry[]> = {};
    logs.forEach(log => {
      if (!grouped[log.session_id]) grouped[log.session_id] = [];
      grouped[log.session_id].push(log);
    });

    return Object.entries(grouped).map(([id, events]) => {
      const sorted = [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const start = new Date(sorted[0].timestamp);
      const end = new Date(sorted[sorted.length - 1].timestamp);
      
      const isCompleted = sorted.some(e => 
        e.event_name === 'lead_form_submitted' || 
        e.event_name === 'onboarding_step_thanks' ||
        e.event_name === 'user_login_success'
      );

      // Wykrywanie głównej akcji JTBD
      let mainAction = "Przeglądanie";
      if (sorted.some(e => e.event_name.includes('onboarding'))) mainAction = "Onboarding";
      if (sorted.some(e => e.event_name.includes('lead_form'))) mainAction = "Formularz Lead";
      if (sorted.some(e => e.event_name.includes('login'))) mainAction = "Logowanie";

      return {
        sessionId: id,
        userEmail: sorted[0].user_email,
        startTime: start,
        endTime: end,
        duration: Math.round((end.getTime() - start.getTime()) / 1000),
        events: sorted,
        isCompleted,
        mainAction
      } as SessionGroup;
    }).sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }, [logs]);

  const filteredSessions = sessions.filter(s => {
    const matchesSearch = 
      s.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.mainAction.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'anonymous') return matchesSearch && s.userEmail === 'anonymous';
    if (filter === 'registered') return matchesSearch && s.userEmail !== 'anonymous';
    if (filter === 'completed') return matchesSearch && s.isCompleted;
    return matchesSearch;
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 italic tracking-tight">Podróże <span className="text-brand-blue">Użytkowników</span></h1>
          <p className="text-slate-400 font-medium">Analiza sesji, ścieżek JTBD i czasu realizacji zadań w czasie rzeczywistym.</p>
        </div>
        <button 
          onClick={fetchLogs}
          disabled={isLoading}
          className="px-6 py-4 bg-slate-800 text-white rounded-[var(--radius-brand-button)] font-black flex items-center gap-2 hover:bg-slate-700 transition-all border border-slate-700"
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} /> Odśwież Dane
        </button>
      </div>

      {/* Filtry */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="relative md:col-span-2">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text"
            placeholder="Szukaj po e-mailu, sesji lub typie akcji..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-4 bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-button)] text-white font-medium focus:ring-2 focus:ring-brand-blue outline-none transition-all"
          />
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-6 py-4 bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-button)] text-white font-bold outline-none focus:ring-2 focus:ring-brand-blue transition-all"
        >
          <option value="all">Wszystkie sesje</option>
          <option value="anonymous">Tylko anonimowi</option>
          <option value="registered">Tylko zarejestrowani</option>
          <option value="completed">Tylko ukończone (Sukces)</option>
        </select>
        <div className="bg-slate-900/50 rounded-[var(--radius-brand-button)] border border-slate-800 flex items-center justify-center px-4">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Znaleziono: {filteredSessions.length} sesji</span>
        </div>
      </div>

      {/* Lista Sesji */}
      <div className="space-y-6">
        {isLoading && logs.length === 0 ? (
          <div className="p-20 text-center bg-[#0f172a] rounded-[var(--radius-brand-card)] border border-slate-800">
            <RefreshCw size={48} className="animate-spin text-brand-blue mx-auto mb-4 opacity-20" />
            <p className="text-slate-500 font-bold">Przetwarzanie strumienia danych...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-20 text-center bg-[#0f172a] rounded-[var(--radius-brand-card)] border border-slate-800">
            <Info size={48} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">Nie znaleziono sesji spełniających kryteria.</p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <ActivityLogSessionItem 
              key={session.sessionId}
              session={session}
              expandedSession={expandedSession}
              setExpandedSession={setExpandedSession}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLogViewer;
