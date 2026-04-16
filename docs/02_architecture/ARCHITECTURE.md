# Architektura Projektu

Dokument opisuje strukturę katalogów oraz model przepływu danych w aplikacji RPMS.

## 1. Struktura Katalogów (`/src`)

Projekt korzysta z Next.js App Router i architektury opartej na modułach (Domain Driven Design):

- **`/app`**: Trasy (routes), layouty i API routes.
  - `(auth)`: Logowanie i autoryzacja.
  - `(marketing)`: Publiczna strona główna, blog, FAQ.
  - `(dashboard)`: Panel administratora (`/panel`).
- **`/views`**: Kompletne widoki stron (np. `AdminDashboard`, `HomeClient`).
- **`/widgets`**: Złożone bloki UI (np. `Sidebar`, `Navbar`, sekcje marketingowe).
- **`/features`**: Logika biznesowa podzielona na domeny (np. `auth`, `debt-recovery`).
- **`/shared`**: Reużywalne elementy:
  - `ui`: Podstawowe komponenty (przyciski, karty).
  - `api`: Klienty do komunikacji zewnętrznej, interfejsy serwisów (Repository Pattern) i adaptery.
  - `utils`: Funkcje pomocnicze.
- **`/services`**: Warstwa integracji (np. `cmsRepository.ts`, `geminiService.ts`).
- **`/context`**: Globalny stan aplikacji (`AppContext.tsx`).
- **`/entities`**: Definicje typów i modeli danych.

## 2. Wzorzec Repozytorium i Separacja Domen (Repository & Adapter Pattern)

Aplikacja została zaprojektowana z myślą o elastyczności i możliwości łatwej wymiany backendu.
Logika komunikacji z danymi została wyabstrahowana do interfejsów w `src/shared/api/interfaces/` (np. `IAuthService`, `IDebtCaseService`).
Konkretne implementacje (adaptery, np. `AppsScriptAuthAdapter`) znajdują się w `src/shared/api/adapters/`.
Całość jest zarządzana przez centralną fabrykę `apiClientFactory.ts`, co pozwala na wstrzykiwanie zależności (Dependency Injection) i ukrywa szczegóły implementacyjne przed komponentami UI.

## 3. Architektura Hybrydowa (Hybrid CMS)

Aplikacja RPMS nie polega wyłącznie na zewnętrznym API. Działa w modelu hybrydowym:

### Przepływ danych na stronie głównej (SSR + ISR):
1. **Serwer (`page.tsx`)**: Wywołuje `fetchContentFromCMS()`.
2. **Repository (`cmsRepository.ts`)**:
   - Próbuje pobrać dane z Google Apps Script (używając klucza API).
   - Jeśli się uda: Zwraca dane z chmury.
   - Jeśli wystąpi błąd (timeout, brak sieci): Zwraca dane z lokalnego pliku `public/content.json`.
3. **Hydracja (`HomeClient`)**: Przekazuje dane do komponentów klienckich.

### Globalna synchronizacja (`AppContext.tsx`):
Po załadowaniu strony w przeglądarce, `AppContext` wykonuje dodatkowe zapytanie do `/api/content`. Jeśli dane w chmurze są nowsze lub inne niż te użyte do SSR, stan aplikacji zostaje zaktualizowany bez odświeżania strony.

## 3. Zalety tego rozwiązania
- **Niezawodność**: Strona działa nawet gdy Google Drive/Apps Script ma awarię.
- **Szybkość**: Pierwszy render (LCP) jest generowany na serwerze z gotowymi danymi.
- **SEO**: Wyszukiwarki widzą pełną treść strony, a nie tylko szkielet ładowania.
