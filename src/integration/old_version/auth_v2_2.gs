/**
 * RPMS AUTH ENGINE v2.2.0
 * Obsługa logowania, aktywacji konta, resetowania hasła i ZMIANY HASŁA.
 * Zawiera przywróconą funkcję checkEmailStatus.
 */

function verifyLogin(payload) {
  try {
    const sheet = getOrCreateMasterIndex(getOrCreateSystemRoot()).getSheetByName(SYSTEM_CONFIG.MASTER_SHEET_USERS);
    
    // Szybkie wyszukiwanie e-maila w kolumnie C (indeks 3)
    const finder = sheet.getRange("C:C").createTextFinder(payload.email.toLowerCase()).matchCase(false);
    const cell = finder.findNext();
    
    if (!cell) return createJsonResponse({ status: 'error', message: 'Użytkownik nie istnieje.' });
    
    const rowIndex = cell.getRow();
    const rowData = sheet.getRange(rowIndex, 1, 1, 9).getValues()[0];
    
    // Haszowanie podanego hasła do porównania
    const inputHash = hashPassword(payload.password);
    const storedHash = rowData[3]; // Kolumna D

    if (storedHash === inputHash) {
      // Pobranie statusu weryfikacji e-mail (Kolumna I - indeks 8)
      const emailVerified = rowData[8] === true || rowData[8] === "TRUE";

      return createJsonResponse({ 
        status: 'success', 
        user: { 
          email: rowData[2], 
          name: rowData[1], 
          role: 'Konto Aktywne', 
          spreadsheetId: rowData[5],
          emailVerified: emailVerified
        } 
      });
    }
    
    return createJsonResponse({ status: 'error', message: 'Błędne hasło.' });
  } catch (e) { 
    return createJsonResponse({ status: 'error', message: 'Błąd autoryzacji: ' + e.toString() }); 
  }
}

/**
 * Sprawdzenie statusu e-maila (Lead vs Active vs New)
 */
function checkEmailStatus(email) {
  const t = getTenantInfo(email);
  if (!t) return createJsonResponse({ status: 'STATUS_NEW' });
  
  const sheet = getOrCreateMasterIndex(getOrCreateSystemRoot()).getSheetByName(SYSTEM_CONFIG.MASTER_SHEET_USERS);
  const finder = sheet.getRange("C:C").createTextFinder(email.toLowerCase()).matchCase(false);
  const cell = finder.findNext();
  
  if (!cell) return createJsonResponse({ status: 'STATUS_NEW' });
  
  const rowIndex = cell.getRow();
  const password = sheet.getRange(rowIndex, 4).getValue();
  
  return createJsonResponse({ status: (password && password !== "") ? 'STATUS_ACTIVE' : 'STATUS_LEAD' });
}

/**
 * Aktywacja konta na podstawie tokenu
 */
function activateAccount(payload) {
  try {
    const token = payload.token;
    const masterSS = getOrCreateMasterIndex(getOrCreateSystemRoot());
    const tokenSheet = masterSS.getSheetByName('AuthTokens');
    
    if (!tokenSheet) return createJsonResponse({ status: 'error', message: 'System tokenów nie jest zainicjowany.' });
    
    const data = tokenSheet.getDataRange().getValues();
    const tokenIndex = data.findIndex(r => r[0] === token && r[2] === 'ACTIVATION');
    
    if (tokenIndex === -1) {
      return createJsonResponse({ status: 'error', message: 'Nieprawidłowy lub wygasły token aktywacyjny.' });
    }
    
    const tokenData = data[tokenIndex];
    const email = tokenData[1];
    const expiresAt = new Date(tokenData[3]);
    
    if (new Date() > expiresAt) {
      tokenSheet.deleteRow(tokenIndex + 1);
      return createJsonResponse({ status: 'error', message: 'Token aktywacyjny wygasł.' });
    }
    
    // Aktualizacja statusu użytkownika
    const userSheet = masterSS.getSheetByName(SYSTEM_CONFIG.MASTER_SHEET_USERS);
    const userFinder = userSheet.getRange("C:C").createTextFinder(email.toLowerCase()).matchCase(false);
    const userCell = userFinder.findNext();
    
    if (userCell) {
      userSheet.getRange(userCell.getRow(), 9).setValue(true); // Kolumna I
    }
    
    // Usunięcie zużytego tokenu
    tokenSheet.deleteRow(tokenIndex + 1);
    
    return createJsonResponse({ status: 'success', message: 'Konto zostało aktywowane.' });
  } catch (e) {
    return createJsonResponse({ status: 'error', message: 'Błąd aktywacji: ' + e.toString() });
  }
}

