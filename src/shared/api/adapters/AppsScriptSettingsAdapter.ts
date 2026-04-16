import { ISettingsService } from '../interfaces/ISettingsService';
import { callAppsScript } from '../appsScriptClient';
import { GetCompanyDataPayload, UpdateCompanyDataPayload, SettingsResponse } from '../../types/settings';

export class AppsScriptSettingsAdapter implements ISettingsService {
  async getCompanyData(payload: GetCompanyDataPayload): Promise<SettingsResponse> {
    return callAppsScript('GET_COMPANY_DATA', payload);
  }

  async updateCompanyData(payload: UpdateCompanyDataPayload): Promise<SettingsResponse> {
    return callAppsScript('UPDATE_COMPANY_DATA', payload);
  }
}
