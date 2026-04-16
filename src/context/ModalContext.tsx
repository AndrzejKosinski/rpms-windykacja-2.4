"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ModalType = 'none' | 'login' | 'register' | 'lawyer' | 'consult' | 'solution' | 'onboarding' | 'why-us' | 'forgot-password';

interface ModalContextType {
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  selectedSolution: string | null;
  setSelectedSolution: (solution: string | null) => void;
  selectedWhyUsDetail: string | null;
  setSelectedWhyUsDetail: (detail: string | null) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const [selectedWhyUsDetail, setSelectedWhyUsDetail] = useState<string | null>(null);

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        setActiveModal,
        selectedSolution,
        setSelectedSolution,
        selectedWhyUsDetail,
        setSelectedWhyUsDetail,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
