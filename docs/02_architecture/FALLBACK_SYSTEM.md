# System Fallback (Niezawodność)

Projekt RPMS posiada unikalny, dwupoziomowy system zabezpieczeń na wypadek awarii zewnętrznego CMS.

## 1. Poziom 1: Fallback Treści (`content.json`)

W folderze `public/` znajduje się plik `content.json`. Jest to pełna kopia danych tekstowych i linków do obrazów z CMS.

### Jak to działa?
W pliku `src/services/cmsRepository.ts` funkcja pobierająca dane posiada blok `try-catch`. Jeśli zapytanie do Google Apps Script zawiedzie (np. błąd 404, 500 lub timeout), system automatycznie wczytuje dane z `content.json`.

**Zaleta**: Użytkownik zawsze widzi treść, nawet jeśli backend "leży".

## 2. Poziom 2: Fallback Układu (`fallbackLayout.ts`)

W folderze `src/config/` znajduje się plik `fallbackLayout.ts`. Definiuje on domyślną kolejność i strukturę sekcji na stronie głównej.

### Jak to działa?
W `AppContext.tsx`, podczas inicjalizacji stanu `siteContent`, system sprawdza czy pobrane dane (z chmury lub JSONa) zawierają definicję układu (`pageLayout`). Jeśli nie (np. plik JSON jest uszkodzony lub niepełny), aplikacja wstrzykuje układ z `fallbackLayout.ts`.

## 3. Dlaczego to jest ważne?
Większość aplikacji typu "Headless CMS" przestaje działać, gdy CMS jest niedostępny. RPMS w takiej sytuacji staje się "statyczną stroną", zachowując pełną funkcjonalność dla odwiedzającego.

## 4. Zarządzanie Fallbackami
Fallbacki nie są aktualizowane automatycznie (aplikacja nie ma uprawnień do zapisu własnych plików na serwerze). Aktualizacja odbywa się ręcznie przez dewelopera zgodnie z procesem opisanym w [WORKFLOW.md](../01_onboarding/WORKFLOW.md).

### Struktura `content.json`:
Musi być zawsze zgodna z interfejsem `SiteContent` zdefiniowanym w typach projektu. Każda zmiana struktury w CMS wymaga aktualizacji tego pliku.
