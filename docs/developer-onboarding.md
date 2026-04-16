# Raport Technologiczny / Developer Onboarding

**Projekt:** RPMS Windykacja - Modern Debt Recovery  
**Data wygenerowania:** 2026-03-18  
**Przeznaczenie:** Wprowadzenie (onboarding) dla nowych inżynierów oprogramowania (Software Engineers).

---

## 1. Wstęp i Charakterystyka Projektu
Aplikacja "RPMS Windykacja" to nowoczesna platforma do odzyskiwania należności, łącząca automatyzację procesów z profesjonalnym wsparciem prawnym. Projekt działa w modelu **BFF (Backend for Frontend)**, gdzie aplikacja frontendowa serwuje interfejs użytkownika i warstwę pośredniczącą (API Routes), a głównym źródłem danych (bazą/CMS) jest zewnętrzny system oparty na **Google Apps Script (GAS)**.

⚠️ **Ważne - Prototypowy Backend (GAS):** Obecne wykorzystanie Google Apps Script jako backendu ma charakter prototypowy (Proof of Concept / MVP). Cała główna logika biznesowa backendu (np. zarządzanie sprawami, weryfikacja użytkowników, zapis danych) znajduje się obecnie w skryptach GAS. Architektura aplikacji frontendowej została jednak zaprojektowana z myślą o otwartości i gotowości do łatwej migracji na docelowe, skalowalne rozwiązanie bazodanowe/backendowe (np. Node.js + PostgreSQL, Supabase, itp.) w przyszłości.

## 2. Stos Technologiczny (Tech Stack)
Projekt opiera się na nowoczesnym, lekkim ekosystemie JavaScript/TypeScript:
* **Framework:** Next.js 15+ (App Router)
* **Biblioteka UI:** React 18
* **Język:** TypeScript (ścisłe typowanie)
* **Stylistyka:** Tailwind CSS v4 (konfiguracja przez PostCSS)
* **Ikony:** `lucide-react`
* **Animacje:** `motion` (Framer Motion)
* **Wykresy:** `recharts`
* **Markdown:** `react-markdown`, `remark-gfm`, `remark-breaks`

## 3. Architektura Kodu
Projekt stosuje zaawansowaną architekturę modularną inspirowaną **Feature-Sliced Design (FSD)**. Kod znajduje się w katalogu `src/`:
* `app/` - Routing Next.js (App Router), layouty, strony, API Routes (`/api`).
* `entities/` - Logika biznesowa i modele danych dla konkretnych bytów (np. sprawy, użytkownicy).
* `features/` - Funkcjonalności użytkownika (np. formularze logowania, czat AI).
* `widgets/` - Złożone bloki UI składające się z wielu komponentów (np. Header, Sidebar).
* `shared/` - Współdzielone komponenty UI, typy, narzędzia (utils) i konfiguracja API.
* `services/` & `integration/` - Logika komunikacji z zewnętrznymi usługami.
* `config.ts` - Centralny plik konfiguracyjny (adresy URL, klucze API).

## 4. Zależności (Dependencies) - Co jest, a czego nie ma?
* **Brak klasycznej bazy danych w projekcie:** Nie używamy Prisma, Drizzle, PostgreSQL ani MongoDB. Cały stan i dane są trzymane w Google Apps Script (podejście prototypowe).
* **Brak zewnętrznych dostawców Auth (np. NextAuth/Auth.js, Firebase):** Autoryzacja jest w pełni autorska (Custom JWT).
* **AI:** Wykorzystujemy oficjalne SDK `@google/genai` do integracji z modelami Gemini.
* **Walidacja:** Używamy `zod` do walidacji danych wejściowych (np. przy logowaniu).

## 5. Bezpieczeństwo i Autoryzacja
Aplikacja posiada wbudowane mechanizmy bezpieczeństwa:
* **Custom Auth (JWT):** Logowanie opiera się na bibliotece `jose`. Tokeny sesyjne (`cms_session`) są szyfrowane i przechowywane w ciasteczkach `httpOnly` oraz `secure`.
* **Middleware (`src/middleware.ts`):** Chroni ścieżki panelu klienta (`/panel/*`). W przypadku braku sesji, użytkownik jest przekierowywany na stronę główną.
* **Rate Limiting:** Własny mechanizm w pamięci (In-memory Rate Limiter) w endpointach logowania (`/api/auth/login`), chroniący przed atakami Brute-Force (blokada na 15 minut po 5 nieudanych próbach).
* **Komunikacja z Backendem:** Zabezpieczona kluczem API (`APPS_SCRIPT_API_KEY`), który jest przekazywany w nagłówkach do Google Apps Script.

## 6. Integracja AI (Gemini)
Aplikacja posiada moduły AI (np. czat, analiza dokumentów) pod ścieżkami `/api/ai/*`.
* ⚠️ **Status Architektoniczny:** Zgodnie z planem wdrożeniowym (`docs/deployment-plans/01-api-key-security.md`), przed wdrożeniem produkcyjnym klucz API Gemini musi zostać w pełni odizolowany po stronie serwera (Backend Proxy), aby zapobiec wyciekom w kodzie klienckim.

## 7. SEO i Optymalizacja
Aplikacja jest w pełni zoptymalizowana pod kątem wyszukiwarek:
* **Next.js Metadata API:** Używane w `layout.tsx` i na poszczególnych stronach (tytuły, opisy, Open Graph).
* **Robots & Sitemap:** Dynamicznie generowane pliki `robots.ts` i `sitemap.ts` w katalogu `app/`.
* **Semantyczny HTML:** Wykorzystanie odpowiednich tagów oraz SSR (Server-Side Rendering) dostarczanego przez Next.js.

## 8. Wdrożenie (Deployment) i Otwartość
Projekt jest gotowy do wdrożenia na platformach takich jak **Vercel**, **Google Cloud Run** czy **AWS Amplify**. Architektura pozwala na łatwą podmianę warstwy danych (z obecnego GAS na docelowe API).
* **Wymagane Zmienne Środowiskowe (.env):**
  * `NEXT_PUBLIC_CMS_BACKEND_URL` - URL do Google Apps Script.
  * `NEXT_PUBLIC_APPS_SCRIPT_API_KEY` - Klucz autoryzacyjny do Apps Script.
  * `CMS_ADMIN_PASSWORD` - Hasło dla konta administratora.
  * `NEXT_PUBLIC_GEMINI_API_KEY` - Klucz do API Gemini (docelowo do przeniesienia na zmienną prywatną).
  * `ALLOW_IFRAME_AUTH` - Flaga dla środowisk deweloperskich (np. AI Studio).

## 9. Podsumowanie dla Developera
1. **Zacznij od:** Przejrzenia `src/config.ts` oraz `src/app/layout.tsx`.
2. **Zrozum przepływ danych:** Zobacz jak `src/app/api/auth/login/route.ts` komunikuje się z `authService` (który uderza do prototypowego backendu Apps Script).
3. **Rozwój UI:** Twórz nowe komponenty w `src/shared/ui` lub `src/widgets`, używając wyłącznie Tailwind CSS (v4).
4. **Zasada:** Wszystkie sekrety i logika biznesowa o znaczeniu krytycznym muszą znajdować się w Server Components lub API Routes.
