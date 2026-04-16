import { logCustomEvent } from './customLogger';

export enum ErrorContext {
  API = 'API',
  UI = 'UI',
  AUTH = 'AUTH',
  CMS = 'CMS',
  AI = 'AI',
  UNSPLASH = 'UNSPLASH'
}

export enum ErrorSeverity {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export interface ErrorLogParams {
  message: string;
  context: ErrorContext;
  severity?: ErrorSeverity;
  error?: any;
  metadata?: Record<string, any>;
  userEmail?: string;
}

/**
 * Centralny system logowania błędów.
 * Umożliwia ujednolicone raportowanie problemów zarówno w konsoli, jak i w analityce.
 */
export const logError = async ({
  message,
  context,
  severity = ErrorSeverity.ERROR,
  error,
  metadata = {},
  userEmail
}: ErrorLogParams) => {
  const timestamp = new Date().toISOString();
  
  // 1. Logowanie do konsoli z odpowiednim formatowaniem
  const prefix = `[${severity}][${context}]`;
  
  if (severity === ErrorSeverity.INFO) {
    console.info(`${prefix} ${message}`, metadata);
  } else if (severity === ErrorSeverity.WARN) {
    console.warn(`${prefix} ${message}`, { error, ...metadata });
  } else {
    console.error(`${prefix} ${message}`, { 
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error, 
      ...metadata 
    });
  }

  // 2. Wysyłka do wewnętrznej analityki (dla błędów i ostrzeżeń)
  if (severity !== ErrorSeverity.INFO) {
    try {
      await logCustomEvent({
        event_name: `system_error`,
        user_email: userEmail,
        metadata: {
          error_message: message,
          error_context: context,
          severity,
          original_error: error instanceof Error ? error.message : String(error),
          ...metadata
        }
      });
    } catch (e) {
      // Cichy błąd, aby nie zapętlić logowania
      console.warn('[ErrorLogger] Failed to send error to analytics', e);
    }
  }
};
