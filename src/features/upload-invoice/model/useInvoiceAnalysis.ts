import { useState } from 'react';
import { invoiceApi } from '../api/invoiceApi';
import { ExtractedDebtData } from '../../../entities/invoice/model/types';
import { PendingFile } from '../../../shared/types';
import { debtorApi } from '../../../entities/debtor/api/debtorApi';
import { buildFullAddress } from '../../../shared/utils/address';

export const useInvoiceAnalysis = (email: string | undefined, onRefresh: () => void) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedDebtData | null>(null);
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);

  const analyzeInvoice = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
      });
      const base64 = await base64Promise;
      setPendingFile({ data: base64, type: file.type, name: file.name });

      const data = await invoiceApi.analyzeInvoice(base64, file.type);
      if (!data) {
        alert("Dokument nie został rozpoznany jako faktura VAT.");
        return false;
      }

      setExtractedData(data);
      return true;
    } catch (error) {
      console.error("Analysis hook error:", error);
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const finalizeDebt = async () => {
    if (!email || !extractedData) return false;
    setIsSyncing(true);
    try {
      const finalAddress = buildFullAddress(extractedData.street, extractedData.zipCode, extractedData.city);
      const finalCorrAddress = buildFullAddress(extractedData.corrStreet, extractedData.corrZipCode, extractedData.corrCity);

      const payload = {
        ...extractedData,
        address: finalAddress || extractedData.address,
        correspondenceAddress: finalCorrAddress,
        fileData: pendingFile?.data || null,
        fileType: pendingFile?.type || null,
        fileName: pendingFile?.name || null
      };

      const success = await debtorApi.initDebt(email, payload);
      if (success) onRefresh();
      return success;
    } finally {
      setIsSyncing(false);
    }
  };

  const updateDebtData = async (caseId: string, updatedData: ExtractedDebtData, editType?: string, invoiceId?: string) => {
    if (!email) return false;
    setIsSyncing(true);
    try {
      const combinedAddress = buildFullAddress(updatedData.street, updatedData.zipCode, updatedData.city);
      const combinedCorrAddress = buildFullAddress(updatedData.corrStreet, updatedData.corrZipCode, updatedData.corrCity);

      const payload = {
        invoiceId,
        editType,
        ...updatedData,
        address: combinedAddress,
        correspondenceAddress: combinedCorrAddress
      };

      const success = await debtorApi.updateDebtData(caseId, email, payload);
      if (success) setTimeout(onRefresh, 1000);
      return success;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isAnalyzing,
    isSyncing,
    extractedData,
    setExtractedData,
    analyzeInvoice,
    finalizeDebt,
    updateDebtData
  };
};
