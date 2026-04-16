"use client";

import React, { useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import Hero from '../../widgets/marketing/ui/Hero';
import WhyUsV2 from '../../widgets/marketing/ui/WhyUsV2';
import ProcessStepsV2 from '../../widgets/marketing/ui/ProcessStepsV2';
import TargetAudienceV2 from '../../widgets/marketing/ui/TargetAudienceV2';
import LegalSupport from '../../widgets/marketing/ui/LegalSupport';
import AiOperations from '../../widgets/marketing/ui/AiOperations';
import DashboardPreview from '../../widgets/marketing/ui/DashboardPreview';
import Comparison from '../../widgets/marketing/ui/Comparison';
import Pricing from '../../widgets/marketing/ui/Pricing';
import LeadForm from '../../widgets/marketing/ui/LeadForm';
import FaqAccordion from '../../widgets/marketing/ui/FaqAccordion';
import FinalCTA from '../../widgets/marketing/ui/FinalCTA';
import { ComponentRegistry } from '../../widgets/marketing/registry';

export default function HomeClient({ initialContent }: { initialContent: any }) {
  const { setActiveModal } = useModal();
  
  if (!initialContent) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center bg-[#020617] text-white rounded-[var(--radius-brand-card)] m-6">
        <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-8"></div>
        <div className="font-black text-xl uppercase tracking-[0.3em] animate-pulse text-center px-6">
          Łączenie z bazą danych <br/><span className="text-brand-blue">RPMS Cloud CMS</span>
        </div>
        <p className="mt-6 text-slate-500 font-bold text-[10px] uppercase tracking-widest max-w-xs text-center leading-relaxed">
          To może potrwać chwilę przy pierwszym uruchomieniu. <br/> Trwa weryfikacja zasobów RPMS_CMS_DATABASE...
        </p>
      </div>
    );
  }

  const isSnapEnabled = initialContent.settings?.enableScrollSnap;

  useEffect(() => {
    if (isSnapEnabled) {
      document.documentElement.classList.add('snap-y', 'snap-proximity', 'scroll-pt-[100px]');
    } else {
      document.documentElement.classList.remove('snap-y', 'snap-proximity', 'scroll-pt-[100px]');
    }

    return () => {
      document.documentElement.classList.remove('snap-y', 'snap-proximity', 'scroll-pt-[100px]');
    };
  }, [isSnapEnabled]);

  const renderSection = (section: any) => {
    const componentKey = section.component || section.id?.toUpperCase();
    const Component = ComponentRegistry[componentKey];
    
    if (section.visible === false || !Component) return null;

    let sectionProps: any = {
      onRegister: () => setActiveModal('onboarding'),
      onOpenLawyer: () => setActiveModal('lawyer')
    };
    
    if (section.id === 'hero' || componentKey?.includes('HERO')) {
      sectionProps = { ...sectionProps, data: initialContent.hero };
    } else if (section.id === 'why_us' || componentKey?.includes('WHY_US')) {
      sectionProps = { ...sectionProps, data: initialContent.whyUs };
    } else if (section.id === 'target_audience' || componentKey?.includes('TARGET_AUDIENCE')) {
      sectionProps = { ...sectionProps, data: initialContent.targetAudience };
    } else if (section.id === 'trust_bar' || componentKey === 'TRUST_BAR' || componentKey === 'TRUST_BAR_v2') {
      sectionProps = { ...sectionProps, data: initialContent.trustBar };
    } else if (section.id === 'pricing' || componentKey?.includes('PRICING')) {
      sectionProps = { ...sectionProps, data: initialContent.pricing };
    } else if (section.component === 'FAQ_ACCORDION' || section.id === 'faq') {
      sectionProps = { ...sectionProps, limit: 5, showLinkToAll: true };
    }

    const content = <Component id={section.id} {...sectionProps} />;

    return isSnapEnabled ? (
      <div key={section.id || componentKey} className="snap-start">
        {content}
      </div>
    ) : (
      <React.Fragment key={section.id || componentKey}>
        {content}
      </React.Fragment>
    );
  };

  return (
    <main>
      {initialContent.pageLayout ? (
        initialContent.pageLayout.map(renderSection)
      ) : (
        <>
          {[
            { id: 'hero', component: 'HERO' },
            { id: 'trust_bar', component: 'TRUST_BAR' },
            { id: 'why_us', component: 'WHY_US_V2' },
            { id: 'process', component: 'PROCESS_STEPS_V2' },
            { id: 'panel', component: 'DASHBOARD_PREVIEW' },
            { id: 'target_audience', component: 'TARGET_AUDIENCE' },
            { id: 'ai_operations', component: 'AI_OPERATIONS' },
            { id: 'legal_support', component: 'LEGAL_SUPPORT' },
            { id: 'comparison', component: 'COMPARISON' },
            { id: 'pricing', component: 'PRICING' },
            { id: 'lead_form', component: 'LEAD_FORM' },
            { id: 'faq', component: 'FAQ_ACCORDION' },
            { id: 'final_cta', component: 'FINAL_CTA' }
          ].map(renderSection)}
        </>
      )}
    </main>
  );
}
