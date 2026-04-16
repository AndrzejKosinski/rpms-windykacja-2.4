# Zarządzanie Widocznością Spraw (UX Dashboard)

**Data dokumentu:** 2026-03-17
**Status:** Zaimplementowano

## Opis Funkcjonalności
W celu poprawy doświadczenia użytkownika (UX) i szybszego zapoznania go z dostępnymi opcjami zarządzania sprawami, wprowadzono mechanizm automatycznego rozwijania pierwszej sprawy na liście w panelu klienta.

## Cel Biznesowy
Użytkownik po wejściu w zakładkę "W toku" lub "Zakończone" widzi od razu szczegóły pierwszej sprawy (Action Center), co:
1. Edukuje użytkownika o dostępnych funkcjach (Czat z prawnikiem, Edycja, Dodawanie faktur).
2. Skraca czas potrzebny na wykonanie pierwszej akcji.
3. Nadaje dynamiczny charakter interfejsowi.

## Szczegóły Implementacji

### 1. Komponent `CaseCard`
Dodano opcjonalny parametr `defaultExpanded` do interfejsu `CaseCardProps`.
- Stan `isExpanded` jest inicjalizowany wartością `defaultExpanded`.
- Logika `isNewCase` (etap analizy) nadal wymusza rozwinięcie dla wszystkich nowych spraw, aby przyciągnąć uwagę do wymaganych akcji (np. "Uruchom Windykację").

### 2. Komponent `DashboardView`
Podczas renderowania listy spraw (`filteredDebtors`), przekazywana jest informacja o pozycji elementu:
- Pierwszy element (`index === 0`) otrzymuje `defaultExpanded={true}`.
- Pozostałe elementy są domyślnie zwinięte.

Wprowadzono również inteligentne przełączanie zakładek:
- **Priorytet "Nowe":** Jeśli w systemie znajduje się chociaż jedna nowa sprawa (np. po dodaniu nowej faktury), panel automatycznie ustawia widok na zakładkę "Nowe".
- **Automatyczne przejście do "W toku":** Gdy zakładka "Nowe" staje się pusta (np. po przekazaniu wszystkich spraw do windykacji lub przy logowaniu, gdy nie ma nowych zleceń), system automatycznie przełącza użytkownika na zakładkę "W toku".
- **Logika dynamiczna:** System reaguje na zmiany liczby spraw w czasie rzeczywistym, prowadząc użytkownika do sekcji wymagającej uwagi lub pokazującej postępy.

## Pliki Zmodyfikowane
- `src/entities/case/ui/CaseCard.tsx`
- `src/views/dashboard/ui/DashboardView.tsx`
