# Plan Migracji Backendowej

Obecna architektura oparta na Google Apps Script (GAS) jest idealna dla fazy MVP, ale posiada ograniczenia wydajnościowe i funkcjonalne.

## 1. Dlaczego migracja?
- **Limity GAS**: Ograniczenia czasu wykonywania skryptów i liczby zapytań na dzień.
- **Baza danych**: Brak relacyjności i trudności w zarządzaniu dużymi zbiorami danych w arkuszach.
- **Brak WebSockets**: Niemożność implementacji powiadomień w czasie rzeczywistym.
- **Cold Start**: GAS może mieć opóźnienia przy pierwszym zapytaniu.

## 2. Docelowy Stos Technologiczny
- **Runtime**: Node.js (Express lub NestJS).
- **Baza Danych**: PostgreSQL (np. na Supabase lub Neon).
- **ORM**: Prisma lub Drizzle (dla bezpieczeństwa typów).
- **Auth**: NextAuth.js lub Clerk (zamiast własnego JWT).

## 3. Etapy Migracji

### Etap 1: Warstwa Abstrakcji (ZAKOŃCZONY)
Wprowadzono wzorzec Repozytorium (Repository Pattern) i Adapterów w kodzie Next.js (`src/shared/api/`). Utworzono interfejsy dla poszczególnych domen (Auth, DebtCase, CMS, Analytics, File) oraz adaptery dla Google Apps Script. Pozwala to na przełączanie źródła danych za pomocą fabryki klientów (`apiClientFactory.ts`) bez modyfikacji komponentów UI. Zobacz `/docs/08_refactoring/01_REPOSITORY_PATTERN.md` po więcej szczegółów.

### Etap 2: Replikacja Danych
Stworzenie skryptu migrującego dane z Arkuszy Google do tabel PostgreSQL. Wydzielenie osobnych baz danych lub schematów dla poszczególnych domen (np. osobna baza dla analityki, osobna dla kont użytkowników).

### Etap 3: Nowe API
Implementacja endpointów w Node.js, które implementują te same interfejsy (np. `IAuthService`), aby uniknąć zmian w komponentach UI. Utworzenie nowych adapterów (np. `RestAuthAdapter`).

### Etap 4: Przełączenie
Zmiana konfiguracji w `apiClientFactory.ts` (np. na podstawie zmiennych środowiskowych) na nowe adaptery i monitoring błędów.

## 4. Korzyści
- Pełna kontrola nad bazą danych (backupy, transakcje).
- Możliwość implementacji zaawansowanego wyszukiwania (np. Meilisearch).
- Szybsze czasy odpowiedzi (<100ms).
