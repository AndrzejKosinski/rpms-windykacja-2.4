import { APPS_SCRIPT_URL } from '../../../config';

export { APPS_SCRIPT_URL };

export type WizardStep = 'entry' | 'panel_intro' | 'file_management' | 'contact' | 'thanks' | 'set_password';

export interface ValidationError {
  fileName: string;
  reason: string;
}

export interface QueueItem {
  id: string; // fingerprint
  file: File;
  status: 'queued' | 'processing' | 'completed' | 'error' | 'duplicate';
  extractedData?: any;
  error?: string;
  isDuplicate?: boolean;
}

export interface OnboardingData {
  files: File[];
  email: string;
  phone: string;
  password?: string;
  debtorName: string;
  amount: string;
  currency: 'PLN' | 'EUR';
  dueDate: string;
  isContested: 'YES' | 'NO';
  isManual: boolean;
  priorityAccount: boolean;
}
