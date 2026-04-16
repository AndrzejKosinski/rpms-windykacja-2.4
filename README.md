# RPMS Windykacja CMS

Aplikacja internetowa z wbudowanym systemem CMS (Content Management System) oraz blogiem.

## Optymalizacja Wydajności (N+1)

Wraz ze wzrostem liczby artykułów na blogu, pobieranie całego obiektu CMS (zawierającego pełne treści wszystkich postów) stało się problemem wydajnościowym. Aby rozwiązać ten problem, wdrożono optymalizację polegającą na podziale danych na dwa widoki:

- **Pełny widok (`full`)**: Używany w panelu administracyjnym (CMS) oraz na stronach pojedynczych artykułów (gdzie potrzebna jest pełna treść).
- **Odchudzony widok (`index`)**: Używany na liście bloga (`/blog`). Zawiera tylko zajawki postów (bez pól `content`, `faqs`, `seo`), co drastycznie zmniejsza rozmiar przesyłanych danych i przyspiesza ładowanie strony.

Szczegóły architektoniczne znajdują się w folderze `docs/`.

## Uruchamianie lokalnie

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`.