/**
 * Inicjowanie resetu hasła
 */
function requestPasswordReset(payload) {
  try {
    const email = payload.email.toLowerCase();
    const masterSS = getOrCreateMasterIndex(getOrCreateSystemRoot());
    const userSheet = masterSS.getSheetByName(SYSTEM_CONFIG.MASTER_SHEET_USERS);
    
    const finder = userSheet.getRange("C:C").createTextFinder(email).matchCase(false);
    const cell = finder.findNext();
    
    if (!cell) {
      return createJsonResponse({ status: 'success', message: 'Jeśli e-mail istnieje, instrukcje zostały wysłane.' });
    }
    
    const userName = userSheet.getRange(cell.getRow(), 2).getValue();
    const token = Utilities.getUuid();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Ważny 1h
    
    let tokenSheet = masterSS.getSheetByName('AuthTokens');
    if (!tokenSheet) {
      tokenSheet = masterSS.insertSheet('AuthTokens');
      tokenSheet.appendRow(['Token', 'Email', 'Type', 'ExpiresAt']);
    }
    
    tokenSheet.appendRow([token, email, 'RESET', expiresAt]);
    
    sendSystemEmail(email, 'PASSWORD_RESET', {
      'USER_NAME': userName,
      'RESET_URL': `https://rpms-windykacja.pl/auth/reset-password?token=${token}`
    });
    
    return createJsonResponse({ status: 'success', message: 'Instrukcje resetowania hasła zostały wysłane.' });
  } catch (e) {
    return createJsonResponse({ status: 'error', message: 'Błąd resetu: ' + e.toString() });
  }
}

/**
 * Finalizacja resetu hasła
 */
function resetPassword(payload) {
  try {
    const { token, newPassword } = payload;
    const masterSS = getOrCreateMasterIndex(getOrCreateSystemRoot());
    const tokenSheet = masterSS.getSheetByName('AuthTokens');
    
    if (!tokenSheet) return createJsonResponse({ status: 'error', message: 'Błąd systemu tokenów.' });
    
    const data = tokenSheet.getDataRange().getValues();
    const tokenIndex = data.findIndex(r => r[0] === token && r[2] === 'RESET');
    
    if (tokenIndex === -1) {
      return createJsonResponse({ status: 'error', message: 'Nieprawidłowy lub wygasły token.' });
    }
    
    const tokenData = data[tokenIndex];
    const email = tokenData[1];
    const expiresAt = new Date(tokenData[3]);
    
    if (new Date() > expiresAt) {
      tokenSheet.deleteRow(tokenIndex + 1);
      return createJsonResponse({ status: 'error', message: 'Token wygasł.' });
    }
    
    // Aktualizacja hasła
    const userSheet = masterSS.getSheetByName(SYSTEM_CONFIG.MASTER_SHEET_USERS);
    const userFinder = userSheet.getRange("C:C").createTextFinder(email.toLowerCase()).matchCase(false);
    const userCell = userFinder.findNext();
    
    if (userCell) {
      const hashedPassword = hashPassword(newPassword);
      userSheet.getRange(userCell.getRow(), 4).setValue(hashedPassword);
    }
    
    // Usunięcie zużytego tokenu
    tokenSheet.deleteRow(tokenIndex + 1);
    
    return createJsonResponse({ status: 'success', message: 'Hasło zostało zmienione.' });
  } catch (e) {
    return createJsonResponse({ status: 'error', message: 'Błąd zmiany hasła: ' + e.toString() });
  }
}

