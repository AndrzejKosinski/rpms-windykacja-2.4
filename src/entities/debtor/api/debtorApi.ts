import { debtCaseService, fileService } from '@/shared/api/apiClientFactory';
import { Debtor } from '../model/types';

export interface InitDebtPayload {
  debtorName: string;
  nip: string;
  krs?: string;
  address: string;
  amount: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  description?: string;
  items?: InitDebtPayload[]; // Detailed items if batch
  [key: string]: unknown;
}

export interface UpdateDebtPayload {
  debtorName?: string;
  nip?: string;
  krs?: string;
  address?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
}

export const debtorApi = {
  fetchDebtors: async (email: string): Promise<Debtor[]> => {
    const result = await debtCaseService.fetchDashboard({ email });
    if (result.status === 'success' && result.cases) {
      return result.cases.map((c) => ({
        ...c,
        // Map START_DATE from Sheets to createdAt if it exists
        createdAt: c.createdAt || c.START_DATE || c.timestamp,
        // Ensure history and metadata are objects/arrays if they come as strings
        history: typeof c.history === 'string' ? JSON.parse(c.history) : (c.history || []),
        metadata: typeof c.metadata === 'string' ? JSON.parse(c.metadata) : (c.metadata || {})
      })) as Debtor[];
    }
    return [];
  },

  updateStatus: async (caseId: string, email: string, nextStatus: string) => {
    return await debtCaseService.updateStatus({ 
      caseId, 
      userEmail: email, 
      nextStatus: nextStatus 
    });
  },

  deleteCase: async (caseId: string, email: string) => {
    const result = await debtCaseService.deleteCase({ caseId, userEmail: email });
    return result.status === 'success';
  },

  deleteInvoice: async (caseId: string, invoiceId: string, email: string) => {
    const result = await debtCaseService.deleteInvoice({ caseId, invoiceId, userEmail: email });
    return result.status === 'success';
  },

  updateDebtData: async (caseId: string, email: string, payload: UpdateDebtPayload) => {
    const result = await debtCaseService.updateDebtData({ 
      caseId, 
      userEmail: email, 
      payload
    });
    return result.status === 'success';
  },

  initDebt: async (email: string, payload: InitDebtPayload) => {
    const result = await debtCaseService.initDebt({
      payload,
      userEmail: email
    });
    return result.status === 'success';
  },

  uploadFile: async (email: string, caseId: string, fileData: string, fileName: string, fileType: string, subfolderType: 'invoices' | 'legal' | 'correspondence' = 'invoices') => {
    const result = await fileService.uploadFile({
      email: email,
      caseId,
      fileData,
      fileName,
      fileType,
      subfolderType
    });
    return result;
  }
};
