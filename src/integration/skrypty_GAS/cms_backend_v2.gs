/**
 * CMS Backend Logic for Google Apps Script
 * Obsługuje pobieranie i zapisywanie treści strony z dedykowanego skoroszytu "RPMS_CMS_DATABASE".
 * Wersja 2: Dodano obsługę parametru view=index dla optymalizacji N+1
 */

const CMS_CONFIG = {
  DATABASE_NAME: 'RPMS_CMS_DATABASE',
  SHEET_NAME: 'CMS_Content'
};

function getCMSSpreadsheet() {
  try {
    const root = getOrCreateSystemRoot();
    const files = root.getFilesByName(CMS_CONFIG.DATABASE_NAME);
    if (files.hasNext()) {
      return SpreadsheetApp.openById(files.next().getId());
    }
    return null;
  } catch (e) {
    console.error("Błąd otwierania arkusza CMS: " + e.toString());
    return null;
  }
}

function handleGetCMSContent(view) {
  try {
    let content = getCMSContentData();
    if (content.status === 'CMS_NOT_INITIALIZED') {
      return createJsonResponse(content);
    }
    
    // Optymalizacja N+1: Odchudzanie danych jeśli zażądano widoku index
    if (view === 'index' && content.full_content) {
      content.full_content = generateIndexView(content.full_content);
    }
    
    return createJsonResponse(content);
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

function getCMSContentData() {
  const ss = getCMSSpreadsheet();
  if (!ss) {
    return { status: 'CMS_NOT_INITIALIZED' };
  }
  
  let sheet = ss.getSheetByName(CMS_CONFIG.SHEET_NAME);
  if (!sheet) {
    return { status: 'error', message: 'CMS_Content sheet not found in database' };
  }

  const data = sheet.getDataRange().getValues();
  const content = {};
  
  for (let i = 1; i < data.length; i++) {
    const key = data[i][0];
    const value = data[i][1];
    const type = data[i][2];
    
    if (key) {
      if (type === "JSON") {
        try {
          content[key] = JSON.parse(value);
        } catch (e) {
          content[key] = value;
        }
      } else {
        content[key] = value;
      }
    }
  }
  return content;
}

function handleInitializeCMS(payload) {
  const lock = LockService.getScriptLock();
  lock.tryLock(15000);
  
  try {
    const root = getOrCreateSystemRoot();
    const existingFiles = root.getFilesByName(CMS_CONFIG.DATABASE_NAME);
    if (existingFiles.hasNext()) {
       return createJsonResponse({ status: "error", message: "Baza CMS już istnieje." });
    }

    const ss = SpreadsheetApp.create(CMS_CONFIG.DATABASE_NAME);
    DriveApp.getFileById(ss.getId()).moveTo(root);
    
    const sheet = ss.getSheets()[0];
    sheet.setName(CMS_CONFIG.SHEET_NAME);
    sheet.appendRow(["Klucz", "Wartość", "Typ"]);

    const data = payload.data;
    sheet.appendRow(["full_content", JSON.stringify(data), "JSON"]);
    
    return createJsonResponse({ status: "success" });

  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function handleUpdateCMSContent(payload) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const ss = getCMSSpreadsheet();
    if (!ss) {
      return createJsonResponse({ status: "error", message: "Baza CMS nie zainicjalizowana." });
    }

    let sheet = ss.getSheetByName(CMS_CONFIG.SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(CMS_CONFIG.SHEET_NAME);
      sheet.appendRow(["Klucz", "Wartość", "Typ"]);
    }

    const data = payload.data;
    const range = sheet.getDataRange();
    const values = range.getValues();
    let found = false;
    
    for (let i = 0; i < values.length; i++) {
      if (values[i][0] === "full_content") {
        sheet.getRange(i + 1, 2).setValue(JSON.stringify(data));
        sheet.getRange(i + 1, 3).setValue("JSON");
        found = true;
        break;
      }
    }
    
    if (!found) {
      sheet.appendRow(["full_content", JSON.stringify(data), "JSON"]);
    }
    
    return createJsonResponse({ status: "success" });

  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Generuje odchudzoną wersję danych CMS.
 * Usuwa ciężkie pola z artykułów na blogu.
 */
function generateIndexView(fullData) {
  if (!fullData) return fullData;
  
  // Tworzymy głęboką kopię, aby nie modyfikować oryginału
  const optimizedData = JSON.parse(JSON.stringify(fullData));
  
  if (optimizedData.blog && Array.isArray(optimizedData.blog)) {
    optimizedData.blog = optimizedData.blog.map(post => {
      // Usuwamy ciężkie pola
      delete post.content;
      delete post.faqs;
      delete post.seo;
      
      return post;
    });
  }
  
  return optimizedData;
}
