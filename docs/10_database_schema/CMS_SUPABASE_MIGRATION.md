# Model Danych CMS - Migracja do Supabase (PostgreSQL)

Dokument opisuje strukturę relacyjnej bazy danych PostgreSQL, która zastępuje dotychczasowy model oparty na Google Apps Script (`RPMS_CMS_DATABASE` / JSON).

## 1. Moduł: Baza Wiedzy i Podstrony

### Tabela: `pages`
Przechowuje statyczne podstrony (np. O nas, Kontakt).
- `id` (UUID, Primary Key, Default: uuid_generate_v4())
- `slug` (VARCHAR, Unique) - Przyjazny adres URL
- `title` (VARCHAR)
- `content` (TEXT) - Treść HTML/Markdown
- `is_published` (BOOLEAN, Default: false)
- `seo_title` (VARCHAR)
- `seo_description` (TEXT)
- `seo_keywords` (TEXT)
- `created_at` (TIMESTAMPTZ, Default: now())
- `updated_at` (TIMESTAMPTZ, Default: now())

### Tabela: `blog_posts`
Przechowuje artykuły bazy wiedzy.
- `id` (UUID, Primary Key, Default: uuid_generate_v4())
- `slug` (VARCHAR, Unique)
- `title` (VARCHAR)
- `excerpt` (TEXT)
- `content` (TEXT)
- `image_url` (VARCHAR)
- `image_alt` (VARCHAR)
- `category` (VARCHAR)
- `author` (VARCHAR)
- `status` (VARCHAR) - 'published' | 'draft'
- `published_at` (TIMESTAMPTZ)
- `seo_title` (VARCHAR)
- `seo_description` (TEXT)
- `seo_keywords` (TEXT)
- `json_ld` (JSONB)
- `created_at` (TIMESTAMPTZ, Default: now())
- `updated_at` (TIMESTAMPTZ, Default: now())

### Tabela: `blog_faqs`
Sekcja Q&A przypisana do konkretnych artykułów.
- `id` (UUID, Primary Key, Default: uuid_generate_v4())
- `post_id` (UUID, Foreign Key -> blog_posts.id, On Delete Cascade)
- `question` (TEXT)
- `answer` (TEXT)
- `order_index` (INTEGER)

## 2. Moduł: Sekcje Dynamiczne (Strona Główna)

### Tabela: `modals`
Centralna baza okien modalnych wykorzystywanych w różnych sekcjach.
- `id` (UUID, Primary Key, Default: uuid_generate_v4())
- `section` (VARCHAR) - np. 'why_us', 'target_audience'
- `internal_name` (VARCHAR)
- `title` (VARCHAR)
- `subtitle` (VARCHAR)
- `icon` (VARCHAR)
- `image_url` (VARCHAR)
- `benefit` (TEXT)
- `standard` (TEXT)
- `points` (TEXT[]) - Tablica stringów
- `is_visible_in_carousel` (BOOLEAN, Default: false)
- `created_at` (TIMESTAMPTZ, Default: now())
- `updated_at` (TIMESTAMPTZ, Default: now())

### Tabela: `why_us_cards`
Karty w sekcji "Dlaczego My".
- `id` (UUID, Primary Key, Default: uuid_generate_v4())
- `icon` (VARCHAR)
- `title` (VARCHAR)
- `description` (TEXT)
- `assigned_modal_id` (UUID, Foreign Key -> modals.id, Nullable, On Delete Set Null)
- `order_index` (INTEGER)

### Tabela: `target_audience_industries`
Kafelki branż w sekcji "Grupa Docelowa".
- `id` (UUID, Primary Key, Default: uuid_generate_v4())
- `name` (VARCHAR)
- `description` (TEXT)
- `assigned_modal_id` (UUID, Foreign Key -> modals.id, Nullable, On Delete Set Null)
- `order_index` (INTEGER)

## 3. Moduł: Nawigacja i Stopka

### Tabela: `footer_columns`
- `id` (UUID, Primary Key, Default: uuid_generate_v4())
- `title` (VARCHAR)
- `order_index` (INTEGER)

### Tabela: `footer_links`
- `id` (UUID, Primary Key, Default: uuid_generate_v4())
- `column_id` (UUID, Foreign Key -> footer_columns.id, On Delete Cascade)
- `label` (VARCHAR)
- `url` (VARCHAR)
- `is_external` (BOOLEAN, Default: false)
- `page_id` (UUID, Foreign Key -> pages.id, Nullable, On Delete Set Null)
- `order_index` (INTEGER)

## 4. Moduł: Ustawienia Globalne i DDS

### Tabela: `global_settings`
Przechowuje konfiguracje typu Singleton (występujące tylko raz).
- `key` (VARCHAR, Primary Key) - np. 'company_info', 'contact_bar', 'hero_section'
- `value` (JSONB) - Struktura danych

### Tabela: `dds_config`
Dynamic Design System - konfiguracja wizualna aplikacji.
- `id` (UUID, Primary Key, Default: uuid_generate_v4())
- `version` (INTEGER, Default: 1)
- `theme_data` (JSONB) - Pełny obiekt theme.json
- `created_at` (TIMESTAMPTZ, Default: now())
- `is_active` (BOOLEAN, Default: true)
