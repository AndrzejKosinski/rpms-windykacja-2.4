# Utrzymanie i Konserwacja CMS (Maintenance)

Ten dokument opisuje kluczowe aspekty utrzymania Systemu Zarządzania Treścią (CMS) po refaktoryzacji.

## 1. Zarządzanie Stanem (Zasada "Lost Update")
Obecnie cały stan CMS (`siteContent`) jest trzymany w jednym dużym obiekcie JSON.

### Ryzyko:
Jeśli dwóch administratorów edytuje CMS jednocześnie, ostatni zapis nadpisze poprzedni (brak blokad lub wersjonowania).

### Rozwiązanie:
- **Weryfikacja zmian**: Przed zapisem, CMSManager powinien sprawdzić, czy dane w bazie nie uległy zmianie od czasu otwarcia edytora.
- **Powiadomienia**: Wyświetlenie ostrzeżenia, jeśli inny użytkownik aktualnie edytuje tę samą sekcję.

## 2. Limity Firestore (1MB na dokument)
Firestore ma limit 1MB na pojedynczy dokument.

### Ryzyko:
Przy dużej liczbie artykułów blogowych (np. ponad 100 długich wpisów z JSON-LD), cały obiekt `siteContent` może przekroczyć ten limit.

### Rozwiązanie:
- **Migracja do osobnych dokumentów**: Każdy artykuł blogowy powinien być osobnym dokumentem w kolekcji `blog_posts`.
- **Lazy Loading**: Pobieranie listy artykułów (tylko meta dane) i ładowanie pełnej treści dopiero po otwarciu edytora konkretnego posta.

## 3. Edytor Markdown i Toolbar
Edytor treści korzysta z biblioteki `react-markdown` i `remark-gfm`.

### Konserwacja:
- **Aktualizacja Toolbara**: Jeśli potrzebny jest nowy format (np. tabela), należy dodać przycisk w `MarkdownToolbar.tsx` i zaktualizować funkcję `insertMarkdown`.
- **Weryfikacja SEO**: Należy regularnie sprawdzać, czy autorzy nie używają nagłówka H1 (#) w treści artykułu (tytuł artykułu jest już nagłówkiem H1).

## 4. Monitoring i Błędy
Wszystkie błędy w API CMS są logowane do konsoli serwera (`console.error`).

### Rozszerzenie:
- **Sentry**: Zaleca się wdrożenie Sentry do monitorowania błędów po stronie klienta (np. błędy przy zapisie, błędy AI).
- **Logowanie Zdarzeń**: Każdy zapis w CMS powinien być logowany w bazie danych (kto, kiedy i co zmienił), aby umożliwić audyt zmian.

## 5. Bezpieczeństwo
- **Weryfikacja Sesji**: Każdy endpoint API CMS (`/api/content`, `/api/blog`) musi weryfikować ciasteczko `cms_session` i rolę `ADMIN`.
- **Sanityzacja**: Wszystkie dane wejściowe z formularzy są walidowane za pomocą biblioteki `zod`.
- **Ciasteczka**: Upewnij się, że ciasteczko sesyjne ma flagi `HttpOnly`, `Secure` i `SameSite=None` (dla poprawnego działania w iframe).
