# Dynamiczny Design System (DDS)

## 1. Cel i Wizja (Executive Summary)
* **Cel główny:** Zbudowanie scentralizowanego systemu zarządzania wyglądem aplikacji (Dynamic Design System - DDS), opartego na jednym pliku konfiguracyjnym.
* **Korzyści:** 
  * Absolutna spójność wizualna (UI/UX) w całej aplikacji.
  * Możliwość błyskawicznej zmiany typografii, kolorystyki czy zaokrągleń poprzez edycję **jednego pliku konfiguracyjnego**.
  * Łatwa ścieżka ewolucji: od pliku lokalnego -> przez integrację z GAS -> aż po pełną bazę danych w przyszłości.

## 2. Główne Założenia Architektoniczne (Core Assumptions)
* **Plik Konfiguracyjny jako Źródło Prawdy (Single Source of Truth):** Cała konfiguracja wyglądu (Theme Config) będzie przechowywana w dedykowanym pliku (np. `src/shared/config/theme.json` lub `theme.ts`).
* **Architektura oparta na Tokenach (Design Tokens):** Aplikacja będzie czytać plik konfiguracyjny i wstrzykiwać jego wartości jako zmienne CSS (np. `var(--dds-form-label-size)`).
* **Atomizacja Komponentów (Strict UI Components):** Całkowity zakaz bezpośredniego stylowania standardowych tagów HTML (jak `<label>`, `<input>`). Wymóg korzystania wyłącznie z dedykowanych komponentów systemowych (np. `<FormLabel>`, `<FormInput>`), które "pod spodem" korzystają ze zmiennych CSS.
* **Brak narzutu wydajnościowego (Zero-latency SSR):** Ponieważ konfiguracja jest w pliku lokalnym, wstrzykiwanie zmiennych CSS odbywa się natychmiastowo podczas renderowania po stronie serwera (SSR), eliminując efekt FOUC (Flash of Unstyled Content).

## 3. Struktura Pliku Konfiguracyjnego (Przykład `theme.json`)
Początkowa struktura pliku konfiguracyjnego, od której zaczniemy wdrażanie systemu:

```json
{
  "forms": {
    "labels": {
      "fontSize": "11px",
      "fontWeight": "800",
      "textTransform": "none",
      "letterSpacing": "0.025em",
      "color": "#64748b"
    },
    "inputs": {
      "borderRadius": "12px",
      "borderWidth": "1px"
    }
  },
  "buttons": {
    "primary": {
      "borderRadius": "12px",
      "textTransform": "uppercase"
    }
  }
}
```

## 4. Mechanizm Działania (Wstrzykiwanie Tokenów)
1. Plik `layout.tsx` (lub dedykowany `ThemeProvider`) importuje konfigurację z pliku źródłowego.
2. Przekształca strukturę JSON na płaskie zmienne CSS (np. `--dds-forms-labels-fontSize: 11px`).
3. Wstrzykuje te zmienne do tagu `<html>` lub `<body>`.
4. Komponenty bazowe (np. `<FormLabel>`) używają klas Tailwind odwołujących się do tych zmiennych (np. `text-[length:var(--dds-forms-labels-fontSize)]`).

## 5. Plan Wdrożenia (Roadmapa)

* **Faza 1: Fundamenty i Plik Konfiguracyjny**
  * Utworzenie pliku `theme.json` (lub `.ts`).
  * Utworzenie mechanizmu wstrzykującego zmienne CSS na poziomie `layout.tsx`.
  * Utworzenie bazowych komponentów formularzy (`FormLabel`, `FormInput`) w `src/shared/ui/forms/`.
  * Wdrożenie nowych komponentów w procesie windykacyjnym (`AddDebtWizard`, `StepContact`) oraz w modalu prawnika.
* **Faza 2: Globalna Refaktoryzacja**
  * Wymiana starych formularzy na nowe komponenty DDS w całej aplikacji.
* **Faza 3: Integracja Zewnętrzna (Przyszłość)**
  * Możliwość podpięcia skryptu pobierającego konfigurację z Google Apps Script (GAS) podczas budowania aplikacji (build time) lub cyklicznie.
* **Faza 4: Pełna Baza Danych i Panel Admina (Przyszłość)**
  * Przeniesienie konfiguracji do bazy danych (np. Firestore) dla zmian w czasie rzeczywistym.

## 6. Wytyczne dla Programistów (Developer Guidelines)
1. **Nigdy nie używaj** twardo zakodowanych klas takich jak `text-[10px]` czy `uppercase` dla etykiet formularzy.
2. **Zawsze używaj** komponentu `<FormLabel>Twój tekst</FormLabel>`.
3. Aby zmienić wygląd, **edytuj plik konfiguracyjny motywu**, a nie kod komponentu.
