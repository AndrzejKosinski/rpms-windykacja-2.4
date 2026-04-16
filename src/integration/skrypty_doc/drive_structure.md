# Struktura Google Drive (Hierarchical DMS)

System wykorzystuje hierarchiczny model zarządzania dokumentami (Document Management System), który zapewnia pełną izolację danych klientów.

## Hierarchia Katalogów

### 1. Root: `RPMS-Windykacja`
Główny kontener systemu na dysku Google. Zawiera:
- `RPMS_MASTER_INDEX`: Główny arkusz sterujący.
- `RPMS_CMS_DATABASE`: Baza treści strony publicznej.
- `KLIENCI/`: Katalog nadrzędny dla wszystkich użytkowników.

### 2. Katalog Klienta: `[NAZWA_FIRMY] ([CLIENT_ID])`
Każdy zarejestrowany klient otrzymuje własny, odizolowany folder.
- `BAZA_WINDYKACYJNA_[CLIENT_ID]`: Arkusz silosu klienta (DB_DLUZNICY, DB_SPRAWY, DB_FAKTURY).
- **Podfoldery dłużników**: System tworzy foldery dla poszczególnych dłużników wewnątrz folderu klienta.

### 3. Struktura Dłużnika (Relacyjna)
Wewnątrz folderu klienta, dla każdego dłużnika (NIP) tworzona jest struktura:
`[NAZWA_DŁUŻNIKA] ([NIP])`
├── `01_Faktury`         <-- Załączniki PDF faktur.
├── `02_Dowody_Dostawy`  <-- Dokumenty magazynowe, WZ.
└── `03_Korespondencja`  <-- Wezwania do zapłaty, dowody nadania.

## Logika Powiązań
- `FOLDER_ID` w tabeli `LISTA_KLIENTOW` wskazuje na folder główny klienta.
- `FOLDER_ID` w tabeli `DB_DL_Klienci` (wewnątrz silosu) wskazuje na folder konkretnego dłużnika.
- `FILE_URL` w tabeli `DB_FA_Faktury` prowadzi bezpośrednio do pliku w podfolderze `01_Faktury`.

Taka struktura pozwala na błyskawiczne odnalezienie wszystkich dokumentów dłużnika podczas przygotowywania pozwu lub materiału dowodowego.
