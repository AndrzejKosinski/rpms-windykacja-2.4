# Integracje API w CMS (Unsplash & Gemini AI)

Ten dokument opisuje integrację z zewnętrznymi usługami API w ramach Systemu Zarządzania Treścią (CMS).

## 1. Integracja z Unsplash API (Biblioteka Mediów)
CMS umożliwia wyszukiwanie i wybór profesjonalnych zdjęć biznesowych bezpośrednio z panelu edycji artykułu.

### Konfiguracja:
- **Klucz API**: `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` (musi być ustawiony w zmiennych środowiskowych).
- **Endpoint**: `https://api.unsplash.com/search/photos`.
- **Parametry**: `query` (frazę wyszukiwania), `per_page` (domyślnie 12), `client_id` (klucz dostępu).

### Przepływ pracy:
1. Użytkownik klika "Zmień zdjęcie" w edytorze artykułu.
2. Otwiera się `ImagePickerModal.tsx`.
3. Po wpisaniu frazy i wyszukaniu, zdjęcia są pobierane i wyświetlane w siatce.
4. Wybór zdjęcia aktualizuje pole `image` w lokalnym stanie artykułu.

## 2. Integracja z Gemini AI (Optymalizacja SEO)
CMS wykorzystuje model Gemini AI (`gemini-3-flash-preview`) do automatycznej optymalizacji artykułów pod kątem SEO.

### Funkcjonalność:
- **Analiza treści**: AI analizuje tytuł i treść artykułu.
- **Sugestie**: Generuje zoptymalizowany Meta Title, Meta Description, Keywords, Slug oraz tekst ALT dla zdjęcia.
- **FAQ**: Automatycznie generuje sekcję pytań i odpowiedzi (FAQ) na podstawie treści artykułu.
- **JSON-LD**: Generuje techniczne dane strukturalne dla wyszukiwarek.

### Przepływ pracy:
1. Użytkownik klika "AI SEO Assistant" w edytorze artykułu.
2. Wywoływana jest funkcja `optimizeSEO` z `src/services/geminiService.ts`.
3. Po otrzymaniu odpowiedzi, otwiera się `AIReviewModal.tsx`.
4. Użytkownik może wybrać, które sugestie (np. tylko tytuł i opis) chce wdrożyć.
5. Po zaakceptowaniu, zmiany są nanoszone na lokalny stan artykułu.

## 3. Bezpieczeństwo i Limity
- **Klucze API**: Wszystkie klucze są przechowywane po stronie serwera lub jako publiczne zmienne środowiskowe (jeśli wymagane przez klienta).
- **Rate Limiting**: Należy pamiętać o limitach darmowych planów Unsplash (50 żądań na godzinę) i Gemini AI.
- **Walidacja**: Wszystkie dane otrzymane z AI są traktowane jako sugestie i wymagają zatwierdzenia przez administratora przed zapisem.
