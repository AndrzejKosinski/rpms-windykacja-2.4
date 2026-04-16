export interface CompanyData {
  nip: string;
  companyName: string;
  address: string;
  iban: string;
  billingEmail: string;
}

export interface GetCompanyDataPayload {
  email: string;
}

export interface UpdateCompanyDataPayload {
  email: string;
  data: CompanyData;
}

export interface SettingsResponse {
  status: 'success' | 'error';
  message?: string;
  data?: CompanyData;
}
