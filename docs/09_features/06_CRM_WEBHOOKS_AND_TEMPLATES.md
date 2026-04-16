# Integracja CRM i Szablony E-mail (Webhooki)

## Opis Architektury
System RPMS Windykacja pełni rolę "Centrum Powiadomień" (Omnichannel), łącząc powiadomienia e-mail z przyszłymi powiadomieniami w panelu klienta (in-app notifications).

Zewnętrzny system CRM (np. system zarządzania sprawami) komunikuje się z aplikacją Next.js za pomocą bezpiecznych Webhooków. Aplikacja pobiera zdefiniowane szablony z chmury (Google Apps Script / `RPMS_CMS_DATABASE`), podmienia zmienne na rzeczywiste dane i wysyła sformatowaną wiadomość do klienta.

## Zarządzanie Szablonami
Szablony e-mail są zarządzane przez administratora w Panelu Admina (`/panel` -> zakładka "Szablony E-mail").
Treść szablonów jest zapisywana w formacie HTML i przechowywana w bazie CMS.

Obecnie obsługiwane szablony:
- `WELCOME_NEW_USER` - Powitanie nowego klienta
- `ACCOUNT_ACTIVATION` - Weryfikacja adresu e-mail
- `PASSWORD_RESET` - Resetowanie hasła
- `CONFIRM_LEAD_DEBT` - Potwierdzenie przyjęcia sprawy
- `CASE_STATUS_UPDATE` - Zmiana statusu sprawy (wyzwalane z CRM)
- `DOCUMENT_REQUIRED` - Brakujące dokumenty (wyzwalane z CRM)
- `PAYMENT_REMINDER` - Przypomnienie o płatności (wyzwalane z CRM)

## Endpoint Webhooka
**URL:** `POST /api/webhooks/crm-notify`

### Zabezpieczenia
Endpoint jest zabezpieczony za pomocą tokena Bearer. Wymagane jest przesłanie nagłówka:
`Authorization: Bearer <CRM_WEBHOOK_SECRET>`
*(Wartość tokena musi być zgodna ze zmienną środowiskową `CRM_WEBHOOK_SECRET` w pliku `.env`)*

### Format Payloadu (JSON)
CRM powinien wysłać żądanie POST z następującym ciałem:

```json
{
  "userId": "uid_klienta_w_firebase",
  "userEmail": "klient@example.com",
  "templateType": "CASE_STATUS_UPDATE",
  "data": {
    "CASE_ID": "SPRAWA/2024/01",
    "OLD_STATUS": "Analiza merytoryczna",
    "NEW_STATUS": "Skierowano do sądu",
    "DASHBOARD_URL": "https://rpms.pl/panel"
  }
}
```

### Parametry
- `userId` (string) - ID użytkownika (przydatne w przyszłości do zapisywania powiadomień w bazie Firestore dla panelu klienta).
- `userEmail` (string) - Adres e-mail, na który zostanie wysłana wiadomość.
- `templateType` (string) - Klucz szablonu (np. `CASE_STATUS_UPDATE`, `DOCUMENT_REQUIRED`).
- `data` (object) - Słownik klucz-wartość zawierający dane do podmiany w szablonie. Klucze muszą odpowiadać zmiennym zdefiniowanym w szablonie (np. `{{CASE_ID}}`).

## Dalszy rozwój (Powiadomienia In-App)
W przyszłości endpoint `/api/webhooks/crm-notify` zostanie rozbudowany o zapisywanie powiadomień do bazy Firestore. Dzięki temu, oprócz wiadomości e-mail, klient po zalogowaniu do panelu zobaczy nowe powiadomienie (np. pod ikoną dzwonka).
