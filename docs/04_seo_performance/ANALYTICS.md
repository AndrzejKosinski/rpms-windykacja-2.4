# Strategia Analityki Behawioralnej RPMS

Dokument opisuje wdrożone i planowane mechanizmy śledzenia aktywności użytkowników.

## 1. Rozwiązanie Własne - Custom Logging (Etap Obecny)
Obecnie system korzysta z autorskiego modułu śledzenia, który loguje zdarzenia bezpośrednio do bazy `RPMS_CMS_DATABASE` (Google Sheets) za pomocą akcji `LOG_EVENT`.

### Zakres śledzenia:
- **Autoryzacja**: Logowanie i wylogowanie użytkowników.
- **Interakcje UI**: Otwarcie kluczowych modali (Login, Register, Onboarding, Lawyer, Consult).
- **Decyzje biznesowe**: Wybór konkretnych rozwiązań i szczegółów w sekcji "Dlaczego my".
- **Konwersje**: Finalna wysyłka formularza Lead.

### Struktura danych logu:
- `timestamp`: Czas zdarzenia.
- `event_name`: Nazwa zdarzenia (np. `user_login_success`).
- `user_email`: Email zalogowanego użytkownika.
- `metadata`: Dodatkowe informacje (np. ID wybranego rozwiązania).
- `url`: Adres URL strony, na której wystąpiło zdarzenie.

## 2. Analityka Natywna i Big Data (Planowane)
W kolejnych etapach rozwoju planowane jest wdrożenie profesjonalnych narzędzi analitycznych:
- **Firebase Analytics**: Pełne wdrożenie po migracji na Firebase Auth.
- **Google BigQuery**: Eksport danych z Firebase w celu prowadzenia zaawansowanej analityki Business Intelligence (BI).

## Podsumowanie
System posiada obecnie pełną kontrolę biznesową i audytową nad aktywnością wewnątrz ekosystemu RPMS dzięki modułowi `src/utils/customLogger.ts`.
