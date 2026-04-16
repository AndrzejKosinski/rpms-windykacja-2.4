# Faza 1: Onboarding i Fundamenty

**Cel:** Szybkie uruchomienie środowiska deweloperskiego i zrozumienie celu biznesowego.

W tej sekcji znajdziesz informacje niezbędne do rozpoczęcia pracy z projektem RPMS:

- [**SETUP.md**](./SETUP.md) - Instrukcja instalacji, konfiguracja zmiennych środowiskowych (`.env`), komendy startowe.
- [**WORKFLOW.md**](./WORKFLOW.md) - Proces pracy (git flow, konwencje nazewnictwa, GitOps).
- [**TESTING.md**](./TESTING.md) - Procedury testowe i weryfikacja poprawności działania systemu.

## Kluczowe założenia
Projekt RPMS opiera się na architekturze hybrydowej, gdzie dane są pobierane z Google Apps Script, ale aplikacja posiada pełną kopię zapasową (fallback) w kodzie źródłowym, co gwarantuje 100% dostępności nawet w przypadku awarii backendu.
