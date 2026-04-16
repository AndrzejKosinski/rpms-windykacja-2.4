# Integracja z Google Apps Script (GAS)

Katalog ten zawiera skrypty backendowe uruchamiane w środowisku Google Apps Script, które stanowią silnik bazodanowy i logikę biznesową dla aplikacji RPMS Windykacja.

## Struktura katalogów

*   **`skrypty_GAS/`** - Aktualne, produkcyjne wersje skryptów `.gs`. To stąd należy kopiować kod do edytora Google Apps Script.
*   **`old_version/`** - Archiwum poprzednich wersji skryptów. Służy do zachowania historii zmian i możliwości szybkiego wycofania (rollback) w razie problemów.
*   **`skrypty_doc/`** - Dokumentacja techniczna, schematy działania i opisy poszczególnych modułów GAS.

## Zasady aktualizacji
1. Przed modyfikacją istniejącego skryptu (np. `main_v4.gs`), przenieś jego obecną wersję do folderu `old_version/`.
2. Utwórz nową wersję w `skrypty_GAS/` z podbitym numerem (np. `main_v5.gs`).
3. Zaktualizuj ten plik `README.md` lub odpowiednią dokumentację w `skrypty_doc/`, jeśli wprowadzasz nowe akcje (np. w `doPost`).

## Najnowsze zmiany (v11.0.0 - Expansion: Company Settings)
* **Nowe akcje API**: Dodano `GET_COMPANY_DATA` oraz `UPDATE_COMPANY_DATA` w `main_v5.gs`.
* **Rozszerzenie bazy**: Arkusz `LISTA_KLIENTOW` zyskał kolumnę `COMPANY_SETTINGS_JSON` (Kolumna J), przechowującą dane firmy (NIP, Nazwa, Adres, IBAN, Email rozliczeniowy).
* **Nowe moduły**:
  * `settings_v1.gs` - Logika odczytu/zapisu ustawień.
  * `migration_v2.gs` - Skrypt do bezpiecznej aktualizacji istniejących baz danych.
* **Dokumentacja**: Zaktualizowano `skrypty_doc/sheets_setup.md` oraz `skrypty_doc/deployment_guide.md`.
