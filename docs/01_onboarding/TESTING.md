# Procedury Testowe (Test Suite)

Dokument opisuje standardowe scenariusze testowe pozwalające zweryfikować poprawność działania kluczowych funkcji systemu RPMS.

## TEST 1: Rejestracja i Provisioning
1. Otwórz Wizard -> Wybierz "Panel Spraw" -> "Załóż konto".
2. Podaj testowy e-mail: `test@firma.pl` i hasło.
3. **SPRAWDŹ**: Czy w arkuszu `DB_US_Uzytkownicy` pojawił się nowy wiersz.
4. **SPRAWDŹ**: Czy na Twoim Google Drive powstał nowy folder dla tego użytkownika.

## TEST 2: Izolacja Danych (Krytyczny)
1. Zaloguj się na konto `Użytkownik_A`.
2. Dodaj fakturę dla dłużnika "Dłużnik_A".
3. Wyloguj się.
4. Zaloguj się na konto `Użytkownik_B`.
5. **SPRAWDŹ**: Czy Dashboard Użytkownika_B jest pusty (nie powinien widzieć "Dłużnika_A").
6. **SPRAWDŹ**: Czy w arkuszu `DB_FA_Faktury` kolumna `USER_EMAIL` została poprawnie uzupełniona.

## TEST 3: Logowanie Błędne
1. Spróbuj zalogować się używając poprawnego e-maila, ale błędnego hasła.
2. **SPRAWDŹ**: Czy system wyświetla komunikat o błędnych danych i blokuje dostęp.

## TEST 4: Integracja Drive
1. Jako zalogowany użytkownik prześlij plik faktury.
2. **SPRAWDŹ**: Czy plik trafił do **DEDYKOWANEGO** folderu tego użytkownika, a nie do folderu głównego.

## TEST 5: Fallback System
1. Zmień nazwę pliku `content.json` na `content_backup.json` (lub zasymuluj błąd API).
2. Odśwież stronę.
3. **SPRAWDŹ**: Czy aplikacja ładuje domyślny układ sekcji z `FALLBACK_PAGE_LAYOUT`.
