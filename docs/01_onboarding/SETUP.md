# Setup Środowiska

Dokument opisuje proces instalacji i konfiguracji projektu RPMS.

## 1. Wymagania systemowe
- **Node.js**: wersja 18.x lub nowsza.
- **Menedżer pakietów**: `npm` (rekomendowany).

## 2. Instalacja
1. Sklonuj repozytorium na lokalny dysk.
2. Zainstaluj zależności:
   ```bash
   npm install
   ```

## 3. Konfiguracja zmiennych środowiskowych (`.env`)
Skopiuj plik `.env.example` do `.env` i uzupełnij brakujące wartości.

### Zmienne Serwerowe (Prywatne)
Te zmienne są dostępne tylko w środowisku Node.js (API Routes, Server Components).

| Zmienna | Opis |
|---------|------|
| `CMS_BACKEND_URL` | Adres URL skryptu Google Apps Script (Backend). |
| `CMS_ADMIN_PASSWORD` | Hasło do panelu administratora `/panel` (dla admin@admin.pl). |
| `JWT_SECRET` | Klucz do podpisywania sesji użytkownika (JWT). |
| `GEMINI_API_KEY` | Klucz API do modeli Gemini (używany po stronie serwera). |
| `ALLOW_IFRAME_AUTH` | Ustaw na `true` przy pracy w AI Studio (pozwala na SameSite=None). |

### Zmienne Publiczne (Dostępne w przeglądarce)
Te zmienne muszą mieć prefiks `NEXT_PUBLIC_`.

| Zmienna | Opis |
|---------|------|
| `NEXT_PUBLIC_CMS_BACKEND_URL` | Publiczny adres URL skryptu (używany jako fallback w config.ts). |
| `NEXT_PUBLIC_APPS_SCRIPT_API_KEY` | Klucz API używany przez klienta do autoryzacji z Apps Script. |
| `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` | Klucz dostępu do API Unsplash dla obrazów. |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Opcjonalny klucz Gemini dostępny dla klienta. |

## 4. Pierwsze uruchomienie i Inicjalizacja (v10.7.0)
Po skonfigurowaniu zmiennych środowiskowych, wykonaj następujące kroki:

1. **Inicjalizacja Master Index**:
   W edytorze Google Apps Script uruchom funkcję `setupNewGoogleAccount_v4()`. Stworzy ona strukturę folderów i główny skorowidz.
2. **Inicjalizacja CMS**:
   Zaloguj się do panelu administratora (`/panel`) jako `admin@admin.pl` (używając hasła z `CMS_ADMIN_PASSWORD`) i kliknij przycisk **Inicjalizuj CMS**.

## 5. Uruchamianie projektu
- **Tryb deweloperski**: `npm run dev` (dostęp pod `http://localhost:3000`)
- **Budowanie produkcyjne**: `npm run build`
- **Start produkcyjny**: `npm run start`

## 5. Rozwiązywanie problemów
- **Błąd 401/403 przy pobieraniu treści**: Sprawdź czy `NEXT_PUBLIC_APPS_SCRIPT_API_KEY` jest poprawny i czy skrypt Apps Script go akceptuje.
- **Nieskończone ładowanie panelu**: Upewnij się, że `CMS_BACKEND_URL` jest poprawny i zwraca poprawną strukturę JSON.
