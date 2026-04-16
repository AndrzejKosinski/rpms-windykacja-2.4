/**
 * RPMS SETTINGS ENGINE v1.0.0
 * Plik: src/integration/skrypty_GAS/settings_v1.gs
 * Obsługa ustawień firmy i rozliczeń (Company Details).
 */

/**
 * Pobiera dane firmy z kolumny COMPANY_SETTINGS_JSON w arkuszu LISTA_KLIENTOW.
 */
function getCompanyData(payload) {
  try {
    const email = payload.email;
    if (!email) {
      return createJsonResponse({ status: 'error', message: 'Brak adresu e-mail.' });
    }

    const masterSS = getOrCreateMasterIndex(getOrCreateSystemRoot());
    const userSheet = masterSS.getSheetByName(SYSTEM_CONFIG.MASTER_SHEET_USERS);
    
    if (!userSheet) {
      return createJsonResponse({ status: 'error', message: 'Brak arkusza LISTA_KLIENTOW.' });
    }

    const finder = userSheet.getRange("C:C").createTextFinder(email.toLowerCase()).matchCase(false);
    const cell = finder.findNext();
    
    if (!cell) {
      return createJsonResponse({ status: 'error', message: 'Użytkownik nie istnieje.' });
    }
    
    const rowIndex = cell.getRow();
    // Kolumna B to indeks 2 (NIP rejestrowy)
    const registrationNip = userSheet.getRange(rowIndex, 2).getValue();
    // Kolumna J to indeks 10 (JSON ustawień)
    const settingsJson = userSheet.getRange(rowIndex, 10).getValue();
    
    let data = {};
    if (settingsJson) {
      try {
        data = JSON.parse(settingsJson);
      } catch (e) {
        console.error("Błąd parsowania JSON ustawień: " + e.toString());
      }
    }

    // Jeśli w JSON nie ma NIP-u, używamy NIP-u rejestrowego z kolumny B
    if (!data.nip && registrationNip) {
      data.nip = registrationNip.toString();
    }

    return createJsonResponse({ status: 'success', data: data });
  } catch (e) {
    return createJsonResponse({ status: 'error', message: 'Błąd pobierania danych firmy: ' + e.toString() });
  }
}

/**
 * Zapisuje dane firmy do kolumny COMPANY_SETTINGS_JSON w arkuszu LISTA_KLIENTOW.
 */
function updateCompanyData(payload) {
  try {
    const email = payload.email;
    const data = payload.data; // { nip, companyName, address, iban, billingEmail }
    
    if (!email || !data) {
      return createJsonResponse({ status: 'error', message: 'Brak wymaganych danych (email lub data).' });
    }

    const masterSS = getOrCreateMasterIndex(getOrCreateSystemRoot());
    const userSheet = masterSS.getSheetByName(SYSTEM_CONFIG.MASTER_SHEET_USERS);
    
    if (!userSheet) {
      return createJsonResponse({ status: 'error', message: 'Brak arkusza LISTA_KLIENTOW.' });
    }

    const finder = userSheet.getRange("C:C").createTextFinder(email.toLowerCase()).matchCase(false);
    const cell = finder.findNext();
    
    if (!cell) {
      return createJsonResponse({ status: 'error', message: 'Użytkownik nie istnieje.' });
    }
    
    const rowIndex = cell.getRow();
    const settingsJson = JSON.stringify(data);
    
    // Zapis w kolumnie J (10) - JSON ustawień
    userSheet.getRange(rowIndex, 10).setValue(settingsJson);
    
    // Synchronizacja: Zapis Nazwy Firmy lub NIP w kolumnie B (2)
    const displayName = data.companyName || data.nip;
    if (displayName) {
      const nameRange = userSheet.getRange(rowIndex, 2);
      nameRange.setNumberFormat("@"); // Wymuszenie formatu tekstowego
      nameRange.setValue(displayName.toString());
    }

    return createJsonResponse({ status: 'success', message: 'Dane firmy zostały zaktualizowane.' });
  } catch (e) {
    return createJsonResponse({ status: 'error', message: 'Błąd aktualizacji danych firmy: ' + e.toString() });
  }
}
