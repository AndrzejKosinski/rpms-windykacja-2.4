/**
 * RPMS PROVISIONING ENGINE v2.0.0
 * Obsługa rejestracji nowych klientów z uwzględnieniem weryfikacji e-mail.
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
        'ACTIVATION_URL': `https://rpms-windykacja.pl/auth/verify?token=${token}`
      });
    }

    return createJsonResponse({ status: 'success', clientId: clientId });
  } catch (err) { 
    return createJsonResponse({ status: 'error', message: "Błąd tworzenia silosa: " + err.toString() }); 
  }
}
