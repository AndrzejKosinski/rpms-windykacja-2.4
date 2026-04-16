# Dokumentacja Techniczna (v10.7.0)

Ten folder zawiera szczegółowe opisy rozwiązań technicznych zastosowanych w projekcie RPMS, ze szczególnym uwzględnieniem integracji z Google Sheets i elastycznego modelu danych.

## Spis Treści

1.  **[Elastyczny Model Danych (JSON)](./01_FLEXIBLE_DATA_MODEL.md)**
    *   Opis struktury `HISTORY_JSON` i `METADATA_JSON`.
    *   Mapowanie pól w API i interfejsie użytkownika.
    *   Procedury migracji i inicjalizacji.

2.  **[Integracja Google Apps Script (GAS)](./02_GAS_INTEGRATION_GUIDE.md)**
    *   Przewodnik dla dewelopera GAS.
    *   Opis skryptów inicjalizacyjnych i migracyjnych.
    *   Standardy pracy z danymi w arkuszach.

3.  **[Specyfikacja Interfejsów API (IRequest / IResponse)](./03_API_SPECIFICATION_INTERFACES.md)**
    *   Definicja standardu komunikacji z dowolnym backendem.
    *   Struktura zapytań i odpowiedzi.
    *   Zasady mapowania danych w adapterach.

4.  **[System Zarządzania Dokumentami (DMS)](./04_DOCUMENT_MANAGEMENT_SYSTEM.md)**
    *   Hierarchiczna struktura folderów dłużników.
    *   Przechowywanie ID folderów w metadanych.
    *   Logika automatycznego tworzenia drzewa katalogów.

## Kluczowe Pliki w Kodzie
- `src/entities/debtor/api/debtorApi.ts` - Mapowanie danych z arkusza na obiekty JS.
- `src/entities/case/ui/CaseCard.tsx` - Wyświetlanie historii i osi czasu.
- `src/widgets/DebtorProfileSidebar.tsx` - Pełny log zdarzeń dłużnika.
- `src/integration/skrypty_GAS/` - Skrypty Google Apps Script (najnowsze wersje).
