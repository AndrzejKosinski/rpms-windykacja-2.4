import { IDDSService } from '../interfaces/IDDSService';
import { callAppsScript } from '../appsScriptClient';
import { ThemeConfig } from '../../types/theme';

export class AppsScriptDDSAdapter implements IDDSService {
  async getThemeConfig(): Promise<ThemeConfig> {
    const result = await callAppsScript('GET_DDS', {}, 'GET');
    if (result.status === 'error') {
      throw new Error(result.message);
    }
    
    // Handle potential double-wrapping from GAS (e.g., { status: 'success', data: { data: { ... } } })
    const rawData = result.data;
    if (rawData && typeof rawData === 'object' && 'data' in rawData) {
      return rawData.data as ThemeConfig;
    }
    
    return (rawData || {}) as ThemeConfig;
  }

  async updateThemeConfig(config: ThemeConfig): Promise<void> {
    // Send clean config object without extra wrapping
    const result = await callAppsScript('UPDATE_DDS', config);
    if (result.status === 'error') {
      throw new Error(result.message);
    }
  }
}
