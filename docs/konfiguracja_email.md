# Konfiguracja wysyłki e-mail (SMTP Google) w systemie RPMS

Niniejszy dokument opisuje proces konfiguracji wysyłki wiadomości e-mail z formularzy kontaktowych w systemie RPMS, z wykorzystaniem serwerów SMTP firmy Google (konta prywatne `@gmail.com` oraz firmowe Google Workspace).

## 1. Wprowadzenie i Architektura

System RPMS wykorzystuje bibliotekę **Nodemailer** w ramach środowiska Next.js (API Routes) do obsługi wysyłki wiadomości. 

**Priorytetyzacja konfiguracji:**
1. W pierwszej kolejności system próbuje pobrać dane uwierzytelniające SMTP z **Panelu Administratora (CMS)**.
2. Jeśli dane w CMS nie są uzupełnione, system awaryjnie sięga po zmienne środowiskowe z pliku `.env` (`SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL_DESTINATION`).

## 2. Konfiguracja w Panelu Administratora

Aby skonfigurować wysyłkę e-maili z poziomu interfejsu użytkownika:

1. Zaloguj się do **Panelu Administratora**.
2. Przejdź do zakładki **Ustawienia Systemu** (ikona zębatki).
3. Znajdź sekcję **Ustawienia Formularzy / E-mail**.
4. Uzupełnij następujące pola:
   * **Adres docelowy (Odbiorca):** Adres e-mail, na który mają przychodzić zapytania od klientów (np. `biuro@twojafirma.pl`).
   * **Użytkownik SMTP (Nadawca):** Adres e-mail konta Google, z którego fizycznie będą wysyłane wiadomości (np. `powiadomienia@twojafirma.pl` lub Twój prywatny Gmail).
   * **Hasło SMTP (Hasło aplikacji):** Specjalne, 16-znakowe hasło wygenerowane w ustawieniach konta Google (instrukcja poniżej). **Nie używaj tutaj swojego standardowego hasła do konta!**
5. Zapisz zmiany.
6. Użyj przycisku **"Wyślij e-mail testowy"**, aby zweryfikować poprawność wprowadzonych danych.

---

## 3. Instrukcja dla zwykłych kont Google (np. `twojanazwa@gmail.com`)

Google wyłączyło możliwość logowania się do SMTP za pomocą standardowego hasła (opcja "Mniej bezpieczne aplikacje" została wycofana). Aby system mógł wysyłać maile, musisz wygenerować tzw. **Hasło aplikacji**.

**Krok po kroku:**
1. Zaloguj się na swoje konto Google.
2. Włącz **Weryfikację dwuetapową (2FA)** (jeśli jeszcze jej nie masz). Bez tego nie wygenerujesz hasła aplikacji.
3. Przejdź do zarządzania kontem: [Zarządzaj kontem Google](https://myaccount.google.com/) -> zakładka **Bezpieczeństwo**.
4. W sekcji "Sposób logowania się w Google" znajdź **Weryfikacja dwuetapowa** i kliknij w nią (na samym dole tej sekcji znajdziesz **Hasła aplikacji**).
   * *Alternatywnie: Wpisz "Hasła aplikacji" w pasku wyszukiwania na górze ustawień konta Google.*
5. Wybierz aplikację: **Inna (własna nazwa)** i wpisz np. "RPMS System".
6. Kliknij **Wygeneruj**.
7. Skopiuj wygenerowane 16-znakowe hasło (bez spacji) i wklej je w Panelu Administratora RPMS w polu **Hasło SMTP**.

---

## 4. Instrukcja dla kont firmowych Google Workspace (własna domena)

Dla kont firmowych (np. `kontakt@twojadomena.pl` obsługiwanych przez Google) istnieją dwie ścieżki. Zdecydowanie zalecamy Opcję A.

### Opcja A: Hasła aplikacji (Zalecana)
Proces jest identyczny jak dla zwykłego konta Gmail (patrz sekcja 3), **ALE** wymaga wcześniejszej zgody administratora organizacji.

1. Administrator Google Workspace musi wejść do **Konsoli administracyjnej Google** (admin.google.com).
2. Przejść do **Bezpieczeństwo** -> **Uwierzytelnianie** -> **Weryfikacja dwuetapowa**.
3. Zezwolić użytkownikom na włączanie weryfikacji dwuetapowej.
4. Następnie użytkownik konta nadawczego może wygenerować **Hasło aplikacji** zgodnie z instrukcją z Sekcji 3.

### Opcja B: Przekaźnik SMTP (SMTP Relay Service) - Zaawansowane
Używane głównie w dużych organizacjach, gdzie nie chce się generować haseł aplikacji.

1. W Konsoli administracyjnej Google przejdź do **Aplikacje** -> **Google Workspace** -> **Gmail** -> **Routing**.
2. W sekcji **Usługa przekaźnika SMTP** kliknij "Skonfiguruj".
3. Zezwól na przesyłanie wiadomości z określonych adresów IP (musisz podać stały adres IP serwera, na którym hostowana jest aplikacja RPMS).
4. Wymagaj uwierzytelniania SMTP i szyfrowania TLS.
5. W kodzie aplikacji (plik `/api/contact/route.ts`) należałoby wtedy zmienić host na `smtp-relay.gmail.com` oraz port na `587`. *(Uwaga: wymagałoby to modyfikacji kodu źródłowego).*

---

## 5. Rozwiązywanie najczęstszych problemów (Troubleshooting)

* **Błąd: "Authentication failed" (Błąd uwierzytelnienia)**
  * **Przyczyna:** Użyto standardowego hasła do konta Google zamiast "Hasła aplikacji" lub w haśle znajduje się literówka/spacja.
  * **Rozwiązanie:** Wygeneruj nowe Hasło aplikacji i upewnij się, że kopiujesz je bez spacji.

* **Błąd: "Connection timeout" (Przekroczono limit czasu połączenia)**
  * **Przyczyna:** Zapora sieciowa (firewall) na serwerze blokuje port wychodzący 465.
  * **Rozwiązanie:** Skontaktuj się z administratorem hostingu, aby odblokował port 465 dla ruchu wychodzącego TCP.

* **Wiadomości testowe docierają, ale trafiają do folderu SPAM**
  * **Przyczyna:** Brak odpowiedniej konfiguracji rekordów DNS dla domeny nadawcy.
  * **Rozwiązanie:** Upewnij się, że Twoja domena posiada poprawnie skonfigurowane rekordy **SPF**, **DKIM** oraz **DMARC**. Jest to szczególnie ważne, jeśli używasz Google Workspace. W konsoli Google Admin znajdziesz instrukcje, jak wygenerować klucz DKIM dla swojej domeny.
