import { InitDebtPayload, UpdateDebtPayload } from '../../entities/debtor/api/debtorApi';

export interface FetchDashboardPayload {
  email: string;
}

export interface UpdateStatusPayload {
  caseId: string;
  userEmail: string;
  nextStatus: string;
}

export interface DeleteCasePayload {
  caseId: string;
  userEmail: string;
}

export interface DeleteInvoicePayload {
  caseId: string;
  invoiceId: string;
  userEmail: string;
}

export interface UpdateDebtDataPayload {
  caseId: string;
  userEmail: string;
  payload: UpdateDebtPayload;
}

export interface InitDebtServicePayload {
  userEmail: string;
  payload: InitDebtPayload;
}

export interface BatchInitDebtPayload {
  userEmail: string;
  items: InitDebtPayload[];
  userName?: string;
  password?: string;
  skipEmail?: boolean;
}

export interface DebtCaseResponse {
  status: 'success' | 'error';
  message?: string;
  cases?: Record<string, any>[]; // Could be typed better later
  data?: unknown;
}
