/**
 * RPMS PROVISIONING ENGINE v10.2.0 (skrypty_GAS)
 * Plik: src/integration/skrypty_GAS/provisioning_v2_2.gs
 * Obsługa rejestracji nowych klientów z uwzględnieniem elastycznego modelu danych.
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
    
    // UŻYCIE NOWEJ WERSJI INICJALIZACJI v10.2.0
    initClientSpreadsheet_v3(clientSS);

    const hashedPassword = payload.password ? hashPassword(payload.password) : "";

    // Dodajemy wiersz z kolumną EmailVerified ustawioną na FALSE
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
