
import { Type } from "@google/genai";

export const INVOICE_PROMPT = `KRYTYCZNA EKSTRAKCJA DANYCH Z FAKTURY DLA RPMS WINDYKACJA.
              
ZASADA DATY: Konwertuj format DD.MM.RRRR na YYYY-MM-DD.

ZASADA KWOTY: Usuń spacje, użyj kropki (np. "1234.50").

ZASADA ADRESU (KRYTYCZNA):
- street: TYLKO ulica i numer (np. "ul. Jasna 12"). NIGDY nie wpisuj tu kodu pocztowego ani miasta.
- zipCode: TYLKO format 00-000.
- city: TYLKO nazwa miejscowości.

EKSTRAHUJ DANE NABYWCY (DŁUŻNIKA):
- isInvoice: Czy dokument to faktura VAT? (boolean)
- debtorName: Pełna nazwa dłużnika.
- nip: NIP dłużnika (same cyfry).
- street: Ulica i numer budynku/lokalu siedziby.
- zipCode: Kod pocztowy (format 00-000).
- city: Miejscowość siedziby.
- krs: Numer KRS (jeśli jest).
- invoiceNumber: Numer faktury.
- issueDate: Data wystawienia (YYYY-MM-DD).
- dueDate: Termin płatności (YYYY-MM-DD).
- amount: Kwota BRUTTO (z kropką).
- netAmount: Kwota NETTO.
- vatAmount: Kwota VAT.
- currency: Waluta (PLN/EUR).
- description: Krótki opis przedmiotu faktury.

ZWRÓĆ WYŁĄCZNIE CZYSTY JSON.`;

export const INVOICE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isInvoice: { type: Type.BOOLEAN },
    debtorName: { type: Type.STRING },
    nip: { type: Type.STRING },
    street: { type: Type.STRING },
    zipCode: { type: Type.STRING },
    city: { type: Type.STRING },
    krs: { type: Type.STRING },
    invoiceNumber: { type: Type.STRING },
    issueDate: { type: Type.STRING },
    dueDate: { type: Type.STRING },
    amount: { type: Type.STRING },
    netAmount: { type: Type.STRING },
    vatAmount: { type: Type.STRING },
    currency: { type: Type.STRING },
    description: { type: Type.STRING }
  },
  required: ["isInvoice", "debtorName", "nip", "amount", "dueDate", "street", "zipCode", "city"]
};
