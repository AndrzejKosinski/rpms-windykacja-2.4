# API Endpoints

## Wewnętrzne API Next.js

### `GET /api/content`
Pobiera dane CMS.
- **Parametry zapytania (Query Parameters):**
  - `view` (opcjonalny): `'full' | 'index'`. Domyślnie `'full'`. Jeśli `'index'`, API powinno zwrócić odchudzoną wersję danych (bez pełnych treści artykułów).
- **Zwraca:** Obiekt JSON z danymi CMS.

### `POST /api/content`
Zapisuje dane CMS lub inicjalizuje bazę. Wymaga uprawnień administratora.
- **Body:**
  - `action`: `'UPDATE_CMS' | 'INITIALIZE_CMS'`
  - `data`: Pełny obiekt danych CMS.

## Zewnętrzne API (Google Apps Script)

### `GET ?action=GET_CMS&apiKey={API_KEY}&view={VIEW}`
- **Parametry:**
  - `action`: `'GET_CMS'`
  - `apiKey`: Klucz API do weryfikacji.
  - `view` (opcjonalny): `'full' | 'index'`. Jeśli `'index'`, Apps Script powinien zwrócić odchudzoną listę artykułów (bez `content`, `seo`, `faqs`).
- **Zwraca:** Obiekt JSON.

### `POST`
- **Body:**
  - `action`: `'UPDATE_CMS'`
  - `apiKey`: Klucz API.
  - `data`: Pełny obiekt CMS (zapisywany jako backup i używany do wygenerowania odchudzonej wersji).
