import React, { useState, useEffect } from 'react';
import { ShieldCheck, Menu, X, ArrowRight, User, Lock, ChevronRight, Phone, Mail } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

interface HeaderProps {
  onLogin: () => void;
  onRegister: (source?: string) => void;
  onNavigate?: (view: 'HOME' | 'BLOG' | 'FAQ') => void;
  onGoToPanel?: () => void;
  currentView?: 'HOME' | 'BLOG' | 'FAQ' | 'OTHER';
  isLoggedIn?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogin, onRegister, onNavigate, onGoToPanel, currentView = 'HOME', isLoggedIn = false }) => {
  const { siteContent } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Jak to działa', href: '#process', view: 'HOME' },
    { label: 'Panel Klienta', href: '#panel', view: 'HOME' },
    { label: 'Cennik', href: '#pricing', view: 'HOME' },
    { label: 'Baza Wiedzy', href: '/blog', view: 'BLOG' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setIsMobileMenuOpen(false);
    if (item.view === 'BLOG') {
      if (onNavigate) onNavigate('BLOG');
    } else {
      if (currentView !== 'HOME') {
        if (onNavigate) onNavigate('HOME');
        // Wait for navigation and then scroll
        setTimeout(() => {
          const el = document.querySelector(item.href);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.querySelector(item.href);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4 lg:py-6'}`}>
      {/* Top Bar - Contact Info */}
      {siteContent?.contactBar?.isEnabled !== false && (
        <div className={`hidden lg:block transition-all duration-500 overflow-hidden ${isScrolled ? 'h-0 opacity-0' : 'h-6 opacity-100 mb-2'}`}>
          <div className="max-w-[1440px] mx-auto px-12 flex justify-start gap-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] pl-[76px]">
            {siteContent?.contactBar?.showPhone !== false && (
              <a href={`tel:${(siteContent?.companyInfo?.phone || siteContent?.contactBar?.phone || '+48 61 307 09 91').replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-brand-blue transition-all group">
                <Phone size={12} className="text-brand-blue/60 group-hover:text-brand-blue transition-colors" />
                {siteContent?.companyInfo?.phone || siteContent?.contactBar?.phone || '+48 61 307 09 91'}
              </a>
            )}
            {siteContent?.contactBar?.showEmail !== false && (
              <a href={`mailto:${siteContent?.companyInfo?.email || siteContent?.contactBar?.email || 'kancelaria@rpms.pl'}`} className="flex items-center gap-2 hover:text-brand-blue transition-all group">
                <Mail size={12} className="text-brand-blue/60 group-hover:text-brand-blue transition-colors" />
                {siteContent?.companyInfo?.email || siteContent?.contactBar?.email || 'kancelaria@rpms.pl'}
              </a>
            )}
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className={`relative flex items-center justify-between px-6 py-3 rounded-[var(--radius-brand-card)] transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(10,46,92,0.1)] border border-white/50' : 'bg-transparent'}`}>
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate?.('HOME')}
          >
            <div className={`w-10 h-10 bg-brand-navy rounded-[var(--radius-brand-button)] flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-500`}>
              <ShieldCheck size={24} />
            </div>
            <span className={`text-2xl font-black tracking-tighter italic transition-colors ${isScrolled ? 'text-brand-navy' : 'text-brand-navy'}`}>
              Windykacja <span className="text-brand-blue">RPMS</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`text-[13px] font-black uppercase tracking-[0.15em] transition-all hover:text-brand-blue relative group ${currentView === item.view && item.view === 'BLOG' ? 'text-brand-blue' : 'text-brand-navy'}`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-blue transition-all group-hover:w-full ${currentView === item.view && item.view === 'BLOG' ? 'w-full' : ''}`}></span>
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <button 
                onClick={onGoToPanel}
                className="flex items-center gap-2 px-6 py-3 bg-brand-navy/5 text-brand-navy font-black text-[13px] uppercase tracking-widest hover:bg-brand-navy/10 rounded-[var(--radius-brand-button)] transition-all"
              >
                <User size={18} className="text-brand-blue" /> Twój Panel
              </button>
            ) : (
              <button 
                onClick={onLogin}
                className="flex items-center gap-2 px-6 py-3 text-brand-navy font-black text-[13px] uppercase tracking-widest hover:bg-slate-50 rounded-[var(--radius-brand-button)] transition-all"
              >
                <User size={18} className="text-brand-blue" /> Logowanie
              </button>
            )}
            <button 
              onClick={() => onRegister('header')}
              className="group relative px-8 py-3 bg-brand-navy text-white rounded-[var(--radius-brand-button)] font-black text-[13px] uppercase tracking-widest shadow-xl shadow-brand-navy/20 hover:bg-brand-blue transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Odzyskaj pieniądze <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-brand-navy"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-[90] lg:hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="flex flex-col h-full pt-32 px-10 pb-12">
          <div className="space-y-8 mb-auto">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="flex items-center justify-between w-full text-3xl font-black text-brand-navy uppercase tracking-tighter text-left group"
              >
                {item.label}
                <ChevronRight size={32} className="text-brand-blue opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {isLoggedIn ? (
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onGoToPanel?.();
                }}
                className="w-full py-5 bg-brand-navy text-white font-black rounded-[var(--radius-brand-button)] flex items-center justify-center gap-3"
              >
                <User size={20} className="text-brand-blue" /> Przejdź do panelu
              </button>
            ) : (
              <button 
                onClick={onLogin}
                className="w-full py-5 bg-slate-50 text-brand-navy font-black rounded-[var(--radius-brand-button)] flex items-center justify-center gap-3"
              >
                <Lock size={20} className="text-brand-blue" /> Zaloguj się do panelu
              </button>
            )}
            <button 
              onClick={() => onRegister('mobile_menu')}
              className="w-full py-5 bg-brand-blue text-white font-black rounded-[var(--radius-brand-button)] shadow-2xl shadow-brand-blue/20"
            >
              Rozpocznij windykację
            </button>
          </div>

          {/* Mobile Contact Info */}
          {siteContent?.contactBar?.isEnabled !== false && (
            <div className="mt-12 pt-8 border-t border-slate-100 space-y-6">
              {siteContent?.contactBar?.showPhone !== false && (
                <a href={`tel:${(siteContent?.companyInfo?.phone || siteContent?.contactBar?.phone || '+48 61 307 09 91').replace(/\s/g, '')}`} className="flex items-center gap-4 text-brand-navy group">
                  <div className="w-12 h-12 bg-brand-light-blue rounded-full flex items-center justify-center group-active:scale-90 transition-transform">
                    <Phone size={20} className="text-brand-blue" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zadzwoń do nas</span>
                    <span className="text-lg font-black tracking-tight">{siteContent?.companyInfo?.phone || siteContent?.contactBar?.phone || '+48 61 307 09 91'}</span>
                  </div>
                </a>
              )}
              {siteContent?.contactBar?.showEmail !== false && (
                <a href={`mailto:${siteContent?.companyInfo?.email || siteContent?.contactBar?.email || 'kancelaria@rpms.pl'}`} className="flex items-center gap-4 text-brand-navy group">
                  <div className="w-12 h-12 bg-brand-light-blue rounded-full flex items-center justify-center group-active:scale-90 transition-transform">
                    <Mail size={20} className="text-brand-blue" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Napisz wiadomość</span>
                    <span className="text-lg font-black tracking-tight">{siteContent?.companyInfo?.email || siteContent?.contactBar?.email || 'kancelaria@rpms.pl'}</span>
                  </div>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
