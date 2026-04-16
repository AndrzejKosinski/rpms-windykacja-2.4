import React from 'react';
import { UserCircle, Tag, Timer, Clock, CheckCircle2, AlertCircle, ChevronDown, ArrowRight, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

interface ActivityLogSessionItemProps {
  session: SessionGroup;
  expandedSession: string | null;
  setExpandedSession: (id: string | null) => void;
}

export const ActivityLogSessionItem: React.FC<ActivityLogSessionItemProps> = ({ session, expandedSession, setExpandedSession }) => {
  return (
    <div 
      className={`bg-[#0f172a] rounded-[var(--radius-brand-card)] border transition-all overflow-hidden ${expandedSession === session.sessionId ? 'border-brand-blue ring-1 ring-brand-blue/20' : 'border-slate-800 hover:border-slate-700'}`}
    >
      {/* Header Sesji */}
      <div 
        className="p-8 cursor-pointer flex flex-col lg:flex-row items-start lg:items-center gap-6"
        onClick={() => setExpandedSession(expandedSession === session.sessionId ? null : session.sessionId)}
      >
        <div className="flex items-center gap-4 min-w-[240px]">
          <div className={`p-3 rounded-[var(--radius-brand-button)] ${session.userEmail === 'anonymous' ? 'bg-slate-800 text-slate-500' : 'bg-brand-blue/10 text-brand-blue'}`}>
            <UserCircle size={24} />
          </div>
          <div>
            <h3 className="text-white font-black text-sm truncate max-w-[180px]">{session.userEmail}</h3>
            <p className="text-[10px] text-slate-600 font-mono mt-0.5">{session.sessionId}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 lg:flex-1">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-[var(--radius-brand-button)]">
            <Tag size={14} className="text-brand-blue" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{session.mainAction}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-[var(--radius-brand-button)]">
            <Timer size={14} className="text-amber-500" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{session.duration}s</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-[var(--radius-brand-button)]">
            <Clock size={14} className="text-slate-500" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              {session.startTime.toLocaleTimeString('pl-PL')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session.isCompleted ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-[var(--radius-brand-button)]">
              <CheckCircle2 size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Sukces</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-500 rounded-[var(--radius-brand-button)]">
              <AlertCircle size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Porzucono</span>
            </div>
          )}
          <div className={`transition-transform duration-300 ${expandedSession === session.sessionId ? 'rotate-180' : ''}`}>
            <ChevronDown size={20} className="text-slate-600" />
          </div>
        </div>
      </div>

      {/* Wizualizacja Ścieżki (Miniatura) */}
      {!expandedSession && (
        <div className="px-8 pb-6 flex items-center gap-2 overflow-hidden opacity-40 grayscale hover:grayscale-0 transition-all">
          {session.events.slice(0, 8).map((e, idx) => (
            <React.Fragment key={idx}>
              <div className="px-2 py-1 bg-slate-800 rounded-[var(--radius-brand-button)] text-[8px] font-bold text-slate-400 whitespace-nowrap">
                {e.event_name.replace('onboarding_step_', '').replace('modal_', '')}
              </div>
              {idx < Math.min(session.events.length, 8) - 1 && <ArrowRight size={10} className="text-slate-800 shrink-0" />}
            </React.Fragment>
          ))}
          {session.events.length > 8 && <span className="text-[8px] text-slate-700 font-bold">+{session.events.length - 8}</span>}
        </div>
      )}

      {/* Rozwinięte Szczegóły Sesji */}
      <AnimatePresence>
        {expandedSession === session.sessionId && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-800 bg-slate-900/30"
          >
            <div className="p-8">
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6">Pełna Ścieżka Interakcji</h4>
              <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {session.events.map((event, idx) => {
                  let meta = {};
                  try { meta = JSON.parse(event.metadata); } catch(e) {}
                  
                  return (
                    <div key={idx} className="relative pl-10 group">
                      <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-[#0f172a] z-10 flex items-center justify-center ${event.event_name.includes('success') || event.event_name.includes('submitted') ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-900/50 rounded-[var(--radius-brand-button)] border border-slate-800 group-hover:border-slate-700 transition-all">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-white font-black text-xs uppercase tracking-tight">{event.event_name}</span>
                            <span className="text-[10px] text-slate-600 font-mono">{new Date(event.timestamp).toLocaleTimeString('pl-PL')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <Globe size={10} />
                            {event.url.replace(window.location.origin, '') || '/'}
                          </div>
                        </div>
                        {Object.keys(meta).length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(meta).map(([k, v], i) => (
                              <span key={i} className="px-2 py-1 bg-slate-800 rounded-[var(--radius-brand-input)] text-[9px] font-bold text-slate-400">
                                {k}: <span className="text-brand-blue">{String(v)}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
