# Specyfikacja Modułu Podstron i Dynamicznej Stopki (CMS)

**Data utworzenia:** 2026-04-09
**Status:** Zatwierdzone / Oczekuje na wdrożenie

Dokument ten opisuje architekturę, strukturę danych oraz plan wdrożenia dla systemu zarządzania dynamicznymi podstronami (np. Polityka Prywatności, Regulamin) oraz w pełni edytowalnym menu stopki w panelu administratora RPMS.

---

## 1. Struktura Danych (Model)

Poniższa struktura zostanie dodana do głównego stanu CMS (`siteContent`). W przyszłości (po migracji na bazę SQL) obiekty te zostaną zmapowane na odpowiednie tabele (np. `Pages`, `Navigation`).

```json
{
  "pages": [
    {
      "id": "page_123",
      "slug": "polityka-prywatnosci",
      "title": "Polityka Prywatności",
      "content": "<p>Treść strony w formacie HTML z edytora TipTap...</p>", 
      "seo": { 
        "title": "Polityka Prywatności - RPMS", 
        "description": "Zasady przetwarzania danych osobowych..." 
      },
      "isPublished": true,
      "createdAt": "2026-04-09T10:00:00Z",
      "updatedAt": "2026-04-09T10:00:00Z"
    }
  ],
  "footer": {
    "columns": [
      {
        "id": "col_1",
        "title": "Informacje prawne",
        "links": [
          { 
            "id": "link_1", 
            "label": "Polityka Prywatności", 
            "url": "/polityka-prywatnosci", 
            "isExternal": false,
            "pageId": "page_123" // Opcjonalne powiązanie z konkretną podstroną
          },
          { 
            "id": "link_2", 
            "label": "Regulamin", 
            "url": "/regulamin", 
            "isExternal": false,
            "pageId": "page_124"
          }
        ]
      }
    ],
    "socialMedia": {
      "linkedin": "https://linkedin.com/company/rpms",
      "facebook": "https://facebook.com/rpms"
    }
  }
}
```

---

## 2. Architektura Frontend (Next.js)

1. **Dynamiczny Routing:** 
   Utworzenie pliku `src/app/[slug]/page.tsx`. Będzie on odpowiedzialny za przechwytywanie adresów URL (np. `/polityka-prywatnosci`), wyszukiwanie odpowiedniego obiektu w tablicy `pages` i renderowanie jego zawartości (`content`).
2. **Dynamiczna Stopka:** 
   Modyfikacja komponentu `src/widgets/marketing/ui/Footer.tsx`. Zastąpienie statycznych linków mapowaniem po obiekcie `siteContent.footer.columns`.

---

## 3. Architektura Panelu Administratora

1. **Moduł "Podstrony":**
   - Tabela z listą stron (Tytuł, Slug, Status).
   - Edytor WYSIWYG oparty na bibliotece **TipTap** (już obecnej w `package.json`).
   - Automatyczny generator przyjaznych adresów URL (Slug) na podstawie tytułu.
2. **Moduł "Stopka i Nawigacja":**
   - Interfejs do zarządzania kolumnami (dodawanie/usuwanie/zmiana nazwy).
   - Kreator linków wewnątrz kolumn.
   - Dropdown pozwalający na łatwe podpięcie linku do istniejącej podstrony (zamiast ręcznego wpisywania URL).

---

## 4. Plan Wdrożenia (Krok po kroku)

- [ ] **Krok 1:** Rozszerzenie interfejsu TypeScript `CMSContent` o typy dla `pages` i `footer`.
- [ ] **Krok 2:** Zbudowanie dynamicznego widoku `app/[slug]/page.tsx` na frontendzie.
- [ ] **Krok 3:** Zbudowanie modułu "Podstrony" w Panelu Admina (z integracją edytora TipTap).
- [ ] **Krok 4:** Zbudowanie modułu "Stopka" w Panelu Admina.
- [ ] **Krok 5:** Podpięcie dynamicznych danych do komponentu `Footer.tsx` na stronie głównej.

---

## 5. Dziennik Aktualizacji (Changelog)

- **2026-04-09:** Utworzenie początkowej specyfikacji i struktury danych.
