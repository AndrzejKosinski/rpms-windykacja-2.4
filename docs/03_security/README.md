# Faza 3: Bezpieczeństwo

**Cel:** Zapewnienie ochrony danych, bezpieczny dostęp do panelu administratora oraz walidacja wszystkich danych wejściowych.

Bezpieczeństwo w projekcie RPMS opiera się na trzech filarach:

- [**SECURITY.md**](./SECURITY.md) - Ogólna strategia bezpieczeństwa, lista zagrożeń i mechanizmy obronne (OWASP Top 10).
- [**AUTHENTICATION.md**](./AUTHENTICATION.md) - Szczegóły techniczne ochrony panelu `/panel`, obsługa JWT oraz Middleware.
- [**VALIDATION.md**](./VALIDATION.md) - Walidacja danych za pomocą Zod, ochrona API Routes oraz bezpieczne zarządzanie kluczami API.
- [**GDPR.md**](./GDPR.md) - Zgodność z RODO, lokalizacja danych i zasady minimalizacji ryzyka.
- [**IFRAME_AUTH.md**](./IFRAME_AUTH.md) - Specyfika autoryzacji w środowisku iframe i obsługa ciasteczek.

## Kluczowa Zasada
Stosujemy zasadę "Zero Trust" w komunikacji z zewnętrznymi API oraz rygorystyczną walidację po stronie serwera dla wszystkich operacji zapisu.
