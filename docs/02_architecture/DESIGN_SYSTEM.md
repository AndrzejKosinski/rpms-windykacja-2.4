# Design System & Visual Identity RPMS Windykacja

Dokument opisuje standardy wizualne, typograficzne oraz hierarchię elementów interfejsu platformy RPMS Windykacja.

## 1. Paleta Kolorystyczna (Color Palette)
System opiera się na profesjonalnej, "prawniczo-technologicznej" palecie barw budującej autorytet i nowoczesny wizerunek.

- **Primary Navy (`brand-navy`)**: `#0a2e5c`
  - Zastosowanie: Główny kolor tła (sekcje hero, stopka, sidebar), nagłówki wysokiego stopnia, przyciski pomocnicze.
- **Action Blue (`brand-blue`)**: `#137fec`
  - Zastosowanie: Główny kolor akcji (CTA), podkreślenia marketingowe, ikony aktywne, stany hover.
- **Subtle Blue (`brand-light-blue`)**: `#e0f2fe`
  - Zastosowanie: Tła dla odznak (badges), subtelne gradienty, tła ikon w listach.
- **Skala Slate (Tailwind Default)**:
  - `#f8fafc` (`slate-50`): Główne tło sekcji jasnych.
  - `#94a3b8` (`slate-400`): Teksty pomocnicze, opisy (labels).
  - `#1e293b` (`slate-800`): Ciemne warianty przycisków i teksty body.
- **Kolory semantyczne**:
  - **Success Green**: `#22c55e` (Statusy egzekucji, aktywne sesje).
  - **Warning Amber**: `#f59e0b` (Powiadomienia o braku płatności/uwaga).

## 2. Typografia (Typography)
Wykorzystywana jest nowoczesna rodzina fontów **Manrope**, różnicowana poprzez skrajne grubości dla uzyskania silnej hierarchii.

- **Rodzina fontów**: Manrope (Google Fonts).
- **Grubości (Font Weights)**:
  - `font-black` (800/900): Hasła marketingowe i kluczowe liczby.
  - `font-extrabold` (700/800): Nagłówki sekcji, główne przyciski CTA.
  - `font-bold` (600): Podtytuły, nazwy dłużników w listach, nawigacja.
  - `font-medium` (500): Tekst ciągły (body text), opisy w kartach.

## 3. Hierarchia Wielkości (Scale & Hierarchy)
### A. Nagłówki (Headings)
- **H1 (Hero)**: 3xl (mobile) do 7xl (desktop) (~72px). Tracking-tight, leading-[1.1].
- **H2 (Section Title)**: 4xl do 6xl (~60px).
- **H3 (Card Titles)**: 2xl do 3xl (~30px).

### B. Tekst body i UI
- **Body Lead**: xl (~20px) – opisy bezpośrednio pod nagłówkami.
- **Standard Body**: base (16px) lub sm (14px).
- **Labels / Badges**: [10px] lub [11px]. Zawsze uppercase, font-black, tracking-[0.2em].

## 4. Wymiary Okien i Modali
- **Główny Wizard Windykacji**: `max-width: 1024px`, stała wysokość na desktop: `720px`.
- **Moduł Analizy Eksperckiej**: `max-width: 1000px`, min-height: `600px`. Układ 1/3 (Sidebar) | 2/3 (Formularz).
- **Konsultacja z Mecenasem**: `max-width: 900px`. Układ 2/5 (Profil) | 3/5 (Czat/Formularz).
- **Briefy Branżowe i USP**: `max-width: 850px`, wysokość: `720px`. Układ 3/5 (Treść) | 2/5 (Obraz).

## 5. Elementy Interfejsu (UI Elements)
- **Zaokrąglenia (Border Radius)**:
  - `rounded-[48px]` / `rounded-[60px]`: Duże kontenery sekcji i modale.
  - `rounded-[32px]`: Karty spraw, dashboard stats.
  - `rounded-xl` / `rounded-2xl`: Przyciski, pola formularzy, nawigacja.
- **Cienie (Shadows)**:
  - `shadow-brand-blue/20`: Przyciski akcji blue.
  - `shadow-brand-navy/10-20`: Przyciski navy i karty dokumentów.
- **Odstępy (Spacing)**:
  - Standardowe paddingi sekcji: `py-24` (96px) lub `py-32` (128px).
  - Maksymalna szerokość kontenera: `1440px`.

## Podsumowanie Stylu
Design RPMS Windykacja definiowany jest jako **"Corporate Modern"** – łączy elegancję tradycyjnej kancelarii z agresywnym, nowoczesnym layoutem typu SaaS.
