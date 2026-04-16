import { IDebtCaseService } from '../interfaces/IDebtCaseService';
import { callAppsScript } from '../appsScriptClient';
import { 
  FetchDashboardPayload, 
  UpdateStatusPayload, 
  DeleteCasePayload, 
  DeleteInvoicePayload, 
  UpdateDebtDataPayload, 
  InitDebtServicePayload, 
  BatchInitDebtPayload,
  DebtCaseResponse
} from '../../types/debtCase';

export class AppsScriptDebtCaseAdapter implements IDebtCaseService {
  async fetchDashboard(payload: FetchDashboardPayload): Promise<DebtCaseResponse> {
    return callAppsScript('FETCH_DASHBOARD', payload, 'GET');
  }

  async updateStatus(payload: UpdateStatusPayload): Promise<DebtCaseResponse> {
    return callAppsScript('UPDATE_STATUS', payload);
  }

  async deleteCase(payload: DeleteCasePayload): Promise<DebtCaseResponse> {
    return callAppsScript('DELETE_CASE', payload);
  }

  async deleteInvoice(payload: DeleteInvoicePayload): Promise<DebtCaseResponse> {
    return callAppsScript('DELETE_INVOICE', payload);
  }

  async updateDebtData(payload: UpdateDebtDataPayload): Promise<DebtCaseResponse> {
    return callAppsScript('UPDATE_DEBT_DATA', payload);
  }

  async initDebt(payload: InitDebtServicePayload): Promise<DebtCaseResponse> {
    return callAppsScript('INIT_DEBT', payload);
  }

  async batchInitDebt(payload: BatchInitDebtPayload): Promise<DebtCaseResponse> {
    return callAppsScript('BATCH_INIT_DEBT', payload);
  }
}
