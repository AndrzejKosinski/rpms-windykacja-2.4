import React from 'react';
import { Search, Bell, MessageSquare, Plus, Zap, User, ChevronDown, ShieldCheck } from 'lucide-react';
import { LoggedInUser } from '../context/AppContext';

interface DashboardHeaderProps {
  user: LoggedInUser | any;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  onInitiateNewCase: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, isChatOpen, setIsChatOpen, onInitiateNewCase }) => {
  return (
    <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Szukaj dłużnika, faktury lub sprawy..." 
          className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-[var(--radius-brand-button)] outline-none focus:border-brand-blue focus:bg-white transition-all font-bold text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`w-12 h-12 rounded-[var(--radius-brand-button)] flex items-center justify-center transition-all relative ${
              isChatOpen ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
          >
            <MessageSquare size={22} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-brand-blue rounded-full border-2 border-white"></span>
          </button>
          <button className="w-12 h-12 bg-slate-50 text-slate-400 rounded-[var(--radius-brand-button)] flex items-center justify-center hover:bg-slate-100 transition-all">
            <Bell size={22} />
          </button>
        </div>

        <div className="h-10 w-px bg-slate-100"></div>

        <button 
          onClick={onInitiateNewCase}
          className="px-8 py-3.5 bg-brand-navy text-white rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-navy/10 hover:bg-brand-blue transition-all flex items-center gap-3 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          Dodaj nową sprawę
        </button>

        <div className="flex items-center gap-4 pl-4 border-l border-slate-100 group cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-black text-brand-navy leading-none mb-1">{user?.name || 'Użytkownik'}</p>
            <div className="flex items-center justify-end gap-1.5">
               <ShieldCheck size={12} className="text-brand-blue" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role === 'ADMIN' ? 'Administrator' : 'Klient Premium'}</p>
            </div>
          </div>
          <div className="w-12 h-12 bg-slate-100 rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-navy border-2 border-white shadow-sm group-hover:border-brand-blue transition-all">
            <User size={24} />
          </div>
          <ChevronDown size={16} className="text-slate-300 group-hover:text-brand-navy transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
