import React, { useEffect } from 'react';
import { WizardStep } from '../../onboarding/ui/types';
import { logCustomEvent } from '../../../utils/customLogger';
import StepEntry from '../../onboarding/ui/StepEntry';
import StepContact from '../../onboarding/ui/StepContact';
import StepSuccess from '../../onboarding/ui/StepSuccess';
import StepPassword from '../../onboarding/ui/StepPassword';
import StepPanelIntro from '../../onboarding/ui/StepPanelIntro';
import StepFileManagement from '../../onboarding/ui/StepFileManagement';
import ValidationReportModal from '../../onboarding/ui/ValidationReportModal';
import { OnboardingProvider, useOnboardingContext } from '../../onboarding/ui/OnboardingContext';
import { WizardHeader } from '../../onboarding/ui/WizardHeader';
import { useFileProcessor } from '../../onboarding/hooks/useFileProcessor';
import { useFileManagement } from '../../onboarding/hooks/useFileManagement';
import { useSubmitCase } from '../../onboarding/hooks/useSubmitCase';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (user: any) => void;
  onSwitchToLogin?: () => void;
  onSwitchToRegister?: (source?: string) => void;
}

const OnboardingWizardInner: React.FC<OnboardingWizardProps> = ({ isOpen, onClose, onComplete, onSwitchToLogin, onSwitchToRegister }) => {
  const {
    step, setStep,
    startTime,
    isSubmitting,
    fileQueue, setFileQueue,
    userStatus, setUserStatus,
    dragActive,
    validationErrors, setValidationErrors,
    isErrorReportOpen, setIsErrorReportOpen,
    data, setData,
    loginError
  } = useOnboardingContext();

  // Faza 2: Inicjalizacja wydzielonych hooków
  useFileProcessor();
  const { fileInputRef, handleFilesAdded, handleRemoveFile, handleEntryFileSelect, handleDrag, handleDrop } = useFileManagement();
  const { handleSubmitCase, handleFinalizeAccount } = useSubmitCase(onComplete);

  // Śledzenie zmiany kroków
  useEffect(() => {
    if (isOpen) {
      logCustomEvent({
        event_name: `onboarding_step_${step}`,
        metadata: {
          time_from_start: Math.round((Date.now() - startTime) / 1000) + 's',
          current_step: step
        }
      });
    }
  }, [step, isOpen, startTime]);

  // Reset step to entry when modal is closed
  useEffect(() => {
    if (isOpen) {
      logCustomEvent({ event_name: 'onboarding_started' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContactBack = () => {
    if (data.isManual) {
      setStep('entry');
    } else if (data.priorityAccount) {
      setStep('panel_intro');
    } else {
      setStep('file_management');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
        <div className="bg-white w-full max-w-5xl h-auto md:h-[760px] max-h-[95vh] rounded-[var(--radius-brand-card)] md:rounded-[var(--radius-brand-card)] shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 border border-slate-200 flex flex-col overflow-hidden">
          
          {/* Faza 3: Wydzielony WizardHeader */}
          <WizardHeader step={step} onClose={onClose} />
          
          <div className={`flex-1 overflow-y-auto flex flex-col min-h-0 no-scrollbar ${step !== 'panel_intro' ? 'px-6 md:px-12 pt-8 md:pt-10 pb-0' : ''}`}>
            {step === 'entry' && <StepEntry onFileSelect={handleEntryFileSelect} onManualSelect={() => { 
              logCustomEvent({ event_name: 'onboarding_choice_made', metadata: { choice: 'manual_entry' } });
              setData({ ...data, isManual: true, priorityAccount: false }); 
              setStep('contact'); 
            }} onPanelSelect={() => { 
              logCustomEvent({ event_name: 'onboarding_choice_made', metadata: { choice: 'client_panel' } });
              setData({ ...data, priorityAccount: true, isManual: false }); 
              setStep('panel_intro'); 
            }} dragActive={dragActive} handleDrag={handleDrag} handleDrop={handleDrop} fileInputRef={fileInputRef} handleFileChange={(e) => handleFilesAdded(e.target.files)} />}
            
            {step === 'panel_intro' && (
              <StepPanelIntro 
                onContinue={() => setStep('contact')} 
                onBack={() => setStep('entry')} 
                onLogin={onSwitchToLogin} 
                onRegister={() => {
                  onClose();
                  onSwitchToRegister?.('onboarding_wizard_step_panel');
                }}
              />
            )}
            
            {step === 'file_management' && <StepFileManagement fileQueue={fileQueue} onRemoveFile={handleRemoveFile} onUpdateFile={(id, updatedData) => setFileQueue(prev => prev.map(it => it.id === id ? { ...it, extractedData: updatedData } : it))} onAddFiles={handleFilesAdded} onContinue={() => setStep('contact')} onBack={() => setStep('entry')} data={data} setData={setData} />}
            
            {step === 'contact' && (
              <StepContact 
                data={data} 
                setData={setData} 
                onBack={handleContactBack} 
                onSubmit={handleSubmitCase} 
                isSubmitting={isSubmitting} 
                isExtracting={fileQueue.some(it => it.status === 'processing')} 
                onSwitchToLogin={onSwitchToLogin} 
                onStatusDetected={setUserStatus}
                externalError={loginError}
              />
            )}
            
            {step === 'thanks' && <StepSuccess onContinue={() => (userStatus === 'AUTHENTICATED' ? onComplete({ email: data.email, name: data.email.split('@')[0], role: 'Konto Aktywne' }) : setStep('set_password'))} userStatus={userStatus} />}
            
            {step === 'set_password' && <StepPassword onSubmit={handleFinalizeAccount} isSubmitting={isSubmitting} />}
          </div>
        </div>
      </div>

      <ValidationReportModal 
        isOpen={isErrorReportOpen} 
        errors={validationErrors} 
        onClose={() => { 
          setValidationErrors([]); 
          setIsErrorReportOpen(false); 
          setFileQueue(prev => prev.filter(item => item.status !== 'error'));
        }} 
      />
    </>
  );
};

const OnboardingWizard: React.FC<OnboardingWizardProps> = (props) => {
  return <OnboardingWizardInner {...props} />;
};

export default OnboardingWizard;
