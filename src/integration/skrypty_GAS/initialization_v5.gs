/**
 * NIEZALEŻNY SKRYPT INICJUJĄCY DLA NOWEGO KONTA GOOGLE - v11.0.0 (Hierarchical DMS + Settings)
 * Plik: src/integration/skrypty_GAS/initialization_v5.gs
 * Przygotowuje foldery i pliki z uwzględnieniem hierarchicznej struktury folderów dłużników oraz ustawień firmy.
 */

function setupNewGoogleAccount_v5() {
  console.log("=== Rozpoczęcie inicjalizacji konta (v11.0.0) ===");
  
  // 1. Folder Główny
  const rootName = SYSTEM_CONFIG.ROOT_FOLDER_NAME;
  let rootFolder;
  const folders = DriveApp.getFoldersByName(rootName);
  if (folders.hasNext()) {
    rootFolder = folders.next();
    console.log("Znaleziono istniejący folder główny: " + rootFolder.getId());
  } else {
    rootFolder = DriveApp.createFolder(rootName);
    console.log("Utworzono nowy folder główny: " + rootFolder.getId());
  }
  
  // 2. MASTER INDEX (Lista Klientów)
  const indexName = SYSTEM_CONFIG.MASTER_INDEX_NAME;
  let masterSS;
  const files = rootFolder.getFilesByName(indexName);
  
  if (files.hasNext()) {
    masterSS = SpreadsheetApp.openById(files.next().getId());
    console.log("Znaleziono istniejący MASTER_INDEX: " + masterSS.getId());
  } else {
    masterSS = SpreadsheetApp.create(indexName);
    const file = DriveApp.getFileById(masterSS.getId());
    file.moveTo(rootFolder);
    console.log("Utworzono i przeniesiono MASTER_INDEX: " + masterSS.getId());
  }
  
  // 3. Konfiguracja arkusza LISTA_KLIENTOW
  let userSheet = masterSS.getSheetByName(SYSTEM_CONFIG.MASTER_SHEET_USERS);
  if (!userSheet) {
    userSheet = masterSS.insertSheet(SYSTEM_CONFIG.MASTER_SHEET_USERS);
    // Usuwamy domyślny arkusz jeśli jest pusty
    const defaultSheet = masterSS.getSheetByName('Arkusz1') || masterSS.getSheetByName('Sheet1');
    if (defaultSheet && masterSS.getSheets().length > 1) masterSS.deleteSheet(defaultSheet);
  }
  
  const headers = [
    'CLIENT_ID', 
    'CLIENT_NAME', 
    'EMAIL', 
    'PASSWORD', 
    'FOLDER_ID', 
    'SPREADSHEET_ID', 
    'PANEL_STATUS', 
    'CREATED_AT',
    'EmailVerified',
    'COMPANY_SETTINGS_JSON'
  ];
  
  const currentHeaders = userSheet.getRange(1, 1, 1, Math.max(userSheet.getLastColumn(), 1)).getValues()[0];
  
  if (userSheet.getLastRow() === 0) {
    userSheet.appendRow(headers);
    userSheet.getRange("A1:J1").setFontWeight("bold").setBackground("#d9ead3");
  } else {
    if (currentHeaders.indexOf('EmailVerified') === -1) {
      userSheet.getRange(1, 9).setValue('EmailVerified').setFontWeight("bold").setBackground("#d9ead3");
      console.log("Dodano brakującą kolumnę EmailVerified");
    }
    if (currentHeaders.indexOf('COMPANY_SETTINGS_JSON') === -1) {
      userSheet.getRange(1, 10).setValue('COMPANY_SETTINGS_JSON').setFontWeight("bold").setBackground("#d9ead3");
      console.log("Dodano brakującą kolumnę COMPANY_SETTINGS_JSON");
    }
  }

  // 4. Konfiguracja arkusza AuthTokens
  let tokenSheet = masterSS.getSheetByName('AuthTokens');
  if (!tokenSheet) {
    tokenSheet = masterSS.insertSheet('AuthTokens');
    tokenSheet.appendRow(['Token', 'Email', 'Type', 'ExpiresAt']);
    tokenSheet.getRange("A1:D1").setFontWeight("bold").setBackground("#cfe2f3");
    console.log("Utworzono arkusz AuthTokens");
  }

  // 5. Zapis ID jako Script Properties
  const scriptProps = PropertiesService.getScriptProperties();
  scriptProps.setProperty('ROOT_FOLDER_ID', rootFolder.getId());
  scriptProps.setProperty('MASTER_INDEX_ID', masterSS.getId());
  
  // 6. Folder KLIENCI
  const klienciFolders = rootFolder.getFoldersByName('KLIENCI');
  if (!klienciFolders.hasNext()) {
    rootFolder.createFolder('KLIENCI');
    console.log("Utworzono podfolder KLIENCI");
  }
  
  console.log("=== INICJALIZACJA v11.0.0 ZAKOŃCZONA SUKCESEM ===");
}

/**
 * Inicjalizacja arkusza klienta (silosu) - Wersja v10.7.0 (bez zmian)
 * Dodaje kolumny HISTORY_JSON i METADATA_JSON
 */
function initClientSpreadsheet_v3(ss) {
  // 1. Dłużnicy
  const debtorSheet = ss.insertSheet(SYSTEM_CONFIG.CLIENT_SHEET_DEBTORS);
  debtorSheet.appendRow(["DEBTOR_ID", "NIP", "NAZWA_FIRMY", "ADRES_SIEDZIBY", "KRS", "ADRES_KORESPONDENCJI", "CZY_ZAGRANICZNY", "EMAIL", "CREATED_AT", "USER_EMAIL"]);
  debtorSheet.getRange("A1:J1").setFontWeight("bold").setBackground("#f4cccc");

  // 2. Sprawy (Zaktualizowana struktura v10.7.0)
  const caseSheet = ss.insertSheet(SYSTEM_CONFIG.CLIENT_SHEET_CASES);
  caseSheet.appendRow([
    "CASE_ID", 
    "DEBTOR_ID", 
    "STATUS_PRAWNY", 
    "STRATEGIA", 
    "START_DATE", 
    "USER_EMAIL", 
    "HISTORY_JSON", 
    "METADATA_JSON"
  ]);
  caseSheet.getRange("A1:H1").setFontWeight("bold").setBackground("#d9ead3");
  
  // Ustawienie szerokości dla kolumn JSON
  caseSheet.setColumnWidth(7, 300); // HISTORY_JSON
  caseSheet.setColumnWidth(8, 200); // METADATA_JSON
  
  // Zamrożenie nagłówka
  caseSheet.setFrozenRows(1);

  // 3. Faktury
  const invoiceSheet = ss.insertSheet(SYSTEM_CONFIG.CLIENT_SHEET_INVOICES);
  invoiceSheet.appendRow(["INVOICE_ID", "CASE_ID", "NUMER_FAKTURY", "DATA_WYSTAWIE", "TERMIN_PLATNOSCI", "KWOTA_BRUTTO", "KWOTA_NETTO", "KWOTA_VAT", "WALUTA", "OPIS_USLUGI", "CZY_SPORNE", "FILE_URL", "TIMESTAMP", "TYP_WPISU", "USER_EMAIL"]);
  invoiceSheet.getRange("A1:O1").setFontWeight("bold").setBackground("#cfe2f3");
  
  const defaultSheet = ss.getSheetByName('Arkusz1') || ss.getSheetByName('Sheet1');
  if (defaultSheet) ss.deleteSheet(defaultSheet);
  
  console.log("Zainicjalizowano silos klienta w wersji v10.7.0");
}
