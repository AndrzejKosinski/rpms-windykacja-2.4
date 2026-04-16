import { IUserService } from '../interfaces/IUserService';
import { callAppsScript } from '../appsScriptClient';

export class AppsScriptUserAdapter implements IUserService {
  async checkUserStatus(email: string): Promise<{ exists: boolean; isActive: boolean }> {
    try {
      // ---------------------------------------------------------------------------
      // WARSTWA IZOLACJI:
      // Obecnie wywołujemy Google Apps Script (Webhook), który odpytuje arkusz LISTA_KLIENTOW.
      // Docelowo: Zmienimy tylko ten fragment na zapytanie SQL (np. Prisma/TypeORM),
      // a reszta aplikacji (np. /api/contact) w ogóle tego nie zauważy.
      // ---------------------------------------------------------------------------
      
      const response = await callAppsScript('CHECK_EMAIL_STATUS', { email });
      console.log(`Raw GAS response for ${email}:`, response);
      
      // Odpowiedź z GAS (auth_v3.gs) zwraca obiekt np. { status: 'STATUS_ACTIVE' | 'STATUS_LEAD' | 'STATUS_NEW' }
      const status = response?.status;
      
      return {
        exists: status === 'STATUS_ACTIVE' || status === 'STATUS_LEAD',
        isActive: status === 'STATUS_ACTIVE'
      };
    } catch (error) {
      console.error('Błąd podczas weryfikacji statusu użytkownika:', error);
      // Fallback: W przypadku błędu (np. brak połączenia z GAS) zakładamy brak aktywnego konta
      return { exists: false, isActive: false };
    }
  }
}
