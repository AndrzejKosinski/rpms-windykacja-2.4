/**
 * SKRYPT MIGRACYJNY v10.2.0 (skrypty_GAS)
 * Plik: src/integration/skrypty_GAS/migration_v1.gs
 * 
 * ZADANIE: Automatyczna aktualizacja struktury arkuszy DB_SPRAWY u wszystkich obecnych klientów.
 * INSTRUKCJA: 
 * 1. Wklej ten kod do edytora Google Apps Script.
 * 2. Uruchom funkcję 'runMigration_v10_2_0'.
 * 3. Sprawdź logi w konsoli (Execution Log).
 */

function runMigration_v10_2_0() {
  console.log("=== ROZPOCZĘCIE MIGRACJI STRUKTURY (v10.2.0) ===");
  
  try {
    const rootFolder = getOrCreateSystemRoot();
    const masterSS = getOrCreateMasterIndex(rootFolder);
    const userSheet = masterSS.getSheetByName(SYSTEM_CONFIG.MASTER_SHEET_USERS);
    const data = userSheet.getDataRange().getValues();
    
    // Pomiń nagłówek
    for (let i = 1; i < data.length; i++) {
      const clientId = data[i][0];
      const clientName = data[i][1];
      const ssId = data[i][5];
      
      if (!ssId) {
        console.warn(`Pominięto klienta ${clientName} (${clientId}) - brak ID arkusza.`);
        continue;
      }
      
      try {
        console.log(`Aktualizacja silosu: ${clientName} (${clientId})...`);
        const clientSS = SpreadsheetApp.openById(ssId);
        updateClientSheetStructure(clientSS);
        console.log(`Sukces: ${clientName} zaktualizowany.`);
      } catch (err) {
        console.error(`Błąd podczas aktualizacji klienta ${clientName}: ${err.toString()}`);
      }
    }
    
    console.log("=== MIGRACJA ZAKOŃCZONA SUKCESEM ===");
  } catch (err) {
    console.error("Krytyczny błąd migracji: " + err.toString());
  }
}

/**
 * Aktualizuje strukturę pojedynczego arkusza klienta
 */
function updateClientSheetStructure(ss) {
  const sheetName = SYSTEM_CONFIG.CLIENT_SHEET_CASES;
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    console.warn(`Brak arkusza ${sheetName} w tym silosie.`);
    return;
  }
  
  const lastCol = sheet.getLastColumn();
  const lastRow = sheet.getLastRow();
  const headers = sheet.getRange(1, 1, 1, Math.max(lastCol, 1)).getValues()[0];
  
  // 1. Aktualizacja nagłówka START_DATE (Kolumna 5)
  if (headers[4] !== "START_DATE") {
    sheet.getRange(1, 5).setValue("START_DATE");
    console.log("- Zmieniono nagłówek kolumny 5 na START_DATE");
  }
  
  // 2. Dodanie HISTORY_JSON (Kolumna 7)
  if (headers.indexOf("HISTORY_JSON") === -1) {
    sheet.getRange(1, 7).setValue("HISTORY_JSON").setFontWeight("bold").setBackground("#d9ead3");
    sheet.setColumnWidth(7, 300);
    
    // Wypełnienie istniejących wierszy domyślną wartością []
    if (lastRow > 1) {
      const defaultHistory = [];
      const fillValues = [];
      for (let r = 0; r < lastRow - 1; r++) {
        fillValues.push([JSON.stringify([{
          type: 'SYSTEM',
          date: new Date().toISOString(),
          label: 'Migracja struktury: Dodano historię'
        }])]);
      }
      sheet.getRange(2, 7, lastRow - 1, 1).setValues(fillValues);
    }
    console.log("- Dodano kolumnę HISTORY_JSON i zainicjowano dane.");
  }
  
  // 3. Dodanie METADATA_JSON (Kolumna 8)
  if (headers.indexOf("METADATA_JSON") === -1) {
    sheet.getRange(1, 8).setValue("METADATA_JSON").setFontWeight("bold").setBackground("#d9ead3");
    sheet.setColumnWidth(8, 200);
    
    // Wypełnienie istniejących wierszy domyślną wartością {}
    if (lastRow > 1) {
      const fillValues = [];
      for (let r = 0; r < lastRow - 1; r++) {
        fillValues.push(["{}"]);
      }
      sheet.getRange(2, 8, lastRow - 1, 1).setValues(fillValues);
    }
    console.log("- Dodano kolumnę METADATA_JSON.");
  }
  
  // 4. Przesunięcie USER_EMAIL (jeśli był w kolumnie 7, teraz powinien być w 9)
  // Uwaga: W nowej strukturze USER_EMAIL jest w kolumnie 6, ale sprawdzamy spójność
  if (headers[5] !== "USER_EMAIL") {
     sheet.getRange(1, 6).setValue("USER_EMAIL");
  }

  // 5. Formatowanie końcowe
  sheet.getRange(1, 1, 1, 8).setFontWeight("bold");
  sheet.setFrozenRows(1);
}
