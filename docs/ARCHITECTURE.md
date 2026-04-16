# Architektura Danych CMS (Optymalizacja N+1)

## Wprowadzenie
Aplikacja korzysta z architektury "Single Source of Truth" opartej na pliku JSON (lub odpowiedzi z Apps Script). Wraz ze wzrostem liczby artykułów na blogu, pobieranie całego obiektu stało się wąskim gardłem wydajnościowym (problem N+1).

Aby temu zaradzić, wprowadzono podział na dwa typy widoków danych: **Full Content Object** oraz **Index Content Object**.

## Przepływ Danych (Data Flow)

1. **Zapis (CMS Panel):** Administrator edytuje treści i zapisuje je. Aplikacja wysyła pełny obiekt (`Full Content Object`) do backendu (Apps Script).
2. **Backend (Apps Script):** Backend zapisuje pełny obiekt jako backup, a następnie generuje odchudzoną wersję (`Index Content Object`), usuwając z postów ciężkie pola (`content`, `faqs`, `seo`).
3. **Odczyt (Frontend - Lista Bloga):** Strona `/blog` odpytuje backend z parametrem `?view=index`. Otrzymuje tylko zajawki postów, co drastycznie zmniejsza rozmiar pobieranych danych.
4. **Odczyt (Frontend - Artykuł):** Strona `/blog/[slug]` odpytuje backend o pełny obiekt (lub robi to w czasie budowania statycznego), aby wyrenderować pełną treść artykułu.

## Struktury Danych (TypeScript Interfaces)

### Pełny Obiekt Posta (PostFull)
```typescript
interface PostFull {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  // Ciężkie pola:
  content: string; // Pełna treść w Markdown
  faqs?: Array<{ question: string; answer: string }>;
  seo?: { title: string; description: string; keywords: string };
}
```

### Odchudzony Obiekt Posta (PostIndex)
```typescript
interface PostIndex {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  // Brak pól: content, faqs, seo
}
```

## Symulacja w Next.js
Do czasu pełnego wdrożenia obsługi parametru `?view=index` po stronie Apps Script, funkcja `fetchContentFromCMS` w `src/services/cmsRepository.ts` symuluje to zachowanie, usuwając ciężkie pola w locie, jeśli zostanie wywołana z argumentem `'index'`.

## Optymalizacja Renderowania (Frontend)

Mimo pobierania odchudzonej listy zapytań (Index Content Object) z backendu, frontend stosuje tradycyjną paginację (stronicowanie) na stronie głównej bloga.

- **Domyślny rozmiar strony (Page Size):** 9 elementów.
- **Mechanizm:** Komponent `Blog` przechowuje w stanie `currentPage` numer aktualnej strony. Na podstawie tego numeru wycinana jest odpowiednia porcja danych z tablicy postów. Zmiana strony powoduje automatyczne przewinięcie widoku na początek sekcji bloga.
- **Uzasadnienie:** Przy dużej liczbie artykułów (50+) stronicowanie zapobiega nieskończonemu wydłużaniu się strony (co blokowałoby dostęp do stopki). Utrzymuje stały, mały rozmiar drzewa DOM (zawsze maksymalnie 9 elementów na ekranie), co poprawia wskaźniki Core Web Vitals (szczególnie TBT - Total Blocking Time) oraz zapewnia płynniejsze działanie interfejsu.

## Dodatek A: Warstwa Abstrakcji Danych (Propozycja 2)

Aby przygotować aplikację na przyszłą migrację z Google Apps Script do relacyjnej bazy danych (np. PostgreSQL), wprowadzono wzorzec Repository Pattern w pliku `src/services/cmsRepository.ts`.

Zamiast pobierać cały obiekt JSON w komponentach, aplikacja korzysta z dedykowanych funkcji symulujących zapytania SQL:
- `getSettings()`: Pobiera tylko ustawienia globalne (bez bloga).
- `getPosts(page, limit)`: Pobiera odchudzoną listę postów i zwraca ją w formacie paginowanym (z metadanymi `totalPosts`, `totalPages`).
- `getPostBySlug(slug)`: Pobiera pełny obiekt CMS, ale zwraca *tylko* dane konkretnego artykułu.

**Korzyść:** Kiedy aplikacja przejdzie na bazę SQL, wystarczy podmienić wnętrze tych funkcji. Kod komponentów React (frontend) nie zmieni się wcale.

## Dodatek B: Docelowa Struktura Relacyjnej Bazy Danych (Propozycja 3)

Poniżej znajduje się docelowy schemat tabel (SQL), który zostanie wdrożony w momencie przejścia na pełnoprawną bazę danych (np. Supabase, Vercel Postgres, Prisma).

