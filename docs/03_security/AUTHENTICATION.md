# Autoryzacja i Panel Administratora

Dokument opisuje system ochrony dostępu do panelu zarządzania treścią.

## 1. Dostęp do `/panel`
Panel administratora jest chroniony przez warstwę Middleware oraz system sesji oparty na JWT (JSON Web Tokens).

### Proces logowania:
1. Użytkownik podaje email i hasło.
2. Serwer weryfikuje dane:
   - Dla administratora (`admin@admin.pl`) sprawdza `CMS_ADMIN_PASSWORD`.
   - Dla innych użytkowników wywołuje akcję `LOGIN_USER` w Google Apps Script.
3. Po sukcesie, serwer generuje token JWT.
4. Token jest zapisywany w ciasteczku HTTP-Only o nazwie `cms_session`.

## 2. Middleware (`middleware.ts`)
Middleware sprawdza każde zapytanie do ścieżek zaczynających się od `/panel`.

- **Brak sesji**: Przekierowanie na stronę główną `/`.
- **Poprawna sesja**: Zezwolenie na dostęp do panelu.

## 3. Bezpieczeństwo Sesji
- **Rate Limiting**: System blokuje IP po 5 nieudanych próbach logowania na 15 minut.
- **HTTP-Only & Secure**: Ciasteczko jest chronione przed dostępem z JS i przesyłane tylko po HTTPS.
- **SameSite**: Dynamicznie ustawiane na `None` (jeśli `ALLOW_IFRAME_AUTH=true`) lub `Strict` (produkcja).
- **Inactivity Timeout**: Aplikacja automatycznie wylogowuje użytkownika po 15 minutach bezczynności (obsługiwane w `AppContext.tsx`).

## 5. Autoryzacja 2.0 (Aktywacja i Reset Hasła)

System wprowadza mechanizm "Soft Activation" oraz bezpieczny reset hasła, oparty na nowych strukturach w Google Sheets (v10.7.0).

### Zmiany w Bazie Danych (RPMS_MASTER_INDEX):
- **Nowa kolumna `EmailVerified`**: Dodana w arkuszu `LISTA_KLIENTOW`. Przechowuje status weryfikacji adresu e-mail (`TRUE`/`FALSE`).
- **Nowy arkusz `AuthTokens`**: Przechowuje tymczasowe tokeny bezpieczeństwa (UUID) z określonym czasem wygaśnięcia (`ExpiresAt`) oraz typem operacji (`ACTIVATION`, `RESET`).

### Nowe Akcje Backendowe (`main_v3.gs`):
- `ACTIVATE_ACCOUNT`: Weryfikuje token i zmienia status `EmailVerified` na `TRUE`.
- `REQUEST_PASSWORD_RESET`: Generuje token resetu hasła i wysyła e-mail.
- `RESET_PASSWORD`: Weryfikuje token i aktualizuje hasło (SHA-256) w arkuszu.
- `RESEND_ACTIVATION_EMAIL`: Ponownie generuje i wysyła token aktywacyjny.

### Miękka Aktywacja (Soft Activation):
- Po rejestracji użytkownik ma dostęp do panelu, ale flaga `emailVerified` jest ustawiona na `false`.
- Banner informacyjny (`VerificationBanner`) wyświetla się do czasu aktywacji.
- Krytyczne akcje (np. zlecanie windykacji) są blokowane w UI i na backendzie.
- Aktywacja odbywa się poprzez unikalny token przesłany w e-mailu.

### Reset Hasła:
- Użytkownik może poprosić o reset hasła podając e-mail.
- System generuje token z ograniczonym czasem ważności (np. 1 godzina).
- Zmiana hasła wymaga podania poprawnego tokenu.
- Hasła są haszowane algorytmem SHA-256 przed zapisem w bazie (Google Sheets).
