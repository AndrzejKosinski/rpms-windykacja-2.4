/**
 * RPMS PROVISIONING ENGINE v2.1.0
 * Obsługa rejestracji nowych klientów z uwzględnieniem weryfikacji e-mail.
 * Zawiera przywróconą funkcję initClientSpreadsheet oraz logikę zmiany nazw.
 */

function registerTenant(payload) {
  try {
    const rootFolder = getOrCreateSystemRoot();
    const masterSS = getOrCreateMasterIndex(rootFolder);
    const userSheet = masterSS.getSheetByName(SYSTEM_CONFIG.MASTER_SHEET_USERS);
    const data = userSheet.getDataRange().getValues();
    
    const emailLower = payload.email.toLowerCase();
    const existingIndex = data.findIndex(r => r[2] === emailLower);
    const userName = payload.name || emailLower.split('@')[0];

    if (existingIndex !== -1) {
      const existingPassword = data[existingIndex][3];
      const clientId = data[existingIndex][0];
      
      if (existingPassword && existingPassword.toString().trim() !== "") {
        return createJsonResponse({ 
          status: 'error', 
          message: 'Użytkownik o podanym adresie e-mail już istnieje.' 
        });
      }
      
      if (payload.password) {
        const hashedPassword = hashPassword(payload.password);
        userSheet.getRange(existingIndex + 1, 4).setValue(hashedPassword);
        userSheet.getRange(existingIndex + 1, 7).setValue("ACTIVE");
        
        // Przywrócona logika zmiany nazw na Drive
        if (payload.name) {
          userSheet.getRange(existingIndex + 1, 2).setValue(payload.name);
          try {
            const folderId = data[existingIndex][4];
            const ssId = data[existingIndex][5];
            if (folderId) DriveApp.getFolderById(folderId).setName(`${payload.name} (${clientId})`);
            if (ssId) SpreadsheetApp.openById(ssId).rename(`BAZA_WINDYKACYJNA_${clientId}`);
          } catch (renameErr) {
            console.warn("Błąd zmiany nazw na Drive: " + renameErr.toString());
          }
        }

        // Generowanie tokenu aktywacyjnego
        const token = Utilities.getUuid();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        
        let tokenSheet = masterSS.getSheetByName('AuthTokens');
        if (!tokenSheet) {
          tokenSheet = masterSS.insertSheet('AuthTokens');
          tokenSheet.appendRow(['Token', 'Email', 'Type', 'ExpiresAt']);
        }
        tokenSheet.appendRow([token, emailLower, 'ACTIVATION', expiresAt]);

        sendSystemEmail(emailLower, 'ACCOUNT_ACTIVATION', {
          'USER_NAME': userName,
          'USER_EMAIL': emailLower,
          'ACTIVATION_URL': `https://rpms-windykacja.pl/auth/verify?token=${token}`
        });
      }
      
      return createJsonResponse({ status: 'success', clientId: clientId });
    }

    const klienciFolder = getOrCreateFolder(rootFolder, 'KLIENCI');
    const clientId = "RPMS-" + Utilities.getUuid().substring(0, 8).toUpperCase();
    const clientFolder = klienciFolder.createFolder(`${userName} (${clientId})`);
    
    const clientSS = SpreadsheetApp.create(`BAZA_WINDYKACYJNA_${clientId}`);
    DriveApp.getFileById(clientSS.getId()).moveTo(clientFolder);
    
    initClientSpreadsheet(clientSS);

    const hashedPassword = payload.password ? hashPassword(payload.password) : "";

    // Dodajemy wiersz z kolumną EmailVerified (Kolumna I - indeks 8) ustawioną na FALSE
    userSheet.appendRow([
      clientId, 
      userName, 
      emailLower, 
      hashedPassword, 
      clientFolder.getId(), 
      clientSS.getId(), 
      hashedPassword ? "ACTIVE" : "LEAD", 
      new Date(),
      false // EmailVerified
    ]);

    if (payload.password) {
      // Generowanie tokenu aktywacyjnego
      const token = Utilities.getUuid();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      let tokenSheet = masterSS.getSheetByName('AuthTokens');
      if (!tokenSheet) {
        tokenSheet = masterSS.insertSheet('AuthTokens');
        tokenSheet.appendRow(['Token', 'Email', 'Type', 'ExpiresAt']);
      }
      tokenSheet.appendRow([token, emailLower, 'ACTIVATION', expiresAt]);

      sendSystemEmail(emailLower, 'ACCOUNT_ACTIVATION', {
        'USER_NAME': userName,
        'USER_EMAIL': emailLower,
        'ACTIVATION_URL': `https://rpms-windykacja.pl/auth/verify?token=${token}`
      });
    }

    return createJsonResponse({ status: 'success', clientId: clientId });
  } catch (err) { 
    return createJsonResponse({ status: 'error', message: "Błąd tworzenia silosa: " + err.toString() }); 
  }
}

/**
 * Inicjalizacja arkusza klienta (silosu)
 */
function initClientSpreadsheet(ss) {
  ss.insertSheet(SYSTEM_CONFIG.CLIENT_SHEET_DEBTORS).appendRow(["DEBTOR_ID", "NIP", "NAZWA_FIRMY", "ADRES_SIEDZIBY", "KRS", "ADRES_KORESPONDENCJI", "CZY_ZAGRANICZNY", "EMAIL", "CREATED_AT", "USER_EMAIL"]);
  ss.insertSheet(SYSTEM_CONFIG.CLIENT_SHEET_CASES).appendRow(["CASE_ID", "DEBTOR_ID", "STATUS_PRAWNY", "STRATEGIA", "START_DATE", "USER_EMAIL"]);
  ss.insertSheet(SYSTEM_CONFIG.CLIENT_SHEET_INVOICES).appendRow(["INVOICE_ID", "CASE_ID", "NUMER_FAKTURY", "DATA_WYSTAWIE", "TERMIN_PLATNOSCI", "KWOTA_BRUTTO", "KWOTA_NETTO", "KWOTA_VAT", "WALUTA", "OPIS_USLUGI", "CZY_SPORNE", "FILE_URL", "TIMESTAMP", "TYP_WPISU", "USER_EMAIL"]);
  
  const defaultSheet = ss.getSheetByName('Arkusz1') || ss.getSheetByName('Sheet1');
  if (defaultSheet) ss.deleteSheet(defaultSheet);
}
