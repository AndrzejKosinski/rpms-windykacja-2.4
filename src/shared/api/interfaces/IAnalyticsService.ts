import { LogEventPayload } from '../../types/analytics';

export interface IAnalyticsService {
  logEvent(payload: LogEventPayload): Promise<void>;
  getLogs(): Promise<{ logs: LogEventPayload[] }>;
}
