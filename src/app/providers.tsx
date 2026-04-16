"use client";

import { ModalProvider } from "../context/ModalContext";
import { AppProvider } from "../context/AppContext";
import { OnboardingProvider } from "../features/onboarding/ui/OnboardingContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <OnboardingProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </OnboardingProvider>
    </AppProvider>
  );
}
