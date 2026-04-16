# Wzorce Komponentów

W projekcie RPMS stosujemy rygorystyczny podział na komponenty serwerowe i klienckie, aby zoptymalizować wydajność.

## 1. Server Components (Domyślne)
Większość komponentów w folderze `src/app` to Server Components.
- **Zaleta**: Nie wysyłają kodu JS do przeglądarki, wykonują się tylko na serwerze.
- **Zastosowanie**: Pobieranie danych, generowanie struktury HTML, sekcje statyczne.

## 2. Client Components (`"use client"`)
Używamy ich tylko wtedy, gdy jest to absolutnie konieczne.
- **Kiedy używać?**
  - Obsługa zdarzeń (np. `onClick`, `onChange`).
  - Użycie hooków (`useState`, `useEffect`, `useContext`).
  - Animacje wymagające interakcji użytkownika.
  - Formularze.

## 3. Kompozycja: Wzorzec "Wrapper"
Często stosujemy wzorzec, w którym Server Component pobiera dane i przekazuje je do Client Componentu jako `props`.

**Przykład (`page.tsx`):**
```tsx
// Server Component
export default async function Page() {
  const data = await fetchData(); // Pobranie danych na serwerze
  return <ClientComponent initialData={data} />; // Przekazanie do klienta
}
```

## 4. Reużywalność (Atomic Design)
- **UI Components**: Najmniejsze elementy (Button, Input, Badge) znajdują się w `src/components/ui`.
- **Marketing Sections**: Większe bloki strony głównej (Hero, Testimonials) znajdują się w `src/components/marketing`. Każdy z nich powinien przyjmować dane przez `props`, aby być niezależnym od źródła danych.

## 5. Dobre praktyki
- **Unikaj `useContext` w małych komponentach**: Przekazuj dane przez `props`, jeśli to możliwe.
- **Lazy Loading**: Komponenty ciężkie lub rzadko używane (np. mapy, edytory) importuj dynamicznie za pomocą `next/dynamic`.