/**
 * Zmiana hasła przez zalogowanego użytkownika
 */
function changePassword(payload) {
  try {
    const email = payload.email;
    const currentPassword = payload.currentPassword;
    const newPassword = payload.newPassword;

    if (!email || !currentPassword || !newPassword) {
      return createJsonResponse({ status: 'error', message: 'Brak wymaganych danych (email, currentPassword, newPassword).' });
    }

    const masterSS = getOrCreateMasterIndex(getOrCreateSystemRoot());
    const userSheet = masterSS.getSheetByName(SYSTEM_CONFIG.MASTER_SHEET_USERS);
    
    const finder = userSheet.getRange("C:C").createTextFinder(email.toLowerCase()).matchCase(false);
    const cell = finder.findNext();
    
    if (!cell) {
      return createJsonResponse({ status: 'error', message: 'Użytkownik nie istnieje.' });
    }
    
    const rowIndex = cell.getRow();
    const storedHash = userSheet.getRange(rowIndex, 4).getValue(); // Kolumna D
    const inputHash = hashPassword(currentPassword);

    if (storedHash !== inputHash) {
      return createJsonResponse({ status: 'error', message: 'Błędne aktualne hasło.' });
    }

    const newHash = hashPassword(newPassword);
    userSheet.getRange(rowIndex, 4).setValue(newHash);

    return createJsonResponse({ status: 'success', message: 'Hasło zostało pomyślnie zmienione.' });
  } catch (e) {
    return createJsonResponse({ status: 'error', message: 'Błąd zmiany hasła: ' + e.toString() });
  }
}

/**
 * Ponowne wysłanie linku aktywacyjnego
 */
function resendActivationEmail(payload) {
  try {
    const email = payload.email.toLowerCase();
    const masterSS = getOrCreateMasterIndex(getOrCreateSystemRoot());
    const userSheet = masterSS.getSheetByName(SYSTEM_CONFIG.MASTER_SHEET_USERS);
    
    const finder = userSheet.getRange("C:C").createTextFinder(email).matchCase(false);
    const cell = finder.findNext();
    
    if (!cell) return createJsonResponse({ status: 'error', message: 'Użytkownik nie istnieje.' });
    
    const row = cell.getRow();
    const isVerified = userSheet.getRange(row, 9).getValue();
    
    if (isVerified === true || isVerified === "TRUE") {
      return createJsonResponse({ status: 'error', message: 'Konto jest już zweryfikowane.' });
    }
    
    const userName = userSheet.getRange(row, 2).getValue();
    const token = Utilities.getUuid();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Ważny 24h
    
    let tokenSheet = masterSS.getSheetByName('AuthTokens');
    if (!tokenSheet) {
      tokenSheet = masterSS.insertSheet('AuthTokens');
      tokenSheet.appendRow(['Token', 'Email', 'Type', 'ExpiresAt']);
    }
    
    // Usuwamy stare tokeny aktywacyjne dla tego maila
    const tokenData = tokenSheet.getDataRange().getValues();
    for (let i = tokenData.length - 1; i >= 1; i--) {
      if (tokenData[i][1] === email && tokenData[i][2] === 'ACTIVATION') {
        tokenSheet.deleteRow(i + 1);
      }
    }
    
    tokenSheet.appendRow([token, email, 'ACTIVATION', expiresAt]);
    
    sendSystemEmail(email, 'ACCOUNT_ACTIVATION', {
      'USER_NAME': userName,
      'ACTIVATION_URL': `https://rpms-windykacja.pl/auth/verify?token=${token}`
    });
    
    return createJsonResponse({ status: 'success', message: 'Link aktywacyjny został wysłany.' });
  } catch (e) {
    return createJsonResponse({ status: 'error', message: 'Błąd wysyłki: ' + e.toString() });
  }
}
