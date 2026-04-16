import { IAnalyticsService } from '../interfaces/IAnalyticsService';
import { callAppsScript } from '../appsScriptClient';
import { LogEventPayload } from '../../types/analytics';

export class AppsScriptAnalyticsAdapter implements IAnalyticsService {
  async logEvent(payload: LogEventPayload): Promise<void> {
    return callAppsScript('LOG_EVENT', payload);
  }

  async getLogs(): Promise<{ logs: LogEventPayload[] }> {
    return callAppsScript('GET_LOGS', {}, 'GET');
  }
}
