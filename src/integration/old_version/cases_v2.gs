/**
 * Plik: src/integration/ScriptNiowe/cases_v2.gs
 * Wersja: 10.2.0
 * Moduł zarządzania wierzytelnościami z elastycznym modelem historii i metadanych.
 */

function batchInitDebt(payload) {
  try {
    let tenant = getTenantInfo(payload.userEmail);
    if (!tenant) {
      registerTenant({ email: payload.userEmail, name: payload.userName, password: payload.password, isLead: true });
      tenant = getTenantInfo(payload.userEmail);
    }

    const ss = SpreadsheetApp.openById(tenant.spreadsheetId);
    const debtorSheet = ss.getSheetByName(SYSTEM_CONFIG.CLIENT_SHEET_DEBTORS);
    const caseSheet = ss.getSheetByName(SYSTEM_CONFIG.CLIENT_SHEET_CASES);
    const invoiceSheet = ss.getSheetByName(SYSTEM_CONFIG.CLIENT_SHEET_INVOICES);
    const invFolder = getOrCreateFolder(DriveApp.getFolderById(tenant.folderId), "01_Faktury");

    const debtorsData = debtorSheet.getDataRange().getValues();
    const debtorMap = {};
    for (let i = 1; i < debtorsData.length; i++) {
      debtorMap[debtorsData[i][1].toString()] = debtorsData[i][0];
    }

    const casesData = caseSheet.getDataRange().getValues();
    const activeConsolidationMap = {}; 
    for (let i = 1; i < casesData.length; i++) {
      if (casesData[i][2] === "Nowa sprawa") {
        activeConsolidationMap[casesData[i][1]] = casesData[i][0];
      }
    }

    let invoiceNumbers = [];

    payload.items.forEach(item => {
      const nipStr = item.nip.toString();
      let debtorId = debtorMap[nipStr];
      
      if (!debtorId) {
        debtorId = "DBT-" + Utilities.getUuid().substring(0, 6).toUpperCase();
        debtorSheet.appendRow([
          debtorId, 
          item.nip, 
          item.debtorName, 
          item.address || "Brak adresu", 
          item.krs || "", 
          item.correspondenceAddress || "", 
          item.isForeign ? "TAK" : "NIE", 
          "", 
          new Date(), 
          payload.userEmail.toLowerCase()
        ]);
        debtorMap[nipStr] = debtorId;
      }

      let caseId = activeConsolidationMap[debtorId];
      
      if (!caseId) {
        caseId = "CASE-" + Utilities.getUuid().substring(0, 6).toUpperCase();
        const now = new Date();
        const initialHistory = JSON.stringify([{
          type: 'STATUS_CHANGE',
          date: now.toISOString(),
          label: 'Sprawa dodana do systemu'
        }]);
        
        // Nowa struktura wiersza: ID, DebtorID, Status, Strategia, START_DATE, Email, HISTORY_JSON, METADATA_JSON
        caseSheet.appendRow([
          caseId, 
          debtorId, 
          "Nowa sprawa", 
          "Standardowa", 
          now, 
          payload.userEmail.toLowerCase(),
          initialHistory,
          "{}"
        ]);
        activeConsolidationMap[debtorId] = caseId;
      }

      let fileUrl = "";
      if (item.fileData) {
        const blob = Utilities.newBlob(Utilities.base64Decode(item.fileData), item.fileType, item.fileName);
        const file = invFolder.createFile(blob);
        fileUrl = file.getUrl();
      }

      const issueDate = parseSafeDate(item.issueDate);
      const dueDate = parseSafeDate(item.dueDate);
      const amountClean = item.amount ? item.amount.toString().replace(/[^\d.,]/g, '').replace(',', '.') : "0";
      
      const invNum = item.invoiceNumber || "FA/" + Utilities.getUuid().substring(0,4);
      invoiceNumbers.push(invNum);

      invoiceSheet.appendRow([
        "INV-" + Utilities.getUuid().substring(0, 6).toUpperCase(),
        caseId,
        invNum,      
        issueDate,                     
        dueDate,                       
        amountClean,                   
        item.netAmount || "",
        item.vatAmount || "",
        item.currency || "PLN",
        item.description || item.invoiceSubject || "",
        item.isContested === 'YES' ? "TAK" : "NIE",
        fileUrl,
        new Date(),                    
        item.fileData ? "DOCUMENT" : "MANUAL",
        payload.userEmail.toLowerCase()
      ]);
    });

    sendSystemEmail(payload.userEmail.toLowerCase(), 'CONFIRM_LEAD_DEBT', {
      'CASE_DETAILS': invoiceNumbers.join(', '),
      'DASHBOARD_URL': 'https://rpms-windykacja.pl/panel'
    });

    return createJsonResponse({ status: 'success', processed: payload.items.length });
  } catch (err) { 
    return createJsonResponse({ status: 'error', message: "Błąd zapisu w cases_v2.gs: " + err.toString() }); 
  }
}

