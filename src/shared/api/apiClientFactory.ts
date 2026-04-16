import { IAuthService } from './interfaces/IAuthService';
import { IDebtCaseService } from './interfaces/IDebtCaseService';
import { ICMSService } from './interfaces/ICMSService';
import { IAnalyticsService } from './interfaces/IAnalyticsService';
import { IFileService } from './interfaces/IFileService';
import { ISettingsService } from './interfaces/ISettingsService';
import { IDDSService } from './interfaces/IDDSService';
import { IUserService } from './interfaces/IUserService';

import { AppsScriptAuthAdapter } from './adapters/AppsScriptAuthAdapter';
import { AppsScriptDebtCaseAdapter } from './adapters/AppsScriptDebtCaseAdapter';
import { AppsScriptCMSAdapter } from './adapters/AppsScriptCMSAdapter';
import { SupabaseCMSAdapter } from './adapters/SupabaseCMSAdapter';
import { AppsScriptAnalyticsAdapter } from './adapters/AppsScriptAnalyticsAdapter';
import { AppsScriptFileAdapter } from './adapters/AppsScriptFileAdapter';
import { AppsScriptSettingsAdapter } from './adapters/AppsScriptSettingsAdapter';
import { AppsScriptDDSAdapter } from './adapters/AppsScriptDDSAdapter';
import { SupabaseDDSAdapter } from './adapters/SupabaseDDSAdapter';
import { AppsScriptUserAdapter } from './adapters/AppsScriptUserAdapter';

import { supabase } from './supabaseClient';

// Wewnętrzny rejestr przechowujący aktywne instancje serwisów
const registry = {
  authService: new AppsScriptAuthAdapter() as IAuthService,
  debtCaseService: new AppsScriptDebtCaseAdapter() as IDebtCaseService,
  cmsService: new AppsScriptCMSAdapter() as ICMSService,
  analyticsService: new AppsScriptAnalyticsAdapter() as IAnalyticsService,
  fileService: new AppsScriptFileAdapter() as IFileService,
  settingsService: new AppsScriptSettingsAdapter() as ISettingsService,
  ddsService: new AppsScriptDDSAdapter() as IDDSService,
  userService: new AppsScriptUserAdapter() as IUserService,
};

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

// Funkcja inicjalizująca - pobiera konfigurację z Supabase i podmienia instancje w rejestrze
export async function initializeApiClients() {
  if (isInitialized) return;
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    try {
      // 1. Najpierw wymuszamy ustawienia ze zmiennych środowiskowych (najwyższy priorytet)
      const envCmsStorage = process.env.NEXT_PUBLIC_CMS_STORAGE_TYPE;
      if (envCmsStorage === 'supabase') {
        registry.cmsService = new SupabaseCMSAdapter();
      } else if (envCmsStorage === 'apps-script') {
        registry.cmsService = new AppsScriptCMSAdapter();
      }

      // 2. Następnie pobieramy konfigurację z bazy dla pozostałych modułów (lub CMS, jeśli brak zmiennej)
      const { data, error } = await supabase.from('system_settings').select('*');
      if (error) {
        console.error('Błąd podczas pobierania konfiguracji system_settings:', error);
        return;
      }

      if (data && data.length > 0) {
        data.forEach(config => {
          const { module_id, storage_type } = config;
          
          switch (module_id) {
            case 'cms':
              // Nadpisujemy tylko jeśli zmienna środowiskowa nie jest ustawiona
              if (!envCmsStorage) {
                registry.cmsService = storage_type === 'supabase' ? new SupabaseCMSAdapter() : new AppsScriptCMSAdapter();
              }
              break;
            case 'dds':
              registry.ddsService = storage_type === 'supabase' ? new SupabaseDDSAdapter() : new AppsScriptDDSAdapter();
              break;
            // Tutaj można dodać kolejne przypadki dla innych modułów, gdy powstaną ich adaptery Supabase
            // np. case 'auth': ...
          }
        });
        console.log('Zainicjalizowano serwisy API na podstawie konfiguracji z bazy i zmiennych środowiskowych.');
      }
      isInitialized = true;
    } catch (err) {
      console.error('Nieoczekiwany błąd podczas inicjalizacji serwisów API:', err);
    } finally {
      initializationPromise = null;
    }
  })();

  return initializationPromise;
}

// Funkcja pomocnicza do tworzenia proxy
function createServiceProxy<T extends object>(serviceKey: keyof typeof registry): T {
  return new Proxy({} as T, {
    get(target, prop) {
      const instance = registry[serviceKey];
      const value = (instance as unknown as Record<string | symbol, unknown>)[prop];
      if (typeof value === 'function') {
        return async (...args: unknown[]) => {
          if (!isInitialized) {
            await initializeApiClients();
          }
          const currentInstance = registry[serviceKey];
          return (currentInstance as unknown as Record<string | symbol, (...args: unknown[]) => unknown>)[prop](...args);
        };
      }
      return value;
    }
  });
}

// Eksportujemy Proxy, aby reszta aplikacji nie musiała zmieniać importów
export const authService = createServiceProxy<IAuthService>('authService');
export const debtCaseService = createServiceProxy<IDebtCaseService>('debtCaseService');
export const cmsService = createServiceProxy<ICMSService>('cmsService');
export const analyticsService = createServiceProxy<IAnalyticsService>('analyticsService');
export const fileService = createServiceProxy<IFileService>('fileService');
export const settingsService = createServiceProxy<ISettingsService>('settingsService');
export const ddsService = createServiceProxy<IDDSService>('ddsService');
export const userService = createServiceProxy<IUserService>('userService');

