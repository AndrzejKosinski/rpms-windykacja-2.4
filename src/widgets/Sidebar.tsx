import React from 'react';
import { Layout, Users, FileText, Settings, LogOut, ShieldCheck, PieChart, MessageSquare, Bell } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Panel Główny', icon: <Layout size={22} /> },
    { id: 'clients', label: 'Dłużnicy', icon: <Users size={22} /> },
    { id: 'documents', label: 'Dokumenty', icon: <FileText size={22} /> },
    { id: 'analytics', label: 'Analityka', icon: <PieChart size={22} /> },
  ];

  return (
    <aside className="w-80 bg-brand-navy text-white h-full flex flex-col relative overflow-hidden">
      {/* Dekoracyjne tło */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-brand-blue rounded-full blur-3xl"></div>
      </div>

      {/* Logo */}
      <div className="p-10 relative z-10">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center text-white shadow-xl shadow-brand-blue/20 group-hover:scale-110 transition-transform duration-500">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter italic text-white">RPMS<span className="text-brand-blue">.pl</span></h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">System Egzekucyjny</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-10 space-y-2 relative z-10">
        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Menu Operacyjne</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[var(--radius-brand-button)] font-black text-sm uppercase tracking-widest transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-brand-blue'} transition-colors`}>
              {item.icon}
            </span>
            {item.label}
            {activeTab === item.id && (
              <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff]"></div>
            )}
          </button>
        ))}

        <div className="pt-10">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Komunikacja</p>
          <button className="w-full flex items-center gap-4 px-6 py-4 rounded-[var(--radius-brand-button)] font-black text-sm uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-all group">
            <MessageSquare size={22} className="text-slate-500 group-hover:text-brand-blue" />
            Wiadomości
            <span className="ml-auto px-2 py-0.5 bg-brand-blue text-[10px] rounded-full text-white">3</span>
          </button>
          <button className="w-full flex items-center gap-4 px-6 py-4 rounded-[var(--radius-brand-button)] font-black text-sm uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-all group">
            <Bell size={22} className="text-slate-500 group-hover:text-brand-blue" />
            Powiadomienia
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-8 border-t border-white/5 relative z-10">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-[var(--radius-brand-button)] font-black text-sm uppercase tracking-widest transition-all duration-300 group mb-4 ${
            activeTab === 'settings' 
              ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className={`${activeTab === 'settings' ? 'text-white' : 'text-slate-500 group-hover:text-brand-blue'} transition-colors`}>
            <Settings size={22} />
          </span>
          Ustawienia
          {activeTab === 'settings' && (
            <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff]"></div>
          )}
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-[var(--radius-brand-button)] font-black text-sm uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
          Wyloguj się
        </button>

        <div className="mt-8 p-6 bg-white/5 rounded-[var(--radius-brand-card)] border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Systemu</p>
          </div>
          <p className="text-[11px] font-bold text-white/60 leading-relaxed">Wszystkie systemy RPMS działają poprawnie.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
