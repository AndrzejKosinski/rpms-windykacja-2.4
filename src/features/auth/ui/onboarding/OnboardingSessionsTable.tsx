import React from 'react';
import { Users, ChevronRight } from 'lucide-react';
import { Session } from '../../hooks/useOnboardingLogic';

interface OnboardingSessionsTableProps {
  filteredSessions: Session[];
}

export const OnboardingSessionsTable: React.FC<OnboardingSessionsTableProps> = ({ filteredSessions }) => {
  return (
    <div className="bg-[#0f172a] rounded-[var(--radius-brand-card)] border border-slate-800 overflow-hidden shadow-2xl">
      <div className="p-10 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-xl font-black text-white flex items-center gap-3">
          <Users className="text-brand-blue" /> Ostatnie Podróże Użytkowników
        </h3>
        <div className="px-4 py-2 bg-slate-900 rounded-[var(--radius-brand-button)] border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Pokazano: {filteredSessions.length} sesji
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50">
              <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">Użytkownik / Sesja</th>
              <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">Wybór</th>
              <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">Ścieżka (Kroki)</th>
              <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-widest">Czas</th>
              <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.map((session, i) => (
              <tr key={i} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                <td className="p-8">
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">{session.user}</span>
                    <span className="text-[10px] text-slate-600 font-mono mt-1">{session.id}</span>
                  </div>
                </td>
                <td className="p-8">
                  <span className="px-3 py-1 bg-slate-900 text-slate-400 rounded-[var(--radius-brand-input)] text-[10px] font-black uppercase tracking-widest">
                    {session.choice}
                  </span>
                </td>
                <td className="p-8">
                  <div className="flex items-center gap-2">
                    {session.steps.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <span className="text-[10px] font-black text-slate-400 uppercase">{step}</span>
                        {idx < session.steps.length - 1 && <ChevronRight size={12} className="text-slate-700" />}
                      </React.Fragment>
                    ))}
                  </div>
                </td>
                <td className="p-8">
                  <span className="text-slate-400 font-bold text-sm">{session.duration}s</span>
                </td>
                <td className="p-8 text-right">
                  {session.isCompleted ? (
                    <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-[var(--radius-brand-button)] text-[10px] font-black uppercase tracking-widest">Ukończono</span>
                  ) : (
                    <span className="px-4 py-2 bg-red-500/10 text-red-500 rounded-[var(--radius-brand-button)] text-[10px] font-black uppercase tracking-widest">Porzucono</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
