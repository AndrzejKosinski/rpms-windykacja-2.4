# Specyfikacja Interfejsów API (IRequest / IResponse)

**Data dokumentu:** 2026-03-18
**Wersja:** 10.4.0
**Status:** Specyfikacja Standardu

## Wstęp
Niniejszy dokument definiuje ścisłe interfejsy komunikacyjne pomiędzy frontendem a dowolnym backendem (Google Apps Script, Node.js, Firebase, SQL). Celem jest całkowita eliminacja typu `any` w warstwie API, co pozwoli na bezproblemową wymianę backendu bez modyfikacji kodu UI.

## 1. Standard Odpowiedzi (IResponse)
Każda odpowiedź z API musi być ujednolicona, aby frontend mógł przewidywalnie obsługiwać błędy i sukcesy.

```typescript
export interface IApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T; // Dla operacji zwracających konkretny obiekt
  cases?: T[]; // Specyficzne dla dashboardu (wsteczna kompatybilność)
}
```

## 2. Specyfikacja Metod (IDebtCaseService)

### 2.1. Pobieranie Dashboardu
Zwraca listę wszystkich spraw przypisanych do danego użytkownika.

**Request:**
```typescript
interface IFetchDashboardRequest {
  email: string;
}
```

**Response:**
```typescript
IApiResponse<Debtor[]>
```

### 2.2. Aktualizacja Statusu
Zmienia etap windykacji dla konkretnej sprawy.

**Request:**
```typescript
interface IUpdateStatusRequest {
  caseId: string;
  userEmail: string;
  newStatus: string;
}
```

**Response:**
```typescript
IApiResponse
```

### 2.3. Inicjalizacja Nowej Sprawy
Tworzy nową sprawę w systemie.

**Request:**
```typescript
interface IInitDebtRequest {
  userEmail: string;
  debtorName: string;
  nip: string;
  krs?: string;
  totalAmount: string;
  invoices: Array<{
    invoiceNumber: string;
    amount: string;
    dueDate: string;
    fileUrl?: string;
  }>;
  metadata?: Record<string, any>;
}
```

**Response:**
```typescript
IApiResponse<{ caseId: string }>
```

### 2.4. Aktualizacja Danych Sprawy
Modyfikuje istniejące dane dłużnika lub metadane.

**Request:**
```typescript
interface IUpdateDebtDataRequest {
  caseId: string;
  userEmail: string;
  debtorName?: string;
  nip?: string;
  krs?: string;
  metadata?: Record<string, any>;
}
```

**Response:**
```typescript
IApiResponse
```

### 2.5. Usuwanie Dokumentów/Spraw
Usuwanie faktury lub całej sprawy.

**Request (Delete Invoice):**
```typescript
interface IDeleteInvoiceRequest {
  caseId: string;
  invoiceId: string;
  userEmail: string;
}
```

**Request (Delete Case):**
```typescript
interface IDeleteCaseRequest {
  caseId: string;
  userEmail: string;
}
```

## 3. Specyfikacja Metod (ISettingsService)

### 3.1. Pobieranie Danych Firmy
Zwraca aktualne dane firmy i rozliczeniowe użytkownika.

**Request:**
```typescript
interface IGetCompanyDataRequest {
  email: string;
}
```

**Response:**
```typescript
IApiResponse<CompanyDetails>
```

### 3.2. Aktualizacja Danych Firmy
Aktualizuje dane firmy i rozliczeniowe użytkownika.

**Request:**
```typescript
interface IUpdateCompanyDataRequest {
  email: string;
  data: {
    nip: string;
    companyName: string;
    address: string;
    iban: string;
    billingEmail: string;
  };
}
```

**Response:**
```typescript
IApiResponse
```

## 4. Zasady Mapowania (Data Transformation)
Każdy adapter (np. `AppsScriptDebtCaseAdapter`) jest odpowiedzialny za:
1.  **Walidację Requestu:** Sprawdzenie czy wszystkie wymagane pola są obecne.
2.  **Transformację Response:** Przekształcenie surowych danych z bazy (np. kolumny Arkusza) na model `Debtor`.
3.  **Obsługę Błędów:** Zmapowanie błędów bazy danych na czytelne komunikaty w `IApiResponse.message`.

## 5. Przykładowa Implementacja Adaptera (TypeScript)
```typescript
class GenericBackendAdapter implements IDebtCaseService {
  async fetchDashboard(payload: IFetchDashboardRequest): Promise<IApiResponse<Debtor[]>> {
    const response = await fetch('/api/dashboard', { body: JSON.stringify(payload) });
    return await response.json();
  }
}
```
