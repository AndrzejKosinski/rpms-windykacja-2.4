/**
 * Plik: src/integration/ScriptNiowe/utils_v2.gs
 * Wersja: 10.2.0
 * Rozszerzony o obsługę logowania zdarzeń (History JSON)
 */

/**
 * Generuje skrót SHA-256 dla hasła
 */
function hashPassword(password) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
  let hash = '';
  for (let i = 0; i < digest.length; i++) {
    let byte = digest[i];
    if (byte < 0) byte += 256;
    let hex = byte.toString(16);
    if (hex.length === 1) hex = '0' + hex;
    hash += hex;
  }
  return hash;
}

function parseSafeDate(dStr) {
  if (!dStr || dStr === "" || dStr.includes("1970")) return "";
  const parts = dStr.split('-');
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 12, 0, 0);
    return isNaN(d.getTime()) ? "" : d;
  }
  const fallback = new Date(dStr);
  return isNaN(fallback.getTime()) ? "" : fallback;
}

function getTenantInfo(email) {
  try {
    const root = getOrCreateSystemRoot();
    const masterSS = getOrCreateMasterIndex(root);
    const data = masterSS.getSheetByName(SYSTEM_CONFIG.MASTER_SHEET_USERS).getDataRange().getValues();
    const row = data.find(r => r[2] === email.toLowerCase());
    if (row) return { clientId: row[0], name: row[1], email: row[2], folderId: row[4], spreadsheetId: row[5] };
    return null;
  } catch (e) { return null; }
}

function getOrCreateSystemRoot() {
  const folders = DriveApp.getFoldersByName(SYSTEM_CONFIG.ROOT_FOLDER_NAME);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(SYSTEM_CONFIG.ROOT_FOLDER_NAME);
}

function getOrCreateMasterIndex(root) {
  const files = root.getFilesByName(SYSTEM_CONFIG.MASTER_INDEX_NAME);
  if (files.hasNext()) return SpreadsheetApp.openById(files.next().getId());
  const ss = SpreadsheetApp.create(SYSTEM_CONFIG.MASTER_INDEX_NAME);
  DriveApp.getFileById(ss.getId()).moveTo(root);
  ss.getSheets()[0].setName(SYSTEM_CONFIG.MASTER_SHEET_USERS).appendRow(["CLIENT_ID", "CLIENT_NAME", "EMAIL", "PASSWORD", "FOLDER_ID", "SPREADSHEET_ID", "PANEL_STATUS", "CREATED_AT"]);
  return ss;
}

function getOrCreateFolder(parent, name) {
  const f = parent.getFoldersByName(name);
  return f.hasNext() ? f.next() : parent.createFolder(name);
}

function createJsonResponse(obj) { 
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); 
}

function getFileBlob(p) {
  try {
    const file = DriveApp.getFileById(p.fileId);
    return createJsonResponse({ 
      status: 'success', 
      data: Utilities.base64Encode(file.getBlob().getBytes()), 
      fileName: file.getName(), 
      mimeType: file.getBlob().getContentType() 
    });
  } catch (err) { return createJsonResponse({ status: 'error', message: err.toString() }); }
}

/**
 * Loguje zdarzenie do kolumny HISTORY_JSON (Kolumna G / 7)
 */
function logCaseEvent(sheet, rowIndex, type, label, value) {
  try {
    const historyCell = sheet.getRange(rowIndex, 7); 
    let history = [];
    const raw = historyCell.getValue();
    
    if (raw && raw !== "") {
      try {
        history = JSON.parse(raw);
      } catch(e) {
        history = [];
      }
    }
    
    history.push({
      type: type,
      date: new Date().toISOString(),
      label: label,
      value: value || ""
    });
    
    historyCell.setValue(JSON.stringify(history));
  } catch (e) {
    console.error("Błąd logowania zdarzenia: " + e.toString());
  }
}
