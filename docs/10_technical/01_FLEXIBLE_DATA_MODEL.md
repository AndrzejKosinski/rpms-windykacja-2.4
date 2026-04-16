# Architektura Danych: Historia Sprawy i Metadane (Flexible Data Model)

**Data dokumentu:** 2026-03-18
**Status:** Zaimplementowano (v10.7.0 - Frontend, API & GAS Migration)

## Opis Koncepcji
W celu zapewnienia maksymalnej elastyczności systemu bez konieczności ciągłej zmiany struktury bazy danych (arkusza Google), wprowadzono model oparty na historii zdarzeń (Events) oraz dynamicznych metadanych. Pozwala to na dodawanie nowych funkcji (np. logowanie kto zmienił status) bez dodawania nowych kolumn w arkuszu.

## 1. Struktura Arkusza Google (DB_SPRAWY)
Każdy silos klienta (arkusz Google Spreadsheet) musi posiadać arkusz o nazwie `DB_SPRAWY` z następującą strukturą kolumn (kolejność krytyczna):

1.  **`CASE_ID`**: Unikalny identyfikator sprawy (np. UUID).
2.  **`DEBTOR_NAME`**: Nazwa dłużnika / firmy.
3.  **`NIP`**: Numer Identyfikacji Podatkowej.
4.  **`KRS`**: Numer KRS (opcjonalnie).
5.  **`TOTAL_AMOUNT`**: Łączna kwota zadłużenia (PLN).
6.  **`STATUS`**: Aktualny etap (np. "Weryfikacja", "Windykacja", "Sąd").
7.  **`START_DATE`**: Data dodania sprawy (format ISO lub Data Google). Mapowana na `createdAt`.
8.  **`HISTORY_JSON`**: Tekstowa kolumna (JSON Array) przechowująca historię zdarzeń.
9.  **`METADATA_JSON`**: Tekstowa kolumna (JSON Object) przechowująca dodatkowe parametry.
10. **`USER_EMAIL`**: Adres e-mail właściciela sprawy (dla filtrowania).

*Uwaga: Kolumny JSON powinny mieć ustawione "Zawijanie tekstu" i szerokość min. 300px dla czytelności w arkuszu.*

## 2. Model Danych w Aplikacji

### CaseEvent (Historia)
Każde istotne zdarzenie w sprawie jest rejestrowane w tablicy `history`.
```typescript
interface CaseEvent {
  type: 'STATUS_CHANGE' | 'FEE_ADDED' | 'PAYMENT' | 'NOTE' | 'SYSTEM';
  date: string;        // ISO Date
  label: string;       // Etykieta wyświetlana (np. "Wysłano wezwanie")
  value?: string;      // Opcjonalna wartość (np. "150.00 PLN")
  description?: string; // Opcjonalny opis szczegółowy
}
```

### Metadata (Parametry)
Pole `metadata` służy do przechowywania dodatkowych atrybutów sprawy:
- `demandFee`: Kwota opłaty za wezwanie (wyświetlana w podsumowaniu).
- `courtFee`: Kwota opłaty sądowej.
- `externalId`: Identyfikator w zewnętrznym systemie kancelarii.
- **`folders` (v10.7.0)**: Obiekt przechowujący identyfikatory folderów Google Drive dla dłużnika:
  - `root`: ID głównego folderu dłużnika (`Nazwa + ID`).
  - `invoices`: ID podfolderu `01_Faktury`.
  - `legal`: ID podfolderu `02_Dokumenty_Prawne`.
  - `correspondence`: ID podfolderu `03_Korespondencja`.

## 3. Logika Backendowa (Google Apps Script)
W systemie GAS wprowadzono funkcje pomocnicze do obsługi tego modelu:
- `logCaseEvent(ssId, caseId, event)`: Bezpiecznie dopisuje zdarzenie do istniejącej tablicy JSON w arkuszu, zapobiegając nadpisaniu danych.
- `updateStatusWithLog(caseId, newStatus)`: Automatycznie zmienia status i dodaje wpis typu `STATUS_CHANGE` do historii.

## 4. Prezentacja w UI (Smart Mapping)
Komponent `CaseCard` oraz `DebtorProfileSidebar` dynamicznie interpretują historię:
1.  **Data Przekazania**: System szuka w historii słowa "dodana" lub "przekazano". Jeśli nie znajdzie, używa pola `START_DATE`.
2.  **Data Wezwania**: Szuka frazy "wezwanie". Jeśli znajdzie, oblicza `daysSinceDemand` (liczba dni od wysłania wezwania do dziś).
3.  **Timeline**: Historia jest wyświetlana w odwróconej kolejności chronologicznej (najnowsze na górze).

## 5. Procedury Utrzymania (Maintenance)
- **Migracja**: W przypadku aktualizacji struktury u starych klientów, należy użyć skryptu `migration_v1.gs`, który dodaje brakujące kolumny JSON i inicjuje je wartościami `[]` oraz `{}`.
- **Inicjalizacja**: Nowe arkusze są tworzone automatycznie przez `initialization_v4.gs`, co gwarantuje poprawną strukturę od pierwszego dnia.

## Pliki Zmodyfikowane
- `src/entities/debtor/model/types.ts`
- `src/entities/debtor/api/debtorApi.ts`
- `src/entities/case/ui/CaseCard.tsx`
- `src/widgets/DebtorProfileSidebar.tsx`
