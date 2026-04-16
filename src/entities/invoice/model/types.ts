export interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: string; 
  amountValue: number;
  netAmount: string;
  vatAmount: string;
  currency: string;
  description: string;
  isContested: 'YES' | 'NO';
  fileUrl: string;
  fileName?: string;
  timestamp: string;
  type: 'DOCUMENT' | 'MANUAL';
}

export interface ExtractedDebtData {
  // Dane dłużnika (Nabywca)
  debtorName: string;
  nip: string;
  krs: string;
  
  // Dane adresowe (rozbite)
  street: string;
  zipCode: string;
  city: string;
  address: string; // Pełny adres (złączony dla backendu)

  // Dane korespondencyjne (opcjonalne)
  corrStreet: string;
  corrZipCode: string;
  corrCity: string;
  correspondenceAddress: string;
  
  isForeign: boolean;

  // Dane dokumentu (Materiał dowodowy)
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: string; // Kwota brutto (string z kropką)
  netAmount: string;
  vatAmount: string;
  currency: 'PLN' | 'EUR';
  description: string;
  
  // Dane strategiczne
  isContested: 'YES' | 'NO';
}
