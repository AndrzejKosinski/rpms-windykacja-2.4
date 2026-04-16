# Stack Technologiczny

Lista i uzasadnienie technologii użytych w projekcie RPMS.

## 1. Framework: Next.js 16+ (App Router)
Wybrany ze względu na:
- **Wsparcie dla Server Components**: Redukcja ilości JS przesyłanego do klienta.
- **ISR (Incremental Static Regeneration)**: Automatyczne odświeżanie treści co 60 sekund bez konieczności przebudowy całej aplikacji.
- **Wbudowane API Routes**: Brak konieczności utrzymywania osobnego serwera backendowego dla prostych zadań.

## 2. Stylizacja: Tailwind CSS v4
Najnowsza wersja Tailwind CSS, która oferuje:
- **Lepszą wydajność**: Szybszy proces kompilacji.
- **Zmienne CSS**: Łatwiejsza konfiguracja motywów i dynamicznych kolorów.
- **Brak nadmiarowego CSS**: Generowany jest tylko kod faktycznie użyty w projekcie.

## 3. Animacje: Motion (framer-motion)
Używana do płynnych przejść między sekcjami oraz interaktywnych elementów UI. Importowana z `motion/react`.

## 4. Ikony: Lucide React
Zbiór lekkich, spójnych ikon SVG, które są łatwo konfigurowalne za pomocą klas Tailwind.

## 5. Walidacja: Zod
Biblioteka do walidacji schematów danych. Używana głównie:
- Przy odbieraniu danych z CMS (upewnienie się, że struktura jest poprawna).
- W formularzach kontaktowych.

## 6. Zarządzanie Stanem: React Context
Dla globalnych danych (treść strony, stan zalogowania) używamy natywnego React Context API. Jest to wystarczające dla skali tego projektu i nie wymaga ciężkich bibliotek typu Redux.

## 7. Backend: Google Apps Script (GAS)
Obecnie pełni rolę lekkiego CMS. Dane są przechowywane w arkuszach Google lub plikach na dysku, a GAS udostępnia je przez API JSON.
