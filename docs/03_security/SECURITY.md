# Strategia Bezpieczeństwa

Dokument opisuje podejście do bezpieczeństwa w projekcie RPMS.

## 1. Model Zagrożeń
Zidentyfikowaliśmy kluczowe obszary wymagające ochrony:
- **Panel Administracyjny**: Nieautoryzowany dostęp do edycji treści.
- **API Routes**: Próby wstrzykiwania złośliwego kodu lub przeciążenia serwera.
- **Klucze API**: Wyciek kluczy do Google Apps Script lub Gemini.

## 2. Mechanizmy Obronne

### Ochrona przed XSS (Cross-Site Scripting)
- Next.js automatycznie escapuje dane w JSX.
- Używamy biblioteki `dompurify` (po stronie serwera) w przypadku renderowania treści HTML pochodzących z CMS (jeśli dotyczy).

### Ochrona przed CSRF (Cross-Site Request Forgery)
- API Routes korzystają z ciasteczek `SameSite: Lax` lub `Strict`.
- Krytyczne operacje w panelu administratora wymagają ważnego tokena sesji.

### Nagłówki Bezpieczeństwa (Security Headers)
W pliku `next.config.js` skonfigurowane są nagłówki:
- `X-Frame-Options: SAMEORIGIN` (pozwala na wyświetlanie w iframe z tej samej domeny).
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: origin-when-cross-origin`.
- `Strict-Transport-Security`: Wymuszanie HTTPS przez 2 lata.
- `X-XSS-Protection`: Włączona blokada XSS w przeglądarce.

## 3. Zarządzanie Sekretami
- Wszystkie klucze API (`GEMINI_API_KEY`, `APPS_SCRIPT_API_KEY`) są przechowywane wyłącznie w zmiennych środowiskowych na serwerze.
- **UWAGA**: W obecnym modelu hybrydowym (Apps Script) hasła są przechowywane w arkuszu Google. Dostęp do arkusza musi być ściśle ograniczony. Docelowo planowana jest migracja na Firebase Auth (hashing haseł).

## 4. Zasady Izolacji i Prywatności
- **Izolacja Danych**: Skrypt Apps Script musi zawsze sprawdzać `USER_EMAIL` przed zwróceniem jakichkolwiek danych. Nigdy nie używamy funkcji "pobierz wszystko" bez filtrowania po użytkowniku.
- **Prywatność na Drive**: Foldery użytkowników nie są publicznie udostępnione. Uprawnienia są nadawane tylko właścicielowi przez skrypt.
- **Zgody**: Użytkownik musi zaakceptować regulamin informujący o przechowywaniu danych w infrastrukturze Google Cloud.
