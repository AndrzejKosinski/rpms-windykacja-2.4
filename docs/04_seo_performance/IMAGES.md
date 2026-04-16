# Optymalizacja Obrazów

Obrazy są często najcięższym elementem strony. W RPMS stosujemy rygorystyczne zasady ich serwowania.

## 1. Komponent `next/image`
Nigdy nie używamy standardowego tagu `<img>`. Zamiast tego stosujemy komponent `<Image />` z Next.js, który zapewnia:
- **Automatyczną zmianę rozmiaru**: Serwowanie mniejszych obrazów na telefony.
- **Format WebP/AVIF**: Automatyczna konwersja do nowoczesnych, lżejszych formatów.
- **Lazy Loading**: Obrazy są ładowane dopiero, gdy pojawią się w pobliżu ekranu (viewportu).
- **Placeholder (Blur)**: Wyświetlanie rozmytego tła podczas ładowania oryginału.

## 2. Integracja z Unsplash
Większość zdjęć marketingowych pochodzi z Unsplash.
- **Dynamiczne parametry**: Używamy parametrów URL Unsplash (np. `&w=1200&q=80`), aby pobierać obrazy o odpowiedniej szerokości i jakości już u źródła.
- **Remote Patterns**: Hostname `images.unsplash.com` jest zarejestrowany w `next.config.ts`, co pozwala na bezpieczną optymalizację przez serwer Next.js.

## 3. Priorytety (LCP)
Obrazy znajdujące się "above the fold" (np. główne zdjęcie w sekcji Hero) mają ustawiony atrybut `priority`. Dzięki temu przeglądarka zaczyna je pobierać natychmiast, co znacząco poprawia wskaźnik **Largest Contentful Paint**.

## 4. Atrybuty Alt
Każdy obraz w CMS posiada pole `alt`. Jest ono obowiązkowe dla dostępności (czytniki ekranu) oraz SEO. W przypadku braku opisu w CMS, system wstawia domyślny, sensowny opis na podstawie nazwy sekcji.
