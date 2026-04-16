# Core Web Vitals i Wydajność

Wydajność mierzymy za pomocą standardów Google: Core Web Vitals.

## 1. LCP (Largest Contentful Paint)
Czas załadowania największego elementu widocznego na ekranie.
- **Optymalizacja**: SSR (Server-Side Rendering) danych z CMS, priorytetyzacja obrazów Hero, minimalizacja krytycznego CSS.

## 2. CLS (Cumulative Layout Shift)
Stabilność wizualna strony podczas ładowania.
- **Optymalizacja**: Rezerwowanie miejsca na obrazy (atrybuty `width` i `height`), unikanie dynamicznego wstrzykiwania treści nad załadowanymi już elementami, używanie czcionek systemowych jako fallbacków.

## 3. INP (Interaction to Next Paint)
Responsywność na interakcje użytkownika.
- **Optymalizacja**: Minimalizacja głównego wątku JS, używanie `Transition` w React dla ciężkich operacji, optymalizacja animacji (używanie `transform` i `opacity` zamiast zmian layoutu).

## 4. Techniki Przyspieszania
- **Code Splitting**: Next.js automatycznie dzieli kod na mniejsze paczki per strona.
- **Tree Shaking**: Usuwanie nieużywanego kodu z bibliotek (np. importowanie tylko potrzebnych ikon z Lucide).
- **Prefetching**: Automatyczne pobieranie kodu podstron, do których prowadzą linki widoczne na ekranie.
- **Minifikacja**: Automatyczna minifikacja JS i CSS w procesie budowania (`npm run build`).

## 5. Monitoring
Zalecamy regularne sprawdzanie wyników za pomocą:
- **Lighthouse** (wbudowany w Chrome DevTools).
- **PageSpeed Insights**.
- **Vercel Analytics** (jeśli aplikacja jest tam hostowana).
