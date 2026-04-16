# Architektura CMS (Refaktoryzacja CMSManager)

Ten dokument opisuje nową, modułową architekturę Systemu Zarządzania Treścią (CMS) po refaktoryzacji komponentu `CMSManager.tsx`.

## 1. Cel Refaktoryzacji
Głównym celem było rozbicie "Boskiego Obiektu" (`CMSManager.tsx`), który posiadał ponad 1100 linii kodu, na mniejsze, wyspecjalizowane komponenty. Poprawia to:
- **Testowalność**: Możliwość testowania poszczególnych sekcji CMS niezależnie.
- **Wydajność**: Ograniczenie niepotrzebnych re-renderów całego panelu przy edycji małych pól.
- **Utrzymanie**: Łatwiejsza orientacja w kodzie i szybsze wprowadzanie zmian.

## 2. Struktura Komponentów
Nowa struktura znajduje się w `src/views/dashboard/ui/cms/`:

### Główne Komponenty:
- **`CMSManager.tsx`**: Główny kontener (Orkiestrator). Zarządza nawigacją między sekcjami i synchronizacją stanu globalnego.
- **`CMSSidebar.tsx`**: Pasek boczny z nawigacją po sekcjach (SEO, Hero, Blog).
- **`useCMSActions.ts`**: Custom Hook zawierający całą logikę biznesową (zapis, usuwanie, integracja z AI).

### Sekcje Edycji:
- **`SectionSEO.tsx`**: Formularze do edycji Meta Title, Description i Keywords dla strony głównej i listy bloga.
- **`SectionHero.tsx`**: Edytor treści sekcji Hero (tytuł, opis, badge).
- **`BlogList.tsx`**: Tabela z listą artykułów, filtrowaniem, wyszukiwarką i akcjami masowymi.
- **`BlogEditor.tsx`**: Pełny edytor artykułu z obsługą Markdown i SEO dla wpisu.

### Modale (UI):
- **`ImagePickerModal.tsx`**: Integracja z Unsplash API do wyboru zdjęć.
- **`AIReviewModal.tsx`**: Interfejs do przeglądu i akceptacji sugestii SEO od Gemini AI.
- **`DeleteConfirmModal.tsx`**: Uniwersalne okno potwierdzenia usunięcia.

## 3. Przepływ Danych (Data Flow)
1. Dane są pobierane z `AppContext` (który synchronizuje się z bazą danych).
2. `CMSManager` tworzy lokalną kopię stanu (`localContent`), aby umożliwić edycję bez natychmiastowego zapisu.
3. Zmiany w komponentach dzieciach są przekazywane w górę za pomocą funkcji `handleFieldChange` lub `handleBlogChange`.
4. Po kliknięciu "Zapisz", dane są wysyłane do API i aktualizują stan globalny w `AppContext`.

## 4. Rozbudowa
Aby dodać nową sekcję do CMS:
1. Dodaj nową wartość do stanu `activeSection`.
2. Stwórz nowy komponent w `components/Section[Nazwa].tsx`.
3. Dodaj przycisk nawigacyjny w `CMSSidebar.tsx`.
4. Zaktualizuj `CMSManager.tsx`, aby renderował nową sekcję.
