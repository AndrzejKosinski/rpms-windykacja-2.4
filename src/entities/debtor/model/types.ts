import { Invoice } from '../../invoice/model/types';

export interface CaseEvent {
  type: 'STATUS_CHANGE' | 'FEE_ADDED' | 'PAYMENT' | 'NOTE' | 'SYSTEM';
  date: string;
  label: string;
  value?: string;
  description?: string;
}

export interface CaseMetadata {
  folders?: {
    root: string;
    invoices: string;
    legal: string;
    correspondence: string;
  };
  demandFee?: number;
  externalId?: string;
  [key: string]: any;
}

export interface Debtor {
  caseId: string;
  debtorName: string;
  nip: string;
  krs: string;
  address: string;
  correspondenceAddress: string;
  isForeign: boolean;
  email: string;
  phone: string;
  totalAmount: string;
  status: string;
  strategy: string;
  timestamp: string;
  createdAt?: string;
  transferredAt?: string;
  demandSentAt?: string;
  history?: CaseEvent[];
  metadata?: CaseMetadata;
  invoices: Invoice[];
}
