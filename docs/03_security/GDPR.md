# Zgodność architektury RPMS z RODO (GDPR)

Dokument opisuje analizę prawno-techniczną zgodności systemu RPMS z wymaganiami RODO.

## 1. "Privacy by Design" i "Privacy by Default" (Art. 25 RODO)
Architektura izolowanych silosów danych (rozdzielenie CMS od Bazy Windykacyjnej) jest bezpośrednią realizacją zasady minimalizacji ryzyka. Nawet w przypadku naruszenia bezpieczeństwa warstwy publicznej (blog/strona główna), dane dłużników pozostają technicznie niedostępne, ponieważ znajdują się w odseparowanym, zabezpieczonym środowisku (osobny arkusz, dedykowane API Apps Script).

## 2. Lokalizacja danych i transfer do państw trzecich
Infrastruktura Google Cloud (w tym Google Workspace) posiada pełną certyfikację zgodną z EU-US Data Privacy Framework.
- **Regiony**: Możliwość wyboru lokalizacji danych (Regiony EU, np. Warszawa/Frankfurt) dla kont biznesowych.
- **Umowa DPA**: Administrator Danych (RPMS) korzysta z zawartej z Google Umowy Powierzenia Przetwarzania Danych (Data Processing Amendment).

## 3. Zabezpieczenia techniczne i organizacyjne (Art. 32 RODO)
- **Szyfrowanie**: Dane są szyfrowane w spoczynku (at rest) oraz podczas przesyłania (in transit) za pomocą protokołu TLS 1.3.
- **Logowanie dostępów**: Każda operacja odczytu lub zapisu jest rejestrowana w Audit Logs Google Cloud.
- **Uwierzytelnianie**: Dostęp do panelu administracyjnego zabezpieczony jest mechanizmami OAuth 2.0 oraz opcjonalnym 2FA.

## 4. Realizacja praw osób, których dane dotyczą
- **Prawo do usunięcia danych**: Możliwość trwałego usunięcia rekordów bezpośrednio z interfejsu Panelu Admina.
- **Prawo do przenoszenia danych**: Funkcja eksportu bazy do formatów interoperacyjnych (.csv, .xlsx).
- **Retencja danych**: Możliwość implementacji skryptów automatycznej anonimizacji po upływie okresu przedawnienia roszczeń.

## 5. Porównanie bezpieczeństwa z systemami typu WordPress
W przeciwieństwie do WordPressa, który przechowuje dane w jednej, często publicznie dostępnej bazie SQL, RPMS:
- Nie posiada publicznej bazy SQL (brak podatności na SQL Injection).
- Ogranicza powierzchnię ataku poprzez architekturę "Headless".
- Eliminuje ryzyko związane z niezweryfikowanymi wtyczkami zewnętrznymi (Zero Third-Party Plugins policy).

## Wnioski
Architektura hybrydowa RPMS (React/Next.js + Google Apps Script) spełnia wysokie standardy ochrony danych osobowych wymagane na terenie Polski i Unii Europejskiej, oferując poziom bezpieczeństwa przewyższający standardowe rozwiązania CMS.
