# 📋 Plan Działań Naprawczych i Optymalizacyjnych (Audyt)

## 🔴 FAZA 1: Krytyczne (Bezpieczeństwo i Podstawy SEO)
*Zadania z tej fazy chronią aplikację przed nadużyciami i zapewniają jej widoczność w wyszukiwarkach.*

| ID | Zadanie | Opis | Zależności | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1.1** | **Zabezpieczenie publicznych API (Rate Limiting)** | Wdrożenie mechanizmu ograniczania liczby zapytań (Rate Limit) dla endpointów `/api/nip`, `/api/contact` oraz `/api/auth/login`. Zapobiegnie to atakom Brute Force oraz wyczerpaniu limitów zewnętrznego API Ministerstwa Finansów. | Brak | ZROBIONE |
| **1.2** | **Wdrożenie `sitemap.ts` i `robots.txt`** | Utworzenie dynamicznej mapy witryny (uwzględniającej strony statyczne, artykuły blogowe i podstrony ofertowe) oraz pliku robots.txt. | Brak | ZROBIONE |

---

## 🟡 FAZA 2: Ważne (Dług Technologiczny i Typowanie)
*Eliminacja błędów typowania, co zapobiegnie błędom runtime podczas dalszego rozwoju.*

| ID | Zadanie | Opis | Zależności | Status |
| :--- | :--- | :--- | :--- | :--- |
| **2.1** | **Bezpieczne typowanie ikon (Lucide)** | Usunięcie `(Icons as any)[iconName]` w komponentach (np. `CardEditor.tsx`, `ModalList.tsx`). Zastąpienie tego bezpiecznym mapowaniem za pomocą `keyof typeof Icons`. | Brak | ZROBIONE |
| **2.2** | **Ścisłe typowanie w Zustand Slices** | Usunięcie rzutowań `as any` w plikach `pagesSlice.ts`, `blogSlice.ts` i `contentSlice.ts`. | Brak | ZROBIONE |
| **2.3** | **Refaktoryzacja `MigrationService.ts`** | Przepisanie logiki migracji starych danych CMS na nowe struktury bez użycia `as any`. | Wymaga 2.1 i 2.2 | ZROBIONE |
| **2.4** | **Audyt optymalizacji obrazów** | Przegląd komponentów wyświetlających grafikę i upewnienie się, że używają `next/image` zamiast tagów `<img>`. | Brak | ZROBIONE |

---

## 🟢 FAZA 3: Utrzymanie (Architektura UI i Czystość Kodu)
*Zadania poprawiające czytelność kodu (Developer Experience).*

| ID | Zadanie | Opis | Zależności | Status |
| :--- | :--- | :--- | :--- | :--- |
| **3.1** | **Dekompozycja `TargetAudienceSection.tsx`** | Rozbicie pliku (ponad 420 linii) na mniejsze sub-komponenty. | Brak | ZROBIONE |
| **3.2** | **Dekompozycja `CMSManager.tsx`** | Wydzielenie logiki renderowania poszczególnych sekcji CMS do osobnych plików. | Brak | ZROBIONE |
