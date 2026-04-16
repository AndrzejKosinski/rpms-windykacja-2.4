import { analyticsService } from '@/shared/api/apiClientFactory';

/**
 * CUSTOM LOGGER - RPMS INTERNAL ANALYTICS
 * Adaptacja pod Google Apps Script (RPMS_CMS_DATABASE)
 */

export interface LogEventParams {
  event_name: string;
  user_email?: string;
  metadata?: Record<string, any>;
}

// Generowanie prostego session_id dla użytkowników anonimowych
const getSessionId = () => {
  if (typeof window === 'undefined') return 'server';
  let sessionId = sessionStorage.getItem('rpms_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('rpms_session_id', sessionId);
  }
  return sessionId;
};

export const logCustomEvent = async ({ event_name, user_email, metadata }: LogEventParams) => {
  if (typeof window !== 'undefined') {
    const isAnalyticsEnabled = localStorage.getItem('rpms_analytics_enabled');
    if (isAnalyticsEnabled === 'false') {
      console.log(`[CustomLogger] Zablokowano wysyłkę zdarzenia (analityka wyłączona): ${event_name}`);
      return false;
    }
  }

  // Safe stringify to handle potential circular structures in metadata
  const safeStringify = (obj: any) => {
    const cache = new Set();
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          return '[Circular]';
        }
        cache.add(value);
      }
      return value;
    });
  };

  const timestamp = new Date().toISOString();
  const payload = {
    timestamp,
    event_name,
    user_email: user_email || 'anonymous',
    session_id: getSessionId(),
    metadata: safeStringify(metadata || {}),
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
  };

  console.log(`[CustomLogger] Logging event: ${event_name}`, payload);

  try {
    await analyticsService.logEvent(payload);
    return true;
  } catch (error) {
    console.error('[CustomLogger] Failed to log event:', error);
    return false;
  }
};
