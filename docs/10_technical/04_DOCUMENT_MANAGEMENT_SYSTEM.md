# System Zarządzania Dokumentami (DMS) - Hierarchia Folderów

**Data dokumentu:** 2026-03-18
**Wersja:** 10.7.0
**Status:** Zaimplementowano (Backend GAS v3/v4)

## 1. Koncepcja
W wersji 10.7.0 odeszliśmy od płaskiej struktury plików na rzecz hierarchicznego systemu folderów. Każdy dłużnik w ramach silosu klienta posiada własną przestrzeń dyskową, co ułatwia organizację dokumentów i przyszłe zarządzanie uprawnieniami.

## 2. Struktura Katalogów na Google Drive
Struktura jest tworzona automatycznie podczas inicjalizacji pierwszej sprawy dla danego dłużnika.

```text
RPMS-Windykacja (Root)
└── KLIENCI
    └── [Nazwa Klienta]
        ├── BAZA_WINDYKACYJNA_[Nazwa] (Arkusz)
        └── [Nazwa Dłużnika] ([CaseID])
            ├── 01_Faktury
            ├── 02_Dokumenty_Prawne
            └── 03_Korespondencja
```

## 3. Przechowywanie Danych (Metadane)
Identyfikatory (ID) utworzonych folderów są przechowywane w kolumnie `METADATA_JSON` w arkuszu `DB_SPRAWY`.

**Format zapisu:**
```json
{
  "folders": {
    "root": "ID_FOLDERU_GLOWNEGO",
    "invoices": "ID_FOLDERU_FAKTUR",
    "legal": "ID_FOLDERU_DOKUMENTOW",
    "correspondence": "ID_FOLDERU_KORESPONDENCJI"
  },
  "demandFee": 150.00,
  "externalId": "KANC-2026-001"
}
```

## 4. Logika Backendowa (GAS v10.7.0)
- **`createDebtorFolderStructure`**: Funkcja w `utils_v3.gs` odpowiedzialna za budowę drzewa.
- **`batchInitDebt`**: W `cases_v3.gs` sprawdza, czy dłużnik ma już przypisane foldery. Jeśli nie, tworzy je i aktualizuje metadane.
- **Upload plików**: System automatycznie kieruje pliki do folderu `01_Faktury` dłużnika.

## 5. Korzyści
1. **Porządek:** Dokumenty nie są wymieszane w jednym folderze.
2. **Skalowalność:** Łatwiejsze dodawanie nowych typów dokumentów (np. nagrania rozmów).
3. **Bezpieczeństwo:** Możliwość nadawania uprawnień do folderu konkretnego dłużnika (np. dla zewnętrznego prawnika).

## ⚠️ Zadanie Wstrzymane (Deferred Task)
**Temat:** Implementacja ścisłych interfejsów TypeScript (`IRequest` / `IResponse`) w warstwie API.
*   **Powód wstrzymania:** Oczekiwanie na pełną stabilizację modelu metadanych po wprowadzeniu hierarchii folderów.
*   **Kiedy wrócić:** Po zakończeniu testów integracyjnych nowej struktury katalogów.
