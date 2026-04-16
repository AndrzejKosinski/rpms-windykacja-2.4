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

export interface IDebtCaseService {
  fetchDashboard(payload: FetchDashboardPayload): Promise<DebtCaseResponse>;
  updateStatus(payload: UpdateStatusPayload): Promise<DebtCaseResponse>;
  deleteCase(payload: DeleteCasePayload): Promise<DebtCaseResponse>;
  deleteInvoice(payload: DeleteInvoicePayload): Promise<DebtCaseResponse>;
  updateDebtData(payload: UpdateDebtDataPayload): Promise<DebtCaseResponse>;
  initDebt(payload: InitDebtServicePayload): Promise<DebtCaseResponse>;
  batchInitDebt(payload: BatchInitDebtPayload): Promise<DebtCaseResponse>;
}
