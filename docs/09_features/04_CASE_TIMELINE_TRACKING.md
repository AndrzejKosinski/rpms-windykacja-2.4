# Śledzenie Dat i Osi Czasu Sprawy (Timeline Tracking)

**Data dokumentu:** 2026-03-17
**Status:** Zaimplementowano (Model & UI)

## Opis Funkcjonalności
Wprowadzono system precyzyjnego śledzenia kluczowych dat w cyklu życia sprawy oraz mechanizm obliczania czasu obsługi poszczególnych etapów (np. czas od wysłania wezwania).

## Cel Biznesowy
- **Transparentność:** Klient ma pełny wgląd w to, kiedy podjęto konkretne działania.
- **Monitoring Efektywności:** Możliwość śledzenia, jak długo trwa obsługa wezwania, co pozwala na lepszą ocenę postępów.
- **Gotowość na Integrację:** Struktura danych jest przygotowana na automatyczne aktualizacje z systemów zewnętrznych kancelarii.

## Szczegóły Implementacji

### 1. Rozszerzenie Modelu `Debtor`
Dodano nowe pola opcjonalne (ISO strings):
- `createdAt`: Data utworzenia rekordu przez klienta.
- `transferredAt`: Data przekazania sprawy do windykacji (zmiana statusu z "Nowa sprawa").
- `demandSentAt`: Data wysłania ostatecznego wezwania do zapłaty.

### 2. Prezentacja w UI (`CaseCard`)
- **Nagłówek:** Dodano informację "Dodano: [data]" obok danych dłużnika.
- **Sekcja Rozwinięta (Timeline):** 
    - Wyświetlanie daty przekazania do windykacji.
    - Wyświetlanie daty wysłania wezwania (jeśli dotyczy).
    - **Licznik czasu:** Automatyczne obliczanie i wyświetlanie liczby dni, które upłynęły od wysłania wezwania.

### 3. Bezpieczeństwo i Elastyczność
- Pola dat są traktowane jako dane systemowe (tylko do odczytu w panelu klienta).
- System jest przygotowany na zasilanie tych danych przez zewnętrzną aplikację (Apps Script / API) podczas aktualizacji statusów.

## Pliki Zmodyfikowane
- `src/entities/debtor/model/types.ts`
- `src/entities/case/ui/CaseCard.tsx`
