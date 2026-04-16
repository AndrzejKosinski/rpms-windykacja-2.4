# Przewodnik Integracji: Google Apps Script (GAS)

**Data dokumentu:** 2026-03-18
**Wersja:** 10.7.0

## Wstęp
System RPMS wykorzystuje Google Sheets jako bazę danych (silosy klientów). Integracja odbywa się za pomocą skryptów Google Apps Script, które pełnią rolę API.

## 1. Konfiguracja Środowiska
Aby wdrożyć skrypty w nowym środowisku Google:
1. Otwórz [script.google.com](https://script.google.com).
2. Utwórz nowy projekt.
3. Skopiuj pliki z folderu `src/integration/skrypty_GAS/` do edytora online.
4. Ustaw zmienną `API_KEY` w `SYSTEM_CONFIG`, aby zabezpieczyć dostęp.

## 2. Kluczowe Skrypty

### Inicjalizacja (`initialization_v4.gs`)
Ten skrypt jest odpowiedzialny za tworzenie nowych arkuszy dla klientów.
- Tworzy folder klienta w Google Drive.
- Tworzy arkusz `BAZA_WINDYKACYJNA_[NAZWA]`.
- Inicjuje nagłówki w arkuszu `DB_SPRAWY`.
- **Nowość (v10.7.0):** Przygotowany pod obsługę hierarchii folderów dłużników.

### Zarządzanie Sprawami (`cases_v3.gs`)
Główny moduł logiki biznesowej.
- **Nowość (v10.7.0):** Funkcja `batchInitDebt` automatycznie tworzy strukturę folderów dla każdego dłużnika i zapisuje ich ID w metadanych sprawy.
- **Logika Hierarchii (DMS):** Przy inicjalizacji sprawy, system wywołuje `createDebtorFolderStructure(parentFolderId, debtorName)`, która:
  1. Tworzy folder główny dłużnika o nazwie `[Nazwa Dłużnika] (CASE-[ID])`.
  2. Tworzy 3 podfoldery tematyczne: `01_Faktury`, `02_Dokumenty_Prawne`, `03_Korespondencja`.
  3. Zwraca obiekt z identyfikatorami wszystkich utworzonych folderów, który jest następnie zapisywany w kolumnie `METADATA_JSON`.
- **Obsługa UPLOAD_FILE:** Skrypt odczytuje ID docelowego podfolderu z metadanych sprawy (np. `metadata.folders.invoices`) zamiast używać jednego wspólnego folderu klienta.

### Zarządzanie Ustawieniami (`settings_v1.gs` / `main_v4.gs`)
Nowe akcje dodane do obsługi danych firmowych klienta:
- **`GET_COMPANY_DATA`**: Pobiera dane firmy (NIP, Nazwa, Adres, IBAN, Email do faktur) z arkusza `LISTA_KLIENTOW` na podstawie adresu e-mail użytkownika.
- **`UPDATE_COMPANY_DATA`**: Aktualizuje dane firmy w arkuszu `LISTA_KLIENTOW`. Wymaga podania obiektu `data` zawierającego zaktualizowane informacje.

### Narzędzia (`utils_v3.gs`)
- Zawiera funkcję `createDebtorFolderStructure`, która buduje drzewo katalogów (Faktury, Dokumenty Prawne, Korespondencja).

### Migracja (`migration_v1.gs`)
Używany do aktualizacji struktury u **obecnych** klientów bez utraty danych.
- **Działanie:** Przechodzi przez wszystkich klientów z `MASTER_INDEX` i dodaje kolumny `HISTORY_JSON` oraz `METADATA_JSON`.

## 3. Standardy Pracy z JSON w Arkuszach
Ponieważ Google Sheets nie wspiera natywnie typu JSON, dane są przechowywane jako ciągi znaków (String).

**Zasady edycji ręcznej:**
- Zawsze używaj poprawnych cudzysłowów `"`.
- Historia musi być tablicą: `[...]`.
- Metadane muszą być obiektem: `{...}`.
- Jeśli komórka jest pusta, system może zgłosić błąd (dlatego skrypt migracyjny ustawia domyślnie `[]` lub `{}`).

## 4. Debugowanie
Wszystkie błędy są logowane w konsoli Google Apps Script (Execution Log). 
- Jeśli frontend nie wyświetla historii, sprawdź czy w arkuszu klienta kolumna `HISTORY_JSON` zawiera poprawny format JSON.
- Upewnij się, że `START_DATE` jest rozpoznawana jako data przez Google Sheets.

## 5. Bezpieczeństwo
- Nigdy nie udostępniaj arkuszy klientów publicznie (tylko "Ograniczony dostęp").
- Skrypt GAS powinien być opublikowany jako "Web App" z dostępem "Anyone" (zabezpieczenie odbywa się wewnątrz kodu za pomocą `API_KEY`).
