# Instrukcja Wdrożenia i Bezpieczeństwa (v11.0.0)

System został zaprojektowany tak, aby większość procesów konfiguracyjnych odbywała się automatycznie. Poniżej znajdują się kluczowe kroki wdrożenia.

## 1. Inicjalizacja Środowiska Google
Zamiast ręcznego tworzenia folderów, użyj wbudowanych skryptów inicjujących:

1. **Inicjalizacja Systemu (Admin)**: 
   W edytorze Google Apps Script uruchom funkcję `setupNewGoogleAccount_v5()`. Stworzy ona:
   - Folder główny `RPMS-Windykacja`.
   - Arkusz `RPMS_MASTER_INDEX` z poprawnymi nagłówkami (w tym `COMPANY_SETTINGS_JSON`).
   - Strukturę folderów systemowych.

2. **Migracja Istniejących Systemów (v10.7.0 -> v11.0.0)**:
   Jeśli posiadasz już działający system, uruchom funkcję `migrateCompanySettingsColumn()` z pliku `migration_v2.gs`. Doda ona brakującą kolumnę `COMPANY_SETTINGS_JSON` do arkusza `LISTA_KLIENTOW`, zachowując obecne dane.

3. **Inicjalizacja CMS**:
   Z poziomu panelu administratora w aplikacji wywołaj akcję `INITIALIZE_CMS`. Spowoduje to utworzenie arkusza `RPMS_CMS_DATABASE` z domyślnymi sekcjami bloga i ustawień.

3. **Inicjalizacja Klienta**:
   Dzieje się automatycznie podczas rejestracji nowego użytkownika (funkcja `initClientSpreadsheet_v3()`). System tworzy wtedy dedykowany silos danych i folder na załączniki.

---

## 2. Konfiguracja Kluczy API (KRYTYCZNE)
Dla zapewnienia bezpieczeństwa, komunikacja między Dashboardem a Google Apps Script jest chroniona wspólnym kluczem API.

### Krok A: Ustawienie klucza w Apps Script
W pliku `main_v3.gs` znajdź stałą `API_KEY` i nadaj jej unikalną wartość:
```javascript
const API_KEY = "TWOJA_UNIKALNA_WARTOSC_KLUCZA";
```

### Krok B: Ustawienie klucza w Aplikacji (Next.js)
W pliku konfiguracyjnym środowiska aplikacji (np. `.env.local` lub ustawienia platformy) zdefiniuj zmienną:
```env
NEXT_PUBLIC_APPS_SCRIPT_API_KEY=TWOJA_UNIKALNA_WARTOSC_KLUCZA
```
**UWAGA:** Wartości w obu miejscach muszą być identyczne. Jeśli się różnią, system zwróci błąd: `"Nieautoryzowany dostęp"`.

---

## 3. Publikacja jako Web App
Aby Dashboard mógł komunikować się ze skryptami:
1. Kliknij **Wdrożenie** -> **Nowe wdrożenie**.
2. Wybierz **Aplikacja internetowa**.
3. Wykonaj jako: **Ja**.
4. Dostęp: **Każdy** (Anyone).
5. Skopiuj uzyskany adres URL i wklej go do zmiennej `NEXT_PUBLIC_CMS_BACKEND_URL` w aplikacji.
