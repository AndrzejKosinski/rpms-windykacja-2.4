# Proces Pracy i Workflow

Dokument opisuje standardy pracy w projekcie RPMS, ze szczególnym uwzględnieniem mechanizmu aktualizacji danych (GitOps).

## 1. Standardy kodu
- **TypeScript**: Obowiązkowe typowanie wszystkich interfejsów i funkcji.
- **Tailwind CSS v4**: Używamy wyłącznie klas narzędziowych. Unikamy pisania własnego CSS w plikach `.css`.
- **Komponenty**: Preferujemy Server Components. Client Components (`"use client"`) używamy tylko tam, gdzie niezbędna jest interakcja lub hooki Reacta.

## 2. Git Flow
1. `main` - gałąź produkcyjna, zawsze stabilna.
2. `feature/*` - nowe funkcjonalności.
3. `fix/*` - poprawki błędów.

Każda zmiana powinna przechodzić przez Pull Request.

## 3. Mechanizm Aktualizacji Fallback (GitOps)
To unikalny element projektu. Dane CMS są przechowywane w chmurze, ale aplikacja posiada lokalną kopię "bezpieczeństwa".

### Kiedy aktualizować fallback?
Zawsze po wprowadzeniu istotnych zmian w treści lub strukturze strony przez panel administratora, które powinny stać się nowym "standardem" w przypadku braku sieci.

### Proces aktualizacji:
1. Administrator wprowadza zmiany w `/panel`.
2. Administrator klika przycisk **"Eksportuj Fallback"**.
3. Pobrane pliki (`content.json` oraz `fallbackLayout.ts`) należy umieścić w projekcie:
   - `public/content.json` -> Nadpisuje domyślne treści.
   - `src/config/fallbackLayout.ts` -> Nadpisuje domyślny układ sekcji.
4. Developer tworzy commit: `git commit -m "chore: update fallback data from CMS"`.
5. Po wypchnięciu zmian i wdrożeniu (CI/CD), nowa wersja aplikacji ma zaktualizowane dane "zaszyte" w kodzie.

## 4. Testowanie
Przed wysłaniem PR upewnij się, że:
1. Projekt buduje się pomyślnie: `npm run build`.
2. Linter nie zgłasza błędów: `npm run lint`.
3. Strona główna wyświetla się poprawnie w trybie offline (możesz to przetestować zmieniając tymczasowo URL w `.env` na błędny).
