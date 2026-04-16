import { APPS_SCRIPT_URL, APPS_SCRIPT_API_KEY } from '@/config';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

/**
 * Centralny klient do komunikacji z Google Apps Script.
 * Obsługuje autoryzację, nagłówki i ujednolica format żądań.
 * Zawiera mechanizm "Resilience" (Retry) dla błędów sieciowych specyficznych dla GAS.
 */
export async function callAppsScript(action: string, payload: unknown = {}, method: 'GET' | 'POST' = 'POST', customOptions?: RequestInit) {
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      let url = APPS_SCRIPT_URL;
      let options: RequestInit = {
        method,
        cache: 'no-cache',
        ...customOptions,
      };

      if (method === 'POST') {
        options.headers = {
          'Content-Type': 'text/plain',
        };
        options.body = JSON.stringify({
          apiKey: APPS_SCRIPT_API_KEY,
          action,
          payload,
        });
      } else {
        // Dla GET parametry przekazujemy w URL
        const params = new URLSearchParams({
          apiKey: APPS_SCRIPT_API_KEY,
          action,
          ...(payload as Record<string, string>),
        });
        url += (url.includes('?') ? '&' : '?') + params.toString();
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Błąd sieci: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      lastError = error;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Sprawdzamy czy to błąd sieciowy/przekierowania (typowy dla GAS)
      const isRetryable = errorMessage.includes('Failed to fetch') || 
                          errorMessage.includes('NetworkError') ||
                          errorMessage.includes('Błąd sieci: 502') ||
                          errorMessage.includes('Błąd sieci: 503');

      if (isRetryable && attempt < MAX_RETRIES) {
        const backoff = RETRY_DELAY * (attempt + 1);
        console.warn(`[AppsScriptClient] Próba ${attempt + 1}/${MAX_RETRIES} dla akcji ${action}. Błąd: ${errorMessage}. Ponowienie za ${backoff}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoff));
        continue;
      }

      console.error(`[AppsScriptClient] Błąd krytyczny podczas akcji ${action} (${method}):`, error);
      break;
    }
  }

  return {
    status: 'error',
    message: lastError instanceof Error ? lastError.message : 'Nieznany błąd połączenia',
  };
}
