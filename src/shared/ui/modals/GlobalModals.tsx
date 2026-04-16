"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '../../../context/ModalContext';
import { useAppContext } from '../../../context/AppContext';
import AuthModals from '../../../features/auth/ui/AuthModals';
import LawyerModal from './LawyerModal';
import ConsultationModal from './ConsultationModal';
import SolutionModal from './SolutionModal';
import WhyUsDetailModal from './WhyUsDetailModal';
import OnboardingWizard from '../../../features/auth/ui/OnboardingWizard';
import TimedCTAPopup from './TimedCTAPopup';
import { logCustomEvent } from '../../../utils/customLogger';

export default function GlobalModals() {
  const router = useRouter();
  const { 
    activeModal, setActiveModal, 
    selectedSolution, setSelectedSolution, 
    selectedWhyUsDetail, setSelectedWhyUsDetail 
  } = useModal();
  
  const { siteContent, handleLoginSuccess, currentUser } = useAppContext();

  const closeModals = () => {
    if (activeModal !== 'none') {
      logCustomEvent({ 
        event_name: 'modal_closed', 
        user_email: currentUser?.email, 
        metadata: { modal_type: activeModal } 
      });
    }
    setActiveModal('none');
    setSelectedSolution(null);
    setSelectedWhyUsDetail(null);
  };

  const openOnboarding = (source: string = 'unknown') => {
    setActiveModal('onboarding');
    logCustomEvent({ 
      event_name: 'modal_open_onboarding', 
      user_email: currentUser?.email,
      metadata: { source }
    });
  };

  const handleLoginSuccessWithClose = (userObj: any) => {
    handleLoginSuccess(userObj);
    closeModals();
    router.push('/panel');
  };

  if (!siteContent) return null;

  return (
    <>
      <AuthModals 
        activeModal={activeModal} 
        onClose={closeModals} 
        onSwitch={(type) => setActiveModal(type)} 
        onLoginSuccess={handleLoginSuccessWithClose}
        authData={siteContent.auth?.demoUser}
      />
      
      <LawyerModal isOpen={activeModal === 'lawyer'} onClose={closeModals} />
      <ConsultationModal isOpen={activeModal === 'consult'} onClose={closeModals} />
      <SolutionModal isOpen={activeModal === 'solution'} onClose={closeModals} solutionId={selectedSolution} onRegister={openOnboarding} />
      <WhyUsDetailModal 
        isOpen={activeModal === 'why-us'} 
        onClose={closeModals} 
        detailId={selectedWhyUsDetail} 
        onRegister={openOnboarding} 
        modals={siteContent.whyUs?.modals || []}
      />
      <OnboardingWizard 
        isOpen={activeModal === 'onboarding'} 
        onClose={closeModals} 
        onComplete={handleLoginSuccessWithClose}
        onSwitchToLogin={() => setActiveModal('login')}
        onSwitchToRegister={() => setActiveModal('register')}
      />
      <TimedCTAPopup onStart={openOnboarding} />
    </>
  );
}
