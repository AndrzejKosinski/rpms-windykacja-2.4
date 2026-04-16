import { useState, useCallback, useEffect } from 'react';
import { debtorApi } from '../api/debtorApi';
import { Debtor } from './types';

export const useDebtors = (email: string | undefined) => {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isProcessingAction, setIsProcessingAction] = useState<string | null>(null);

  const fetchDebtors = useCallback(async () => {
    if (!email) {
      setIsInitialLoad(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await debtorApi.fetchDebtors(email);
      setDebtors(data);
    } catch (error) {
      console.error("Błąd pobierania danych:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [email]);

  useEffect(() => {
    fetchDebtors();
  }, [fetchDebtors]);

  const updateStatus = async (caseId: string, nextStatus: string) => {
    if (!email) return;
    setIsProcessingAction(caseId);
    try {
      await debtorApi.updateStatus(caseId, email, nextStatus);
      setTimeout(fetchDebtors, 1500);
    } catch (error) {
      console.error("Błąd statusu:", error);
    } finally {
      setIsProcessingAction(null);
    }
  };

  const deleteCase = async (caseId: string) => {
    if (!email) return false;
    setIsProcessingAction(caseId);
    try {
      const success = await debtorApi.deleteCase(caseId, email);
      if (success) await fetchDebtors();
      return success;
    } finally {
      setIsProcessingAction(null);
    }
  };

  const deleteInvoice = async (caseId: string, invoiceId: string) => {
    if (!email) return false;
    setIsProcessingAction(invoiceId);
    try {
      const success = await debtorApi.deleteInvoice(caseId, invoiceId, email);
      if (success) await fetchDebtors();
      return success;
    } finally {
      setIsProcessingAction(null);
    }
  };

  return {
    debtors,
    isLoading,
    isInitialLoad,
    isProcessingAction,
    fetchDebtors,
    updateStatus,
    deleteCase,
    deleteInvoice,
    setDebtors
  };
};
