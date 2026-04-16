# Walidacja Danych i Ochrona API

Dokument opisuje mechanizmy zapewniające integralność danych w projekcie RPMS.

## 1. Walidacja Schematów (Zod)
Używamy biblioteki **Zod** do definiowania i egzekwowania struktury danych.

### Gdzie stosujemy Zod?
- **Odbiór danych z CMS**: Sprawdzamy, czy zewnętrzny backend (Apps Script) nie przesłał uszkodzonych lub niebezpiecznych danych.
- **API Routes (POST/PUT)**: Każde żądanie zapisu (np. aktualizacja treści, formularz kontaktowy) musi przejść przez walidator Zod.
- **Zmienne Środowiskowe**: Podczas startu aplikacji sprawdzamy, czy wszystkie wymagane klucze `.env` są obecne.

## 2. Bezpieczna Komunikacja z API
Wszystkie zapytania do zewnętrznych serwisów przechodzą przez warstwę `services/`.

- **Timeouty**: Każde zapytanie ma ustawiony limit czasu (np. 5 sekund), aby zapobiec blokowaniu zasobów serwera.
- **Error Handling**: Błędy API są przechwytywane i logowane (bez ujawniania szczegółów technicznych użytkownikowi końcowemu).

## 3. Ochrona przed Spamem
Formularze publiczne (np. kontaktowy) są chronione przez:
- **Rate Limiting**: Ograniczenie liczby zgłoszeń z jednego adresu IP w jednostce czasu.
- **Honeypot**: Ukryte pole formularza, którego wypełnienie przez bota powoduje odrzucenie zgłoszenia.

## 4. Przykład Walidacji (Zod)
```typescript
import { z } from "zod";

const ContactSchema = z.object({
  email: z.string().email("Niepoprawny format email"),
  message: z.string().min(10, "Wiadomość jest za krótka").max(1000),
  subject: z.enum(["general", "support", "billing"])
});

// Użycie w API Route
const result = ContactSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json(result.error);
}
```
