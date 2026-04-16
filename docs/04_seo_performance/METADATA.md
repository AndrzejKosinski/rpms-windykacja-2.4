# Strategia SEO i Metadane (v10.3.0)

Dokument opisuje podejście do optymalizacji pod kątem wyszukiwarek (SEO) w projekcie RPMS. Został zaktualizowany zgodnie z najnowszym planem wdrożenia zaawansowanego SEO.

## 1. Dynamiczne Metadane
Aplikacja korzysta z wbudowanego w Next.js systemu metadanych. Tytuły, opisy oraz słowa kluczowe są pobierane dynamicznie z CMS.

- **Root Layout**: Definiuje domyślne metadane (np. nazwę firmy, szablon tytułu).
- **Dynamiczne strony**: Każda podstrona może nadpisać metadane za pomocą funkcji `generateMetadata()`.

## 2. Open Graph i Social Media
Dla każdej strony generowane są tagi Open Graph (OG), które odpowiadają za wygląd linków w mediach społecznościowych (Facebook, LinkedIn, Twitter).
- **OG Image**: Obrazek wyróżniający pobierany z CMS lub domyślny logotyp.
- **OG Title/Description**: Zsynchronizowane z metadanymi SEO.

## 3. Struktura Nagłówków (H1-H6)
Komponenty marketingowe są zaprojektowane tak, aby zachować hierarchię semantyczną:
- **H1**: Zawsze tylko jeden na stronie (zazwyczaj w sekcji Hero).
- **H2-H3**: Używane w sekcjach Features, Services, About.
- **H4+**: Używane wewnątrz kart i mniejszych elementów.

## 4. Sitemapy i Robots.txt
Aplikacja automatycznie generuje:
- `sitemap.xml`: Dynamiczna mapa witryny (`src/app/sitemap.ts`). Pobiera listę wszystkich aktywnych artykułów z bloga i przypisuje im odpowiedni priorytet oraz datę modyfikacji.
- `robots.txt`: Instrukcje dla robotów (`src/app/robots.ts`). Kategorycznie blokuje indeksowanie wrażliwych ścieżek, takich jak `/panel/`, `/auth/`, `/api/` oraz `/cms/`.

## 5. JSON-LD (Structured Data)
Wdrożono dane strukturalne (Schema.org), aby pomóc Google zrozumieć zawartość strony i umożliwić wyświetlanie "Rich Snippets":
- **Strona główna (`/`)**: Schemat `Organization` (dane firmy, kontakt, logo).
- **Strony blogowe (`/blog/[slug]`)**: Schemat `BlogPosting` (autor, data publikacji, obrazek) oraz `BreadcrumbList`.
- **Strona FAQ (`/faq`)**: Schemat `FAQPage` (pytania i odpowiedzi).
