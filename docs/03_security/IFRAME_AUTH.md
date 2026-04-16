# Autoryzacja w Środowisku Iframe

Dokument opisuje specyficzne wyzwania i rozwiązania dotyczące autoryzacji użytkowników w aplikacji RPMS działającej wewnątrz iframe (np. w podglądzie AI Studio).

## 1. Problem Third-Party Cookies
Większość nowoczesnych przeglądarek blokuje ciasteczka stron trzecich (third-party cookies) wewnątrz iframe. Jeśli aplikacja Next.js próbuje ustawić ciasteczko sesyjne (`cms_session`) podczas działania w iframe innej domeny, ciasteczko to może zostać zablokowane.

## 2. Rozwiązanie: SameSite=None i Secure
Aby umożliwić działanie ciasteczek w iframe, muszą one posiadać atrybuty:
- `SameSite=None`
- `Secure` (wymaga HTTPS)

W projekcie RPMS konfiguracja ta jest sterowana zmienną środowiskową `ALLOW_IFRAME_AUTH=true`.

## 3. Middleware i Przekierowania
Middleware w Next.js sprawdza obecność ciasteczka `cms_session`. W środowisku iframe, jeśli ciasteczko nie zostanie przesłane, użytkownik zostanie przekierowany na stronę główną.

### Debugowanie w AI Studio:
Jeśli po poprawnym zalogowaniu system nadal przekierowuje Cię na stronę główną:
1. Sprawdź, czy `ALLOW_IFRAME_AUTH` jest ustawione na `true`.
2. Upewnij się, że Twoja przeglądarka nie blokuje ciasteczek dla domeny `.run.app`.
3. Spróbuj otworzyć aplikację w nowej karcie (poza iframe).

## 4. Bezpieczeństwo
Użycie `SameSite=None` zwiększa ryzyko ataków CSRF. Dlatego:
- Wszystkie API Routes w `/panel` wymagają dodatkowej walidacji.
- Ciasteczko sesyjne jest `HttpOnly`, co uniemożliwia jego odczyt przez JavaScript.
- Zaleca się stosowanie nagłówka `X-Frame-Options: SAMEORIGIN` na produkcji, a zezwalanie na iframe tylko w zaufanych środowiskach deweloperskich.
