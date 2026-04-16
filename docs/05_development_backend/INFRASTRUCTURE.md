# Infrastruktura Backendowa (Google Apps Script & Drive)

Dokument opisuje techniczną strukturę bazy danych opartej na Google Sheets oraz hierarchię plików na Google Drive.

## 1. Struktura Arkusza (Google Sheets)
System operuje na modelu multi-tenant, gdzie dane są izolowane na poziomie wierszy lub osobnych arkuszy.

### Zakładka: `DB_US_Uzytkownicy`
Centralna baza kont firmowych (Tenants).
- `EMAIL`: Klucz główny (unikalny).
- `PASSWORD`: Hasło dostępowe (obecnie plain text, planowana migracja).
- `NIP`: NIP firmy-użytkownika.
- `NAME`: Nazwa firmy.
- `ROOT_FOLDER_ID`: ID folderu na Google Drive (tworzone przy rejestracji).
- `STATUS`: `ACTIVE` / `BLOCKED`.

### Zakładka: `DB_DL_Klienci`
Master Data dłużników (Relacja 1:N z fakturami).
- `ID_DL`: UUID, identyfikator techniczny.
- `NIP`: NIP dłużnika.
- `NAZWA`: Pełna nazwa dłużnika.
- `ADRES`: Pełny adres siedziby.
- `EMAIL`: Adres do wysyłki e-monitów.
- `FOLDER_ID`: ID dedykowanego folderu dłużnika na Drive.
- `USER_EMAIL`: Klucz obcy (email właściciela sprawy).

### Zakładka: `DB_FA_Faktury`
Rejestr poszczególnych wierzytelności.
- `TIMESTAMP`: Data dodania rekordu.
- `ID_DL`: Referencja techniczna do dłużnika.
- `KWOTA`: Wartość brutto.
- `TERMIN`: Termin płatności.
- `STATUS`: `NOWA` / `MONIT` / `SĄD` / `ZAKOŃCZONA`.
- `USER_EMAIL`: Klucz obcy (email właściciela sprawy).

## 2. Struktura Folderów (Google Drive)
System operuje na hierarchicznym modelu izolacji plików ("Silosy danych").

### Poziom 1: Lokalizacja ROOT
- ID zdefiniowane w skrypcie: `CONFIG.ROOT_SYSTEM_FOLDER_ID`.
- Dostęp: Wyłącznie Administrator / Konto Serwisowe.

### Poziom 2: Foldery Użytkowników (Tenants)
- Nazewnictwo: `USER_{email_uzytkownika}`.
- Tworzony: Automatycznie podczas rejestracji konta.
- Cel: Izolacja wszystkich spraw danej firmy.

### Poziom 3: Foldery Dłużników (Case Folders)
- Nazewnictwo: `{NAZWA_DLUZNIKA} ({NIP})`.
- Lokalizacja: Wewnątrz folderu właściwego Użytkownika.

### Poziom 4: Podfoldery Operacyjne
Każdy dłużnik posiada ustandaryzowaną strukturę:
- `/01_Faktury`: Oryginalne pliki PDF/JPG faktur.
- `/02_Dowody`: Dokumentacja uzupełniająca (WZ, protokoły odbioru).
- `/03_Korespondencja`: Wygenerowane wezwania i dowody nadania.

## 3. Logika Provisioningu
1. **Rejestracja**: Użytkownik wypełnia formularz, frontend wysyła akcję `REGISTER_USER`.
2. **Master Index**: Skrypt sprawdza `RPMS_MASTER_INDEX` łączący email z fizycznymi ID plików.
3. **Inicjalizacja**: Tworzony jest folder użytkownika oraz (docelowo) dedykowany arkusz dla dużych klientów w celu uniknięcia limitów Google Sheets (5 mln komórek).
4. **Izolacja**: Skrypt Apps Script zawsze filtruje dane po `USER_EMAIL` lub `ROOT_FOLDER_ID`, uniemożliwiając dostęp do danych innych firm.