### Tabela 1: `GlobalSettings` (Ustawienia globalne)
- `id` (PK)
- `key` (String, Unique) - np. "home_page", "global_seo"
- `value` (JSONB) - elastyczne pole na strukturę

### Tabela 2: `Posts` (Artykuły)
- `id` (PK, UUID)
- `slug` (String, Unique, Index)
- `title` (String)
- `excerpt` (Text)
- `content` (Text) - pełna treść Markdown
- `cover_image_url` (String)
- `status` (Enum: DRAFT, PUBLISHED, ARCHIVED)
- `published_at` (Timestamp)
- `author_id` (FK -> tabela Users)

### Tabela 3: `PostSEO` (Wydzielone SEO)
- `post_id` (FK -> Posts)
- `meta_title` (String)
- `meta_description` (String)
- `keywords` (String)

### Tabela 4: `PostFAQs` (Pytania i odpowiedzi)
- `id` (PK)
- `post_id` (FK -> Posts)
- `question` (String)
- `answer` (Text)
- `order` (Integer)

## Dodatek C: Zabezpieczenia i Zmienne Środowiskowe (Security)

### Zarządzanie kluczem sesji (JWT_SECRET)
Aplikacja wykorzystuje mechanizm Fail-Fast dla kluczowych zmiennych środowiskowych, aby zapobiec lukom bezpieczeństwa na produkcji.

W pliku `src/utils/session.ts` zaimplementowano sprawdzanie wbudowanej zmiennej `NODE_ENV`:
- **Środowisko produkcyjne (`NODE_ENV === 'production'`):** Aplikacja bezwzględnie wymaga ustawienia zmiennej `JWT_SECRET` w panelu hostingowym (np. Vercel, Cloud Run). Jeśli jej brakuje, aplikacja rzuca błąd krytyczny (`throw new Error`) i odmawia uruchomienia menedżera sesji. Zapobiega to przypadkowemu użyciu słabego klucza i sfałszowaniu sesji administratora.
- **Środowisko deweloperskie (lokalne PC):** Aby ułatwić pracę programistom, jeśli `JWT_SECRET` nie jest ustawiony, aplikacja używa klucza tymczasowego i wyświetla jedynie ostrzeżenie w konsoli (`console.warn`). Dzięki temu nie ma konieczności konfigurowania pliku `.env` do podstawowego uruchomienia projektu lokalnie.

## Dodatek D: SEO i Tagi Kanoniczne (Canonical URLs)

Aby zapobiec problemom z duplikacją treści (Duplicate Content) oraz kanibalizacją słów kluczowych wynikającą z parametrów śledzących w adresach URL (np. `?utm_source=facebook`), wdrożono system tagów kanonicznych.

- **Konfiguracja globalna:** W pliku `src/app/layout.tsx` zdefiniowano `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rpms.pl')`. Pozwala to na używanie ścieżek względnych w całej aplikacji.
- **Strony statyczne:** Główne widoki (np. `/`, `/blog`, `/faq`) posiadają statycznie zdefiniowane właściwości `alternates: { canonical: '...' }` w obiektach `Metadata`.
- **Strony dynamiczne (Artykuły):** W pliku `src/app/(marketing)/blog/[slug]/page.tsx` tag kanoniczny jest generowany dynamicznie na podstawie sluga artykułu (`alternates: { canonical: \`/blog/${slug}\` }`). Gwarantuje to, że niezależnie od parametrów doklejonych do linku, wyszukiwarki zawsze indeksują właściwy, czysty adres URL.

## Dodatek E: Optymalizacja Nagłówków (SEO H1-H6)

W celu zachowania poprawnej hierarchii nagłówków i uniknięcia błędu "wielu tagów H1" na stronach artykułów, wdrożono następujące mechanizmy:

- **Edytor CMS (Toolbar):** Z paska narzędzi edytora Markdown usunięto przycisk wstawiania nagłówka H1 (`# `), zastępując go nagłówkami H2 (`## `) i H3 (`### `).
- **Walidacja w czasie rzeczywistym:** Jeśli redaktor ręcznie wpisze nagłówek H1 w treści artykułu, pod edytorem wyświetli się ostrzeżenie o złamaniu zasad SEO.
- **Automatyczna degradacja (Frontend Fallback):** Komponent `<ReactMarkdown>` na stronie artykułu (`src/app/(marketing)/blog/[slug]/page.tsx`) został skonfigurowany tak, aby w locie zamieniać wszystkie tagi `<h1>` na `<h2>` (`components={{ h1: 'h2' }}`). Gwarantuje to, że jedynym tagiem H1 na stronie pozostaje główny tytuł artykułu, co jest kluczowe dla pozycjonowania (SEO).
