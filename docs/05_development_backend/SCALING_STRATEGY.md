# Strategia Skalowania

Dokument opisuje, jak przygotować RPMS na wzrost liczby użytkowników i treści.

## 1. Skalowanie Wydajnościowe
- **Edge Runtime**: Przeniesienie krytycznych tras API na Edge Runtime (Vercel/Cloudflare), aby skrócić czas odpowiedzi globalnie.
- **CDN Caching**: Wykorzystanie Stale-While-Revalidate (SWR) na poziomie nagłówków HTTP Cache-Control.
- **Optymalizacja Bazy**: Indeksowanie kluczowych kolumn w PostgreSQL po migracji.

## 2. Skalowanie Treści (I18n)
Projekt jest przygotowany pod wielojęzyczność (Internationalization):
- **Struktura URL**: Przejście na `/pl/`, `/en/` itp.
- **CMS**: Rozszerzenie schematu danych o pola typu `title_en`, `content_en`.
- **Middleware**: Automatyczne wykrywanie języka przeglądarki.

## 3. Skalowanie Funkcjonalne
- **Microservices**: Jeśli system stanie się bardzo złożony (np. moduł płatności, moduł CRM), zalecamy wydzielenie ich do osobnych mikroserwisów komunikujących się przez API.
- **Event-Driven**: Wprowadzenie kolejki zadań (np. BullMQ lub Redis) dla ciężkich operacji, takich jak generowanie raportów PDF czy wysyłka masowych maili.

## 4. Infrastruktura
- **Containerization**: Przygotowanie pliku `Dockerfile` dla łatwego wdrażania na dowolnej chmurze (AWS, Google Cloud, Azure).
- **CI/CD**: Rozbudowa potoków GitHub Actions o testy integracyjne i automatyczne sprawdzanie wydajności (Lighthouse CI).
