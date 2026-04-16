# Plan Wdrożenia: Zabezpieczenie Płatnego Klucza API (Gemini / Vertex AI)

**Status:** 🟡 Do realizacji (Bloker dla wdrożenia produkcyjnego)  
**Priorytet:** Wysoki  
**Data utworzenia:** 2026-03-18  

## 1. Kontekst i Cel
Na obecnym etapie deweloperskim integracja z modelami AI (Gemini / Vertex AI) może być realizowana w sposób uproszczony dla ułatwienia testów. Przed docelowym wdrożeniem na produkcję (Go-Live), konieczne jest zabezpieczenie płatnego klucza API. Pozostawienie klucza po stronie klienta (w przeglądarce) stwarza ryzyko jego kradzieży, nieautoryzowanego użycia oraz wygenerowania nieoczekiwanych kosztów.

## 2. Założenia Architektury Docelowej
Aby zapewnić pełne bezpieczeństwo, komunikacja z API AI zostanie przebudowana zgodnie z poniższymi założeniami:

* **Backend Proxy (BFF - Backend for Frontend):** 
  Wszystkie zapytania do Gemini/Vertex AI będą realizowane wyłącznie z poziomu serwera (np. Next.js API Routes, Node.js/Express). Aplikacja kliencka (frontend) będzie komunikować się tylko z naszym wewnętrznym API.
* **Izolacja Zmiennych Środowiskowych:** 
  Płatny klucz API będzie przechowywany jako bezpieczna zmienna środowiskowa po stronie serwera (bez przedrostków typu `NEXT_PUBLIC_`). Klucz nigdy nie trafi do paczki (bundle'a) wysyłanej do przeglądarki.
* **Autoryzacja Zapytań:** 
  Wewnętrzny endpoint serwerowy będzie weryfikował sesję użytkownika. Zapytania do modelu AI będą realizowane tylko dla uwierzytelnionych i uprawnionych użytkowników.
* **Rate Limiting i Kontrola Kosztów:** 
  Na poziomie serwera wdrożony zostanie mechanizm limitowania zapytań (Rate Limiting) per użytkownik/IP, aby chronić budżet przed nadużyciami.

## 3. Checklista Wdrożeniowa (Do wykonania przed Produkcją)
- [ ] Utworzenie serwerowego endpointu (np. `/api/generate`) do obsługi zapytań AI.
- [ ] Przeniesienie logiki inicjalizacji SDK Gemini (`@google/genai`) na serwer.
- [ ] Usunięcie klucza API z publicznych zmiennych środowiskowych i kodu klienckiego.
- [ ] Zabezpieczenie nowego endpointu mechanizmem autoryzacji (sprawdzanie tokenu/sesji).
- [ ] Zaktualizowanie komponentów frontendowych, aby odpytywały nowy endpoint `/api/generate`.
- [ ] (Opcjonalnie) Dodanie mechanizmu Rate Limitingu na serwerze.
