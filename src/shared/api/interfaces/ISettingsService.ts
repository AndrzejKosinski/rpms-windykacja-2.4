import { GetCompanyDataPayload, UpdateCompanyDataPayload, SettingsResponse } from '../../types/settings';

export interface ISettingsService {
  getCompanyData(payload: GetCompanyDataPayload): Promise<SettingsResponse>;
  updateCompanyData(payload: UpdateCompanyDataPayload): Promise<SettingsResponse>;
}
