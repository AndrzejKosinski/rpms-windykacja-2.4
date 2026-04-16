# Konfiguracja Arkuszy Google (Baza Danych)

System opiera się na trzech głównych typach arkuszy, które pełnią rolę relacyjnej bazy danych.

## 1. RPMS_MASTER_INDEX (Główny Skorowidz)
Plik ten zarządza dostępem użytkowników i bezpieczeństwem całego systemu.

### Arkusz: `LISTA_KLIENTOW`
| Kolumna | Nazwa | Opis |
| :--- | :--- | :--- |
| A | CLIENT_ID | Unikalny identyfikator klienta (np. RPMS-ABCD1234). |
| B | CLIENT_NAME | Nazwa firmy lub imię i nazwisko użytkownika. |
| C | EMAIL | Adres e-mail (login) - unikalny w systemie. |
| D | PASSWORD | Skrót SHA-256 hasła użytkownika. |
| E | FOLDER_ID | ID dedykowanego folderu klienta na Google Drive. |
| F | SPREADSHEET_ID | ID dedykowanego arkusza (silosu) klienta. |
| G | PANEL_STATUS | Status konta (np. ACTIVE, LEAD, BLOCKED). |
| H | CREATED_AT | Data i godzina rejestracji. |
| I | EmailVerified | Status weryfikacji adresu e-mail (TRUE/FALSE). |
| J | COMPANY_SETTINGS_JSON | Dane firmy i rozliczeniowe w formacie JSON (NIP, Nazwa, Adres, IBAN). |

### Arkusz: `AuthTokens`
Zarządza tymczasowymi tokenami bezpieczeństwa.
- **Token**: Unikalny UUID.
- **Email**: Adres powiązany z tokenem.
- **Type**: Typ operacji (`ACTIVATION` lub `RESET`).
- **ExpiresAt**: Data wygaśnięcia ważności tokenu.

---

## 2. RPMS_CMS_DATABASE (Zarządzanie Treścią)
Arkusz inicjowany przez administratora (akcja `INITIALIZE_CMS`), służący do dynamicznego zarządzania stroną publiczną.

### Arkusz: `blog`
Przechowuje wpisy na blogu.
- **id**: Techniczne ID wpisu.
- **title**: Tytuł posta.
- **slug**: Przyjazny adres URL.
- **content**: Treść w formacie HTML/Markdown.
- **status**: `published` lub `draft`.
- **publishedAt**: Data publikacji.

### Arkusz: `pages`
Treści dla podstron statycznych (np. O nas, Kontakt).

---

## 3. Bazy Klientów (Silosy Indywidualne)
Każdy klient posiada własny, odizolowany arkusz bazy danych.

### Arkusz: `DB_DLUZNICY`
- **DEBTOR_ID**: Unikalne ID dłużnika.
- **NIP**: Klucz biznesowy (unikalny dla dłużnika).
- **NAZWA_FIRMY**, **ADRES_SIEDZIBY**, **KRS**, **EMAIL**: Dane kontaktowe i rejestrowe.

### Arkusz: `DB_SPRAWY`
| Kolumna | Nazwa | Opis |
| :--- | :--- | :--- |
| A | CASE_ID | Unikalne ID sprawy. |
| B | DEBTOR_ID | Powiązanie z dłużnikiem. |
| C | STATUS_PRAWNY | Etap windykacji (np. Nowa sprawa, Monit, Sąd). |
| D | STRATEGIA | Wybrana strategia windykacyjna. |
| E | START_DATE | Data rozpoczęcia sprawy. |
| F | USER_EMAIL | Email użytkownika (właściciela sprawy). |
| G | HISTORY_JSON | Pełna historia zdarzeń w formacie JSON (logi systemowe). |
| H | METADATA_JSON | Dodatkowe parametry techniczne sprawy. |

### Arkusz: `DB_FAKTURY`
- **INVOICE_ID**: Unikalne ID dokumentu.
- **CASE_ID**: Powiązanie ze sprawą.
- **NUMER_FAKTURY**, **KWOTA_BRUTTO**, **WALUTA**: Dane finansowe.
- **FILE_URL**: Bezpośredni link do pliku PDF na Google Drive.