function handleFetchDashboard(email) {
  try {
    const tenant = getTenantInfo(email);
    if (!tenant) return createJsonResponse({ status: 'error', message: 'Nie znaleziono konta dla ' + email });
    
    const ss = SpreadsheetApp.openById(tenant.spreadsheetId);
    const debtorsData = ss.getSheetByName(SYSTEM_CONFIG.CLIENT_SHEET_DEBTORS).getDataRange().getValues();
    const casesData = ss.getSheetByName(SYSTEM_CONFIG.CLIENT_SHEET_CASES).getDataRange().getValues();
    const invoicesData = ss.getSheetByName(SYSTEM_CONFIG.CLIENT_SHEET_INVOICES).getDataRange().getValues();
    
    const groups = {};
    for (let i = 1; i < invoicesData.length; i++) {
      const r = invoicesData[i];
      if (!groups[r[1]]) groups[r[1]] = [];
      groups[r[1]].push({
        id: r[0],
        invoiceNumber: r[2],
        issueDate: (r[3] instanceof Date) ? Utilities.formatDate(r[3], "GMT+1", "yyyy-MM-dd") : r[3],
        dueDate: (r[4] instanceof Date) ? Utilities.formatDate(r[4], "GMT+1", "yyyy-MM-dd") : r[4],
        amountValue: parseFloat(r[5] || 0),
        amount: parseFloat(r[5] || 0).toLocaleString('pl-PL', { minimumFractionDigits: 2 }) + " " + (r[8] || "PLN"),
        currency: r[8] || "PLN",
        description: r[9] || "",
        isContested: r[10] === 'TAK' ? 'YES' : 'NO',
        fileUrl: r[11],
        timestamp: (r[12] instanceof Date) ? Utilities.formatDate(r[12], "GMT+1", "yyyy-MM-dd HH:mm") : r[12],
        type: r[13]
      });
    }

    const cases = [];
    for (let i = 1; i < casesData.length; i++) {
      const row = casesData[i];
      const caseId = row[0];
      const debtorId = row[1];
      const status = row[2];
      const strategy = row[3];
      const startDate = row[4];
      const history = row[6];
      const metadata = row[7];
      
      const debtor = debtorsData.find(d => d[0] === debtorId);
      if (debtor) {
        const cInv = groups[caseId] || [];
        cases.push({
          caseId, 
          debtorName: debtor[2], 
          nip: debtor[1], 
          address: debtor[3],
          status, 
          strategy, 
          createdAt: (startDate instanceof Date) ? startDate.toISOString() : startDate,
          history: history || "[]",
          metadata: metadata || "{}",
          totalAmount: cInv.reduce((s,v)=>s+v.amountValue,0).toLocaleString('pl-PL', {minimumFractionDigits:2}) + " " + (cInv[0]?.currency || "PLN"),
          invoices: cInv.reverse()
        });
      }
    }
    return createJsonResponse({ status: 'success', cases: cases.reverse() });
  } catch (err) { return createJsonResponse({ status: 'error', message: err.toString() }); }
}

