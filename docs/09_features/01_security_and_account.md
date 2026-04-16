# Bezpieczeństwo i Konto

**Data utworzenia:** 2026-03-20

## Zmiana hasła

Moduł umożliwia zalogowanemu użytkownikowi samodzielną i bezpieczną zmianę hasła dostępowego do Panelu Klienta.

### Przepływ danych (Data Flow)

1.  **Interfejs Użytkownika (UI):** Użytkownik wypełnia formularz w komponencie `ChangePasswordForm` (`/src/features/settings/ui/ChangePasswordForm.tsx`).
2.  **Walidacja Frontend (Zod):**
    *   `currentPassword`: Wymagane (min. 1 znak).
    *   `newPassword`: Wymagane, minimum 8 znaków.
    *   `confirmPassword`: Musi być identyczne z `newPassword`.
3.  **Żądanie API:** Formularz wysyła żądanie POST do `/api/auth/change-password` z aktualnym i nowym hasłem.
4.  **Weryfikacja Sesji (Backend):** Endpoint API sprawdza obecność i ważność ciasteczka `cms_session`. Jeśli sesja jest prawidłowa, odszyfrowuje adres e-mail użytkownika.
5.  **Re-autentykacja i Zmiana (Apps Script):** API wywołuje metodę `authService.changePassword` (adapter `AppsScriptAuthAdapter`), przekazując `email`, `currentPassword` oraz `newPassword`.
6.  **Backend Google Apps Script (`main_v4.gs` oraz `auth_v2_2.gs`):**
    *   Router w `main_v4.gs` przechwytuje akcję `CHANGE_PASSWORD` i przekazuje payload do funkcji `changePassword`.
    *   Funkcja `changePassword` (w `auth_v2_2.gs`) odszukuje użytkownika w arkuszu `LISTA_KLIENTOW` i weryfikuje, czy `currentPassword` (po zahashowaniu) zgadza się z obecnym hasłem zapisanym w bazie (re-autentykacja).
    *   Jeśli weryfikacja przebiegnie pomyślnie, skrypt hashuje `newPassword`, nadpisuje komórkę ze starym hasłem i zwraca status `success`. W przypadku niezgodności zwraca błąd `Błędne aktualne hasło`.
7.  **Odpowiedź do UI:** API przekazuje wynik operacji do formularza, który wyświetla odpowiedni komunikat (sukces lub błąd).

### Obsługa błędów

*   **Brak sesji / Nieprawidłowa sesja (401):** Użytkownik nie jest zalogowany lub sesja wygasła.
*   **Nieprawidłowe dane wejściowe (400):** Błędy walidacji Zod po stronie serwera.
*   **Błędne aktualne hasło (400):** Backend Apps Script odrzucił zmianę z powodu niezgodności obecnego hasła.
*   **Wewnętrzny błąd serwera (500):** Problemy z komunikacją z Apps Script lub inne nieoczekiwane błędy.
