# Ograniczenia Cyklu Życia Sprawy (Security & Integrity)

**Data dokumentu:** 2026-03-17
**Status:** Zaimplementowano

## Opis Funkcjonalności
Wprowadzono systemową blokadę usuwania spraw, które zostały już przekazane do obsługi prawnej (etap po analizie wstępnej).

## Cel Biznesowy
Zapewnienie spójności danych pomiędzy panelem klienta a systemem operacyjnym kancelarii. 
- Zapobieganie usuwaniu spraw, w których podjęto już formalne kroki prawne (np. wysłano wezwanie do zapłaty).
- Ochrona historii procesowej i dowodowej.
- Wymuszenie kontaktu z opiekunem prawnym w przypadku chęci wycofania sprawy będącej w toku.

## Szczegóły Implementacji

### 1. Komponent `CaseCard`
Zastosowano warunkowe renderowanie przycisku "Usuń Sprawę" w oparciu o aktualny etap sprawy (`safeIdx`).
- **Etap 0 (Analiza):** Przycisk jest widoczny. Użytkownik może usunąć sprawę, jeśli np. popełnił błąd przy wprowadzaniu danych przed jej formalnym uruchomieniem.
- **Etapy 1-4 (Wezwanie, Negocjacje, Sąd, Odzyskano):** Przycisk jest ukryty. Sprawa staje się "nieusuwalna" z poziomu interfejsu klienta.

## Pliki Zmodyfikowane
- `src/entities/case/ui/CaseCard.tsx`
