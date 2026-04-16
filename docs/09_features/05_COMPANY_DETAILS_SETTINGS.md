# Dane Firmy i Rozliczenia (Ustawienia)

**Data dokumentu:** 2026-03-20
**Wersja:** 1.0.0
**Status:** Zaimplementowane

## 1. Cel biznesowy
Umożliwienie klientowi samodzielnego zarządzania danymi firmowymi, na które wystawiane są faktury prowizyjne oraz na które przekazywane są odzyskane środki. Proces został zautomatyzowany poprzez pobieranie danych na podstawie NIP-u z Białej Księgi (docelowo z bazy GUS).

## 2. Architektura i Przepływ Danych (Data Flow)

### A. Interfejs Użytkownika (UI)
*   **Nowy komponent:** `src/features/settings/ui/CompanyDetailsForm.tsx`
*   **Integracja:** Komponent został osadzony w widoku `src/views/settings/ui/SettingsView.tsx`, pod sekcją "Bezpieczeństwo".
*   **Pola formularza:**
    *   `nip` (Tekst, 10 znaków) - z akcją automatycznego pobierania danych.
    *   `companyName` (Tekst) - Nazwa firmy.
    *   `address` (Tekst) - Adres siedziby.
    *   `iban` (Tekst) - Domyślny rachunek bankowy do wpłat z windykacji.
    *   `billingEmail` (Email) - Adres e-mail do wysyłki faktur.

### B. Walidacja i Pobieranie Danych (Biała Księga)
*   **Wykorzystanie istniejącego API:** Użycie endpointu `/src/app/api/nip/route.ts` (Biała Księga MF).
*   **Mechanizm:** Po wpisaniu 10 cyfr NIP-u, frontend odpytuje `/api/nip?nip=...`. Zwrócone dane automatycznie wypełniają odpowiednie pola.
*   **Walidacja (Zod):** NIP (10 cyfr), IBAN (format i długość), Billing Email (format e-mail).

### C. Backend i Baza Danych (Google Apps Script)
*   **Nowy Endpoint API (Next.js):** Utworzono `/src/app/api/settings/company/route.ts` (obsługa `GET`, `POST`).
*   **Google Apps Script (GAS):**
    *   Nowe akcje w routerze `main_v4.gs` (`UPDATE_COMPANY_DATA`, `GET_COMPANY_DATA`).
    *   Rozszerzenie struktury bazy (arkusza `LISTA_KLIENTOW`) o nowe kolumny.

## 3. Strategia migracji na GUS (Future-proofing)

Aby w przyszłości płynnie przejść z Białej Księgi na bazę GUS:
1.  **Abstrakcja na Froncie:** Logika pobierania danych po NIP została zamknięta w dedykowanym hooku `useNipLookup`, zwracającym ustandaryzowany obiekt `{ name, address, nip }`.
2.  **Zmiana na Backendzie:** Zaktualizujemy plik `/src/app/api/nip/route.ts` (lub stworzymy `/api/gus/route.ts`), aby komunikował się z API GUS (wymagającym klucza API). Frontend pozostanie nietknięty.
