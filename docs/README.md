# RPMS Project Documentation

**Wersja:** 1.0.0  
**Data aktualizacji:** 18 Marca 2026 r.

## Cel Biznesowy
Projekt RPMS to nowoczesna platforma internetowa (wraz z panelem administracyjnym) zbudowana w architekturze hybrydowej. Głównym celem jest zapewnienie wysokiej wydajności, doskonałego SEO oraz niezawodności dzięki zastosowaniu mechanizmów "twardego fallbacku" w przypadku awarii zewnętrznego systemu CMS (opartego obecnie na Google Apps Script).

## Szybki Start (Quick Start)

### Wymagania systemowe
- Node.js (wersja 18.x lub nowsza)
- Menedżer pakietów: `npm` (lub `yarn` / `pnpm`)

### Instalacja
1. Sklonuj repozytorium.
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Skonfiguruj zmienne środowiskowe (skopiuj `.env.example` do `.env` i uzupełnij dane).
4. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```
5. Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

## Mapa Dokumentacji
Dokumentacja została podzielona na 5 głównych faz, aby ułatwić wdrożenie nowym programistom:

1. **[Onboarding i Fundamenty](./01_onboarding/README.md)**
   - [Instalacja i Konfiguracja](./01_onboarding/SETUP.md)
   - [Proces pracy i Workflow](./01_onboarding/WORKFLOW.md)
2. **[Architektura i Technologia](./02_architecture/README.md)**
   - [Struktura projektu](./02_architecture/ARCHITECTURE.md)
   - [Stack Technologiczny](./02_architecture/TECH_STACK.md)
   - [System Fallback](./02_architecture/FALLBACK_SYSTEM.md)
3. **[Bezpieczeństwo](./03_security/README.md)**
   - [Strategia Bezpieczeństwa](./03_security/SECURITY.md)
   - [Autoryzacja i Panel](./03_security/AUTHENTICATION.md)
   - [Walidacja i API](./03_security/VALIDATION.md)
4. **[SEO i Wydajność](./04_seo_performance/README.md)**
   - [Strategia SEO](./04_seo_performance/METADATA.md)
   - [Optymalizacja Obrazów](./04_seo_performance/IMAGES.md)
   - [Core Web Vitals](./04_seo_performance/WEB_VITALS.md)
5. **[Rozwój i Backend](./05_development_backend/README.md)**
   - [Plan Migracji](./05_development_backend/BACKEND_MIGRATION.md)
   - [Strategia Skalowania](./05_development_backend/SCALING_STRATEGY.md)
   - [Rozbudowa Panelu](./05_development_backend/EXTENDING_PANEL.md)
6. **[Detale Techniczne (v10.7.0)](./10_technical/README.md)**
   - [Elastyczny Model Danych (JSON)](./10_technical/01_FLEXIBLE_DATA_MODEL.md)
   - [Integracja Google Apps Script (GAS)](./10_technical/02_GAS_INTEGRATION_GUIDE.md)
7. **[Dokumentacja Integracji GAS (v10.7.0)](../src/integration/skrypty_doc/)**
   - [Konfiguracja Arkuszy (Baza Danych)](../src/integration/skrypty_doc/sheets_setup.md)
   - [Instrukcja Wdrożenia](../src/integration/skrypty_doc/deployment_guide.md)
   - [Struktura Google Drive](../src/integration/skrypty_doc/drive_structure.md)

## 8. Dokumentacja CMS (Refaktoryzacja)
Szczegółowa dokumentacja nowej, modułowej architektury panelu administracyjnego:
- **[Architektura CMS](./cms/ARCHITECTURE.md)**: Podział na komponenty i przepływ danych.
- **[Integracje API](./cms/API_INTEGRATION.md)**: Szczegóły techniczne Unsplash i Gemini AI.
- **[Utrzymanie i Bezpieczeństwo](./cms/MAINTENANCE.md)**: Limity Firestore i dobre praktyki.