function updateDebtData(p) {
  try {
    const tenant = getTenantInfo(p.userEmail);
    const ss = SpreadsheetApp.openById(tenant.spreadsheetId);
    
    if (p.editType === 'DEBTOR' || !p.editType) {
      const debtorSheet = ss.getSheetByName(SYSTEM_CONFIG.CLIENT_SHEET_DEBTORS);
      const dData = debtorSheet.getDataRange().getValues();
      const dIdx = dData.findIndex(d => d[1].toString() === p.nip.toString());
      if (dIdx !== -1) {
        debtorSheet.getRange(dIdx + 1, 3).setValue(p.debtorName);
        debtorSheet.getRange(dIdx + 1, 4).setValue(p.address || "");
        debtorSheet.getRange(dIdx + 1, 5).setValue(p.krs || "");
        debtorSheet.getRange(dIdx + 1, 6).setValue(p.correspondenceAddress || "");
      }
    }

    if (p.editType === 'INVOICE' || !p.editType) {
      const invSheet = ss.getSheetByName(SYSTEM_CONFIG.CLIENT_SHEET_INVOICES);
      const iData = invSheet.getDataRange().getValues();
      
      let iIdx = -1;
      if (p.invoiceId) {
        iIdx = iData.findIndex(inv => inv[0] === p.invoiceId);
      } else {
        iIdx = iData.findIndex(inv => inv[1] === p.caseId);
      }

      if (iIdx !== -1) {
        invSheet.getRange(iIdx + 1, 3).setValue(p.invoiceNumber || "");
        invSheet.getRange(iIdx + 1, 4).setValue(p.issueDate ? parseSafeDate(p.issueDate) : "");
        invSheet.getRange(iIdx + 1, 5).setValue(p.dueDate ? parseSafeDate(p.dueDate) : "");
        invSheet.getRange(iIdx + 1, 6).setValue(p.amount.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
        invSheet.getRange(iIdx + 1, 9).setValue(p.currency || "PLN");
        invSheet.getRange(iIdx + 1, 10).setValue(p.description || "");
        invSheet.getRange(iIdx + 1, 11).setValue(p.isContested === 'YES' ? "TAK" : "NIE");
      }
    }

    return createJsonResponse({ status: 'success' });
  } catch (e) { return createJsonResponse({ status: 'error', message: "Błąd aktualizacji: " + e.toString() }); }
}

function updateStatus(p) {
  try {
    const ss = SpreadsheetApp.openById(getTenantInfo(p.userEmail).spreadsheetId);
    const sheet = ss.getSheetByName(SYSTEM_CONFIG.CLIENT_SHEET_CASES);
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) { 
      if (data[i][0] === p.caseId) { 
        sheet.getRange(i+1, 3).setValue(p.newStatus); 
        
        // Logowanie zmiany statusu do historii
        logCaseEvent(sheet, i + 1, 'STATUS_CHANGE', 'Zmiana statusu na: ' + p.newStatus);
        
        return createJsonResponse({ status: 'success' }); 
      } 
    }
    return createJsonResponse({ status: 'error', message: 'Nie znaleziono sprawy o ID ' + p.caseId });
  } catch (e) {
    return createJsonResponse({ status: 'error', message: e.toString() });
  }
}

function deleteCase(p) {
  try {
    const ss = SpreadsheetApp.openById(getTenantInfo(p.userEmail).spreadsheetId);
    const caseSheet = ss.getSheetByName(SYSTEM_CONFIG.CLIENT_SHEET_CASES);
    const invSheet = ss.getSheetByName(SYSTEM_CONFIG.CLIENT_SHEET_INVOICES);
    
    const cData = caseSheet.getDataRange().getValues();
    for (let i = cData.length - 1; i >= 1; i--) { if (cData[i][0] === p.caseId) caseSheet.deleteRow(i + 1); }
    
    const iData = invSheet.getDataRange().getValues();
    for (let j = iData.length - 1; j >= 1; j--) { if (iData[j][1] === p.caseId) invSheet.deleteRow(j + 1); }
    
    return createJsonResponse({ status: 'success' });
  } catch (err) { return createJsonResponse({ status: 'error', message: err.toString() }); }
}

function deleteInvoice(p) {
  try {
    const tenant = getTenantInfo(p.userEmail);
    const ss = SpreadsheetApp.openById(tenant.spreadsheetId);
    const invSheet = ss.getSheetByName(SYSTEM_CONFIG.CLIENT_SHEET_INVOICES);
    const iData = invSheet.getDataRange().getValues();
    
    const idx = iData.findIndex(inv => inv[0] === p.invoiceId);
    if (idx !== -1) {
      invSheet.deleteRow(idx + 1);
      
      const remainingData = invSheet.getDataRange().getValues();
      const hasMore = remainingData.some(inv => inv[1] === p.caseId);
      
      if (!hasMore) {
        const caseSheet = ss.getSheetByName(SYSTEM_CONFIG.CLIENT_SHEET_CASES);
        const cData = caseSheet.getDataRange().getValues();
        const cIdx = cData.findIndex(c => c[0] === p.caseId);
        if (cIdx !== -1) caseSheet.deleteRow(cIdx + 1);
      }
      
      return createJsonResponse({ status: 'success' });
    }
    return createJsonResponse({ status: 'error', message: 'Nie znaleziono faktury' });
  } catch (err) { return createJsonResponse({ status: 'error', message: err.toString() }); }
}

function updateDebtorEmail(p) {
  const ss = SpreadsheetApp.openById(getTenantInfo(p.userEmail).spreadsheetId);
  const sheet = ss.getSheetByName(SYSTEM_CONFIG.CLIENT_SHEET_DEBTORS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) { 
    if (data[i][1].toString() === p.nip.toString()) { 
      sheet.getRange(i+1, 8).setValue(p.email); 
      return createJsonResponse({ status: 'success' }); 
    } 
  }
  return createJsonResponse({ status: 'error' });
}
