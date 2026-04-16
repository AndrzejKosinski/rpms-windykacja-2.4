"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WizardStep, OnboardingData, QueueItem, ValidationError } from './types';

interface OnboardingContextType {
  step: WizardStep;
  setStep: React.Dispatch<React.SetStateAction<WizardStep>>;
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  fileQueue: QueueItem[];
  setFileQueue: React.Dispatch<React.SetStateAction<QueueItem[]>>;
  validationErrors: ValidationError[];
  setValidationErrors: React.Dispatch<React.SetStateAction<ValidationError[]>>;
  isErrorReportOpen: boolean;
  setIsErrorReportOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  userStatus: 'NEW' | 'RETURNING' | 'AUTHENTICATED';
  setUserStatus: React.Dispatch<React.SetStateAction<'NEW' | 'RETURNING' | 'AUTHENTICATED'>>;
  dragActive: boolean;
  setDragActive: React.Dispatch<React.SetStateAction<boolean>>;
  loginError: string | null;
  setLoginError: React.Dispatch<React.SetStateAction<string | null>>;
  startTime: number;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [step, setStep] = useState<WizardStep>('entry');
  const [startTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileQueue, setFileQueue] = useState<QueueItem[]>([]);
  const [userStatus, setUserStatus] = useState<'NEW' | 'RETURNING' | 'AUTHENTICATED'>('NEW');
  const [dragActive, setDragActive] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isErrorReportOpen, setIsErrorReportOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [data, setData] = useState<OnboardingData>({
    files: [],
    email: '',
    phone: '',
    debtorName: '',
    amount: '',
    currency: 'PLN',
    dueDate: '',
    isContested: 'NO',
    isManual: false,
    priorityAccount: false
  });

  return (
    <OnboardingContext.Provider
      value={{
        step,
        setStep,
        data,
        setData,
        fileQueue,
        setFileQueue,
        validationErrors,
        setValidationErrors,
        isErrorReportOpen,
        setIsErrorReportOpen,
        isSubmitting,
        setIsSubmitting,
        userStatus,
        setUserStatus,
        dragActive,
        setDragActive,
        loginError,
        setLoginError,
        startTime
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider');
  }
  return context;
};
