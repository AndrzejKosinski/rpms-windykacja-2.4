# Refaktoryzacja: Wdrożenie Wzorca Repozytorium i Separacja Domen

## Cel Refaktoryzacji
Głównym celem refaktoryzacji było architektoniczne uniezależnienie aplikacji od tymczasowego rozwiązania opartego na Google Apps Script. Aplikacja została przygotowana na płynne wdrożenie docelowej stacji serwerowej (np. REST API, GraphQL, dedykowana baza danych SQL/NoSQL) poprzez zastosowanie wzorców projektowych: **Repository Pattern** oraz **Adapter Pattern**.

## Co Zostało Zrobione

1. **Separacja Domen (Domain Driven Design)**
   Zidentyfikowano i wydzielono kluczowe domeny biznesowe aplikacji, co pozwala na niezależny rozwój i skalowanie każdej z nich.
   - **Auth Domain:** Zarządzanie użytkownikami, logowanie, rejestracja.
   - **Debt Case Domain:** Zarządzanie sprawami windykacyjnymi, fakturami, statusami.
   - **CMS Domain:** Zarządzanie treścią stron (Landing Page, FAQ, itp.).
   - **Analytics Domain:** Śledzenie zdarzeń, logi aktywności, analityka.
   - **File Domain:** Obsługa plików (pobieranie, upload).

2. **Wdrożenie Interfejsów (Contracts)**
   Dla każdej domeny utworzono ścisłe kontrakty w postaci interfejsów TypeScript w katalogu `src/shared/api/interfaces/`:
   - `IAuthService.ts`
   - `IDebtCaseService.ts`
   - `ICMSService.ts`
   - `IAnalyticsService.ts`
   - `IFileService.ts`

3. **Implementacja Adapterów (Adapter Pattern)**
   Utworzono adaptery implementujące powyższe interfejsy, które obecnie komunikują się z Google Apps Script. Pliki znajdują się w `src/shared/api/adapters/`:
   - `AppsScriptAuthAdapter.ts`
   - `AppsScriptDebtCaseAdapter.ts`
   - `AppsScriptCMSAdapter.ts`
   - `AppsScriptAnalyticsAdapter.ts`
   - `AppsScriptFileAdapter.ts`

4. **Centralna Fabryka Klientów API (Factory Pattern)**
   Utworzono plik `src/shared/api/apiClientFactory.ts`, który jest jedynym miejscem eksportującym instancje serwisów. Dzięki temu reszta aplikacji nie wie, jakiego adaptera używa pod spodem.

5. **Refaktoryzacja Kodu Aplikacji**
   Zastąpiono wszystkie bezpośrednie wywołania `callAppsScript` w komponentach, hookach i usługach wywołaniami metod z odpowiednich serwisów (np. `authService.loginUser()` zamiast `callAppsScript('LOGIN_USER')`).

## Co Można Zrobić Dalej (Future Steps)

1. **Wdrożenie Nowych Adapterów dla Docelowego Backendu**
   Gdy docelowe środowisko serwerowe (np. Node.js + PostgreSQL) będzie gotowe, wystarczy utworzyć nowe adaptery (np. `PostgresAuthAdapter`, `RestDebtCaseAdapter`) implementujące te same interfejsy.

2. **Przełączanie Środowisk (Environment Variables)**
   W pliku `apiClientFactory.ts` można dodać logikę przełączającą adaptery na podstawie zmiennych środowiskowych (np. `USE_MOCK_API`, `USE_REST_API`), co umożliwi łatwe testowanie i migrację.

3. **Rozdzielenie Baz Danych (Microservices/Multiple Databases)**
   Dzięki separacji domen, każda domena może korzystać z innej bazy danych. Na przykład:
   - **Auth:** Baza zoptymalizowana pod bezpieczeństwo i szybki odczyt (np. Redis/PostgreSQL).
   - **Debt Cases:** Relacyjna baza danych (np. PostgreSQL) dla zachowania spójności transakcji i relacji między sprawami a fakturami.
   - **Analytics:** Baza analityczna (np. ClickHouse, BigQuery) dla logów i zdarzeń.
   - **Files:** Storage obiektowy (np. AWS S3, Google Cloud Storage).

4. **Archiwizacja i Retencja Danych**
   Wydzielenie domen ułatwia wdrożenie polityk retencji danych. Stare sprawy windykacyjne mogą być przenoszone do bazy archiwalnej bez wpływu na działanie modułu analitycznego czy CMS.

5. **Dodanie Testów Jednostkowych**
   Interfejsy umożliwiają łatwe tworzenie "Mock Adapters" do testowania komponentów UI bez konieczności łączenia się z prawdziwym backendem.
