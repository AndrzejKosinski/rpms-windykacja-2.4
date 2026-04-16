# Rozbudowa Panelu Administratora

Instrukcja dla deweloperów dotycząca dodawania nowych funkcji do panelu `/panel`.

## 1. Dodawanie Nowej Sekcji
Aby dodać nową sekcję zarządzania (np. "Blog" lub "Użytkownicy"):
1. **Trasa**: Utwórz folder w `src/app/(dashboard)/panel/[nowa-sekcja]/page.tsx`.
2. **Nawigacja**: Dodaj link do nowej sekcji w komponencie `Sidebar.tsx`.
3. **Typy**: Zaktualizuj interfejsy w `src/types/` o nowe pola danych.

## 2. Formularze i Walidacja
- Używaj **React Hook Form** w połączeniu z **Zod** dla wszystkich formularzy w panelu.
- Każde pole powinno mieć zdefiniowaną walidację (np. `min(1)`, `email()`).

## 3. Komunikacja z Backendem
- Wszystkie operacje zapisu powinny odbywać się przez Server Actions lub dedykowane API Routes.
- Pamiętaj o obsłudze stanów ładowania (`loading`) i błędów (`error`), aby zapewnić dobre UX administratorowi.

## 4. UI/UX Panelu
- Zachowaj spójność wizualną używając biblioteki komponentów UI (np. Shadcn UI).
- Stosuj "Optimistic Updates" dla prostych operacji (np. zmiana statusu), aby panel wydawał się szybszy.

## 5. Bezpieczeństwo
- Zawsze sprawdzaj uprawnienia użytkownika po stronie serwera, nie tylko ukrywaj elementy w UI.
- Loguj ważne akcje administracyjne (kto, co i kiedy zmienił).
