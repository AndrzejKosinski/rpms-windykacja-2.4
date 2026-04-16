"use client";

import React from 'react';
import Blog from '../../../widgets/marketing/ui/Blog';
import { useModal } from '../../../context/ModalContext';
import { useAppContext } from '../../../context/AppContext';
import { logCustomEvent } from '../../../utils/customLogger';

export default function BlogClient({ initialContent }: { initialContent: any }) {
  const { setActiveModal } = useModal();
  const { currentUser } = useAppContext();
  
  // Używamy initialContent (odchudzonej listy) zamiast globalnego siteContent,
  // aby uniknąć pobierania i renderowania całego ciężkiego obiektu z treściami postów.
  const content = initialContent;

  const openOnboarding = (source: string = 'unknown') => {
    setActiveModal('onboarding');
    logCustomEvent({ 
      event_name: 'modal_open_onboarding', 
      user_email: currentUser?.email,
      metadata: { source }
    });
  };

  if (!content) return (
    <div className="h-[80vh] flex flex-col items-center justify-center bg-[#020617] text-white rounded-[var(--radius-brand-card)] m-6">
      <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-8"></div>
      <div className="font-black text-xl uppercase tracking-[0.3em] animate-pulse text-center px-6">
        Łączenie z bazą danych <br/><span className="text-brand-blue">RPMS Cloud CMS</span>
      </div>
    </div>
  );

  return (
    <Blog 
      posts={content.blog} 
      onRegister={openOnboarding}
    />
  );
}
