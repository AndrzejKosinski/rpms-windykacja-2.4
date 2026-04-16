"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from '../../widgets/marketing/ui/Header';
import Footer from '../../widgets/marketing/ui/Footer';
import { useModal } from '../../context/ModalContext';
import { useAppContext } from '../../context/AppContext';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { setActiveModal } = useModal();
  const { isLoggedIn } = useAppContext();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  const handleNavigate = (view: 'HOME' | 'BLOG' | 'FAQ') => {
    if (view === 'HOME') router.push('/');
    else if (view === 'BLOG') router.push('/blog');
    else if (view === 'FAQ') router.push('/faq');
  };

  const currentView = pathname === '/blog' ? 'BLOG' : pathname === '/faq' ? 'FAQ' : pathname === '/' ? 'HOME' : 'OTHER';

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onLogin={() => setActiveModal('login')} 
        onRegister={() => setActiveModal('onboarding')} 
        onNavigate={handleNavigate} 
        onGoToPanel={() => router.push('/panel')}
        isLoggedIn={isLoggedIn}
        currentView={currentView as any} 
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
