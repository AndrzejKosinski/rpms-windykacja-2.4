# Zarządzanie czasem rewalidacji treści (ISR)

System RPMS wykorzystuje mechanizm **Incremental Static Regeneration (ISR)** w Next.js, aby serwować treść w sposób błyskawiczny (jak statyczną), przy jednoczesnym zachowaniu możliwości aktualizacji danych z CMS (Google Sheets) bez konieczności przebudowywania całej aplikacji (rebuild).

## Gdzie zmienić czas rewalidacji?

Ustawienia rewalidacji znajdują się w pliku:
`/src/services/cmsRepository.ts`

Wewnątrz funkcji `fetchContentFromCMS` (około linii 23), znajduje się konfiguracja `next`:

```typescript
// /src/services/cmsRepository.ts

const response = await fetch(url, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
  },
  next: { revalidate: 60 } // <--- TUTAJ ZMIENIASZ CZAS
});
```

## Jak dobrać wartość?

Wartość `revalidate` podawana jest w **sekundach**.

*   **`revalidate: 60`** (obecnie): Strona odświeża dane z CMS co minutę. Bardzo agresywne, obciąża API Apps Script.
*   **`revalidate: 3600`**: Strona odświeża dane co godzinę. Optymalne dla większości stron marketingowych.
*   **`revalidate: 86400`**: Strona odświeża dane raz na dobę. Najwyższa wydajność, minimalne obciążenie.

## Instrukcja zmiany:

1. Otwórz plik `/src/services/cmsRepository.ts`.
2. Znajdź sekcję `fetch(url, { ... })`.
3. Zmień wartość w `next: { revalidate: X }`, gdzie `X` to liczba sekund.
4. Zapisz plik.

Po zapisaniu zmian, Next.js przy kolejnym żądaniu po upływie ustawionego czasu, w tle pobierze świeże dane z Google Sheets i zaktualizuje statyczną wersję strony.
