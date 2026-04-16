/**
 * CENTRALNA KONFIGURACJA SYSTEMU RPMS
 * Tutaj znajdują się wszystkie kluczowe parametry integracji.
 */

// Pobiera link bezpiecznie ze zmiennych (AI Studio / Vercel secrets)
export const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_CMS_BACKEND_URL  || 'https://script.google.com/macros/s/AKfycbxuAa5cV7IEm-l4068VxI-V8aNrXcHP-9NLelZZeFS2cHxMQMUnEyothl1EQ1fzNajg/exec';

// Klucz API do autoryzacji z Apps Script
export const APPS_SCRIPT_API_KEY = process.env.NEXT_PUBLIC_APPS_SCRIPT_API_KEY || 'TWOJ_TAJNY_KLUCZ_Z_AI_STUDIO';

// Konfiguracja Cache i Timeoutów (opcjonalnie)
export const API_TIMEOUT = 15000;
export const MAX_FILE_SIZE_MB = 25;


// Flaga (opcjonalna) blokująca iframy z nieznanych źródeł
export const ALLOW_IFRAME_AUTH = process.env.ALLOW_IFRAME_AUTH === 'true';
