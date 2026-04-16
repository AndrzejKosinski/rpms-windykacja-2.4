# Plan Migracji Bazy Danych i Architektury CMS

## 1. Wstęp i Cel Migracji
Obecnie aplikacja RPMS CMS działa w oparciu o prototypowy backend wykorzystujący Google Apps Script (GAS). Cały stan aplikacji (ustawienia, artykuły, układ strony, FAQ) przechowywany jest w postaci jednego, monolitycznego obiektu JSON. 

Głównym celem migracji jest przejście na pełnoprawną, relacyjną (np. PostgreSQL) lub dokumentową (np. MongoDB/Firebase) bazę danych. Zapewni to:
* Skalowalność i wydajność (pobieranie tylko potrzebnych danych, a nie całego JSON-a).
* Bezpieczeństwo danych przy pracy wielu administratorów.
* Możliwość zaawansowanego filtrowania, sortowania i paginacji po stronie serwera.

## 2. Obecna vs Docelowa Struktura Danych

### Stan obecny (Monolit JSON)
Wszystkie dane znajdują się w jednym obiekcie `siteContent`:
- `blog` (tablica artykułów)
- `pageLayout` (tablica sekcji)
- `faqs` (tablica pytań i odpowiedzi)
- `seo` (ustawienia globalne SEO)
- inne ustawienia globalne (np. nazwa firmy, kontakt)

### Stan docelowy (Znormalizowane Tabele/Kolekcje)
Podczas migracji monolit zostanie rozbity na niezależne encje. Poniżej proponowana struktura (na przykładzie bazy relacyjnej SQL):

#### Tabela: `users`
- `id` (UUID, PK)
- `email` (String, Unique)
- `role` (Enum: ADMIN, USER)
- `created_at` (Timestamp)

#### Tabela: `global_settings`
- `id` (UUID, PK)
- `key` (String, Unique) - np. 'seo_defaults', 'company_info'
- `value` (JSONB)
- `version` (Int) - *Dla mechanizmu OCC*
- `updated_at` (Timestamp)

#### Tabela: `posts` (Artykuły Blogowe)
- `id` (UUID, PK)
- `slug` (String, Unique)
- `title` (String)
- `content` (Text/JSON)
- `status` (Enum: DRAFT, PUBLISHED)
- `author_id` (UUID, FK -> users.id)
- `version` (Int) - *Dla mechanizmu OCC*
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### Tabela: `page_layouts` (Układ Strony)
- `id` (UUID, PK)
- `section_id` (String)
- `component_name` (String)
- `is_visible` (Boolean)
- `sort_order` (Int)
- `version` (Int) - *Dla mechanizmu OCC*

#### Tabela: `faqs`
- `id` (UUID, PK)
- `question` (String)
- `answer` (Text)
- `sort_order` (Int)
- `version` (Int) - *Dla mechanizmu OCC*

## 3. Zarządzanie stanem CMS przy wielu administratorach (Problem "Lost Update")

Największym zagrożeniem w obecnej architekturze jest problem "Lost Update" (utrata aktualizacji). Kiedy dwóch administratorów edytuje CMS w tym samym czasie, ten, który zapisze zmiany jako drugi, bezpowrotnie nadpisze pracę pierwszego, ponieważ wysyła do bazy cały, stary stan JSON-a.

### Rozwiązanie: Optimistic Concurrency Control (OCC)
Aby temu zapobiec w nowej bazie danych, wdrożony zostanie mechanizm Optymistycznej Kontroli Współbieżności.

**Jak to będzie działać w praktyce?**
1. **Odczyt:** Admin A pobiera artykuł do edycji. Otrzymuje dane oraz aktualną wersję rekordu (np. `version: 1`).
2. **Zapis:** Admin A kończy edycję i wysyła żądanie `PUT /api/posts/123`. W payloadzie załącza `version: 1`.
3. **Weryfikacja w bazie:** Serwer wykonuje zapytanie:
   `UPDATE posts SET content = '...', version = version + 1 WHERE id = 123 AND version = 1;`
4. **Sukces:** Jeśli rekord został zaktualizowany, wszystko jest w porządku.
5. **Konflikt:** Jeśli w międzyczasie Admin B zapisał ten sam artykuł (podnosząc jego wersję w bazie na `2`), zapytanie Admina A zaktualizuje `0` wierszy (ponieważ `WHERE version = 1` nie znajdzie dopasowania). 
6. **Obsługa błędu:** Serwer zwraca błąd `409 Conflict`. Frontend wyświetla komunikat: *"Ktoś inny zmodyfikował ten artykuł w międzyczasie. Odśwież stronę, aby pobrać najnowszą wersję."*

## 4. Etapy Migracji

1. **Faza 1: Modelowanie i Setup Bazy**
   - Wybór technologii (np. PostgreSQL + Prisma ORM lub Supabase).
   - Utworzenie schematów bazy danych (migracje) uwzględniających kolumny `version` dla OCC.
2. **Faza 2: Przepisanie Warstwy API (Backend)**
   - Zastąpienie wywołań do Google Apps Script w `src/app/api/content/route.ts` bezpośrednimi połączeniami do nowej bazy danych.
   - Wdrożenie obsługi błędów 409 Conflict dla mechanizmu OCC.
3. **Faza 3: Adaptacja Frontendu**
   - Modyfikacja `CMSManager.tsx` i `AppContext.tsx`. Zamiast trzymać jeden globalny stan `siteContent`, aplikacja będzie pobierać i aktualizować poszczególne encje niezależnie (np. osobny zapis dla artykułu, osobny dla ustawień).
   - Dodanie obsługi błędów konfliktów w interfejsie użytkownika.
4. **Faza 4: Skrypt Migracyjny (Data Transfer)**
   - Napisanie jednorazowego skryptu (np. w Node.js), który pobierze aktualny plik JSON z GAS i zmapuje go na nowe tabele relacyjne, zachowując spójność danych.

## 5. Podsumowanie i Rekomendacja

Migracja do prawdziwej bazy danych w 90% rozwiąże problem "Lost Update" już samym faktem podziału monolitycznego JSON-a na osobne rekordy (tabele/kolekcje).

**Rekomendacja na przyszłość:**
Podczas projektowania docelowej bazy danych i nowego backendu, bezwzględnie zaplanuj wdrożenie mechanizmu OCC (Optimistic Concurrency Control) – czyli dodanie kolumny `version` do każdej tabeli, która może być edytowana w CMS. Jest to standard branżowy, który jest tani w implementacji, a w 100% chroni przed nadpisaniem pracy drugiego człowieka w przypadku edycji tego samego rekordu.
