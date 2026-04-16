/**
 * Weryfikacja logowania z użyciem skrótów SHA-256
 */
function verifyLogin(payload) {
  try {
    const sheet = getOrCreateMasterIndex(getOrCreateSystemRoot()).getSheetByName(SYSTEM_CONFIG.MASTER_SHEET_USERS);
    
    // Szybkie wyszukiwanie e-maila w kolumnie C (indeks 3)
    const finder = sheet.getRange("C:C").createTextFinder(payload.email.toLowerCase()).matchCase(false);
    const cell = finder.findNext();
    
    if (!cell) return createJsonResponse({ status: 'error', message: 'Użytkownik nie istnieje.' });
    
    const rowIndex = cell.getRow();
    const rowData = sheet.getRange(rowIndex, 1, 1, 8).getValues()[0];
    
    // Haszowanie podanego hasła do porównania
    const inputHash = hashPassword(payload.password);
    const storedHash = rowData[3]; // Kolumna D

    if (storedHash === inputHash) {
      return createJsonResponse({ 
        status: 'success', 
        user: { 
          email: rowData[2], 
          name: rowData[1], 
          role: 'Konto Aktywne', 
          spreadsheetId: rowData[5] 
        } 
      });
    }
    
    return createJsonResponse({ status: 'error', message: 'Błędne hasło.' });
  } catch (e) { 
    return createJsonResponse({ status: 'error', message: 'Błąd autoryzacji: ' + e.toString() }); 
  }
}

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
