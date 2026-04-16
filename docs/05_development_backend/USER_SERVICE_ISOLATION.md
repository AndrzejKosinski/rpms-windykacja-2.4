# Izolacja Serwisu Użytkownika (User Service)

## Cel
W celu zachowania pełnej izolacji pomiędzy logiką aplikacji Next.js a fizycznym źródłem danych (obecnie Google Apps Script / Arkusze Google, docelowo baza danych SQL/NoSQL), wprowadzono wzorzec warstwy usług (Service Layer) dla operacji związanych z użytkownikiem.

## Architektura

1. **Interfejs (`IUserService.ts`)**
   Definiuje kontrakt, jakiego reszta aplikacji może oczekiwać od serwisu użytkownika. Nie zdradza on szczegółów implementacyjnych.
   ```typescript
   export interface IUserService {
     checkUserStatus(email: string): Promise<{
       exists: boolean;
       isActive: boolean;
     }>;
   }
   ```

2. **Adapter (`AppsScriptUserAdapter.ts`)**
   Fizyczna implementacja interfejsu, która obecnie komunikuje się z Google Apps Script za pomocą Webhooka. Mapuje odpowiedź z GAS (np. `STATUS_ACTIVE`, `STATUS_LEAD`) na ustandaryzowany format `{ exists: boolean, isActive: boolean }`.

3. **Fabryka (`apiClientFactory.ts`)**
   Eksportuje instancję adaptera jako `userService`. Dzięki temu w kodzie aplikacji używamy tylko `userService.checkUserStatus(...)`, nie martwiąc się o to, skąd pochodzą dane.

## Zastosowanie (Przykład: Formularz Kontaktowy)
W pliku `/api/contact/route.ts` system e-mailowy musi wiedzieć, czy nadawca wiadomości posiada aktywne konto, aby dostosować wezwanie do akcji (CTA) w wysyłanym e-mailu.

Zamiast bezpośrednio odpytywać bazę danych, endpoint wywołuje:
```typescript
const userStatus = await userService.checkUserStatus(recipientEmail);
const hasActiveAccount = userStatus.isActive;
```

Na podstawie zmiennej `hasActiveAccount` system wstrzykuje odpowiedni wariant CTA (Wariant A dla zarejestrowanych, Wariant B dla niezarejestrowanych).

## Migracja w przyszłości
Kiedy aplikacja zostanie zmigrowana na docelową bazę danych (np. PostgreSQL), wystarczy:
1. Utworzyć nowy plik `SqlUserAdapter.ts` implementujący `IUserService`.
2. W pliku `apiClientFactory.ts` podmienić `new AppsScriptUserAdapter()` na `new SqlUserAdapter()`.
3. **Żaden inny plik w aplikacji (w tym logika wysyłania e-maili) nie będzie wymagał modyfikacji.**

## Zmiany w Google Apps Script (GAS)
Adapter `AppsScriptUserAdapter` wykorzystuje istniejącą funkcję `checkEmailStatus` w skryptach GAS (np. `auth_v3.gs`), która zwraca status w formacie:
- `STATUS_ACTIVE` - konto istnieje i ma ustawione hasło (EmailVerified = TRUE)
- `STATUS_LEAD` - konto istnieje, ale nie ma hasła
- `STATUS_NEW` - brak e-maila w bazie

Adapter automatycznie tłumaczy `STATUS_ACTIVE` na `isActive: true`.
