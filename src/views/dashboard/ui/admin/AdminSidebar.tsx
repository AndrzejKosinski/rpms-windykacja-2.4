import React from 'react';
import { ShieldAlert, LogOut } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

interface AdminSidebarProps {
  activeTab: string;
  menuGroups: MenuGroup[];
  blogCount: number;
  onMenuClick: (id: string) => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  menuGroups,
  blogCount,
  onMenuClick,
  onLogout
}) => {
  return (
    <aside className="w-72 bg-[#0f172a] border-r border-slate-800 flex flex-col shrink-0 animate-in slide-in-from-left duration-500 z-30">
      <div className="p-8 flex items-center gap-3 border-b border-slate-800/50">
        <div className="w-10 h-10 bg-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center shadow-lg shadow-brand-blue/20">
          <ShieldAlert size={24} className="text-white" />
        </div>
        <span className="text-xl font-black tracking-tighter text-white">Admin <span className="text-brand-blue">Center</span></span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            <h3 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              {group.label}
            </h3>
            {group.items.map((item) => {
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onMenuClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-[var(--radius-brand-button)] transition-all font-bold text-sm ${
                    isActive 
                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                  </div>
                  {item.id === 'blog-list' && (
                    <span className={`ml-auto py-0.5 px-2 rounded-[var(--radius-brand-input)] text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {blogCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-4 text-slate-500 hover:text-red-400 font-bold text-sm transition-colors">
          <LogOut size={20} /> Wyloguj Admina
        </button>
      </div>
    </aside>
  );
};
