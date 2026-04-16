# Faza 2: Architektura i Technologia

**Cel:** Zrozumienie struktury katalogów, wzorców projektowych (Next.js App Router) oraz obecnego rozwiązania hybrydowego CMS.

W tej sekcji znajdziesz szczegółowe informacje o tym, jak zbudowana jest aplikacja RPMS:

- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Wyjaśnienie struktury `/src` oraz szczegółowy opis architektury hybrydowej.
- [**TECH_STACK.md**](./TECH_STACK.md) - Lista użytych technologii (Next.js 16+, Tailwind CSS v4, Lucide React, Motion).
- [**DESIGN_SYSTEM.md**](./DESIGN_SYSTEM.md) - Standardy wizualne, paleta kolorów i typografia.
- [**COMPONENTS.md**](./COMPONENTS.md) - Wzorce komponentów (Server vs Client Components).
- [**FALLBACK_SYSTEM.md**](./FALLBACK_SYSTEM.md) - Szczegółowy opis działania mechanizmów odporności na awarie.

## Kluczowa Filozofia
Architektura projektu została zaprojektowana tak, aby oddzielić warstwę prezentacji od źródła danych. Dzięki temu aplikacja jest odporna na błędy sieciowe i gotowa na łatwą migrację na dowolny inny backend w przyszłości.
