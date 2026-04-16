/**
 * NIEZALEŻNY SKRYPT INICJUJĄCY DLA NOWEGO KONTA GOOGLE - v2.0.0
 * Przygotowuje foldery i pliki z uwzględnieniem Autoryzacji 2.0
 */
function setupNewGoogleAccount_v2() {
  console.log("=== Rozpoczęcie inicjalizacji konta (v2.0.0) ===");
  
  // 1. Folder Główny
  const rootName = 'RPMS-Windykacja';
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
  const indexName = 'RPMS_MASTER_INDEX';
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
  let userSheet = masterSS.getSheetByName('LISTA_KLIENTOW');
  if (!userSheet) {
    userSheet = masterSS.insertSheet('LISTA_KLIENTOW');
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
    'EmailVerified' // NOWA KOLUMNA v2
  ];
  
  const currentHeaders = userSheet.getRange(1, 1, 1, Math.max(userSheet.getLastColumn(), 1)).getValues()[0];
  
  if (userSheet.getLastRow() === 0) {
    userSheet.appendRow(headers);
    userSheet.getRange("A1:I1").setFontWeight("bold").setBackground("#d9ead3");
  } else {
    // Sprawdzenie czy brakuje kolumny EmailVerified
    if (currentHeaders.indexOf('EmailVerified') === -1) {
      userSheet.getRange(1, 9).setValue('EmailVerified').setFontWeight("bold").setBackground("#d9ead3");
      console.log("Dodano brakującą kolumnę EmailVerified");
    }
  }

  // 4. Konfiguracja arkusza AuthTokens (NOWOŚĆ v2)
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
  
  console.log("=== INICJALIZACJA v2 ZAKOŃCZONA SUKCESEM ===");
}
