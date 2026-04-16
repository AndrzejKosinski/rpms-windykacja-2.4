/**
 * Skrypt migracyjny v2.0.0
 * Plik: src/integration/skrypty_GAS/migration_v2.gs
 * Dodaje kolumnę COMPANY_SETTINGS_JSON do arkusza LISTA_KLIENTOW dla istniejących wdrożeń.
 */

function migrateCompanySettingsColumn() {
  console.log("=== Rozpoczęcie migracji: Dodawanie kolumny COMPANY_SETTINGS_JSON ===");
  
  try {
    const rootName = SYSTEM_CONFIG.ROOT_FOLDER_NAME;
    const folders = DriveApp.getFoldersByName(rootName);
    if (!folders.hasNext()) {
      console.error("Nie znaleziono folderu głównego systemu.");
      return;
    }
    const rootFolder = folders.next();
    
    const indexName = SYSTEM_CONFIG.MASTER_INDEX_NAME;
    const files = rootFolder.getFilesByName(indexName);
    if (!files.hasNext()) {
      console.error("Nie znaleziono pliku MASTER_INDEX.");
      return;
    }
    
    const masterSS = SpreadsheetApp.openById(files.next().getId());
    const userSheet = masterSS.getSheetByName(SYSTEM_CONFIG.MASTER_SHEET_USERS);
    
    if (!userSheet) {
      console.error("Nie znaleziono arkusza " + SYSTEM_CONFIG.MASTER_SHEET_USERS);
      return;
    }
    
    const currentHeaders = userSheet.getRange(1, 1, 1, Math.max(userSheet.getLastColumn(), 1)).getValues()[0];
    
    if (currentHeaders.indexOf('COMPANY_SETTINGS_JSON') === -1) {
      // Dodajemy w kolumnie J (10)
      userSheet.getRange(1, 10).setValue('COMPANY_SETTINGS_JSON')
        .setFontWeight("bold")
        .setBackground("#d9ead3");
      console.log("SUKCES: Dodano kolumnę COMPANY_SETTINGS_JSON w arkuszu LISTA_KLIENTOW.");
    } else {
      console.log("INFO: Kolumna COMPANY_SETTINGS_JSON już istnieje. Pomijam.");
    }
    
  } catch (e) {
    console.error("BŁĄD MIGRACJI: " + e.toString());
  }
  
  console.log("=== Zakończenie migracji ===");
}
