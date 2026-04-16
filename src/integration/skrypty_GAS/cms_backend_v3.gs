/**
 * CMS Backend Logic for Google Apps Script
 * Obsługuje pobieranie i zapisywanie treści strony z dedykowanego skoroszytu "RPMS_CMS_DATABASE".
 * Wersja 3: Dodano obsługę Dynamic Design System (DDS) w zakładce "DDS_Config"
 */

const CMS_CONFIG = {
  DATABASE_NAME: 'RPMS_CMS_DATABASE',
  SHEET_NAME: 'CMS_Content',
  DDS_SHEET_NAME: 'DDS_Config'
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

/**
 * DDS - Pobieranie konfiguracji
 */
function handleGetDDS() {
  try {
    const ss = getCMSSpreadsheet();
    if (!ss) return createJsonResponse({ status: 'CMS_NOT_INITIALIZED' });
    
    let sheet = ss.getSheetByName(CMS_CONFIG.DDS_SHEET_NAME);
    if (!sheet) return createJsonResponse({ status: 'DDS_NOT_INITIALIZED' });

    const data = sheet.getDataRange().getValues();
    const config = {};
    
    for (let i = 1; i < data.length; i++) {
      const key = data[i][0];
      const value = data[i][1];
      const type = data[i][2];
      
      if (key) {
        if (type === "JSON") {
          try {
            config[key] = JSON.parse(value);
          } catch (e) {
            config[key] = value;
          }
        } else {
          config[key] = value;
        }
      }
    }
    return createJsonResponse({ status: 'success', data: config.dds_full_config || {} });
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * DDS - Aktualizacja konfiguracji
 */
function handleUpdateDDS(payload) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const ss = getCMSSpreadsheet();
    if (!ss) return createJsonResponse({ status: "error", message: "Baza CMS nie zainicjalizowana." });

    let sheet = ss.getSheetByName(CMS_CONFIG.DDS_SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(CMS_CONFIG.DDS_SHEET_NAME);
      sheet.appendRow(["Klucz", "Wartość", "Typ", "Opis"]);
      sheet.getRange("A1:D1").setFontWeight("bold").setBackground("#d9ead3");
    }

    const data = payload.data;
    const range = sheet.getDataRange();
    const values = range.getValues();
    let found = false;
    
    for (let i = 0; i < values.length; i++) {
      if (values[i][0] === "dds_full_config") {
        sheet.getRange(i + 1, 2).setValue(JSON.stringify(data));
        sheet.getRange(i + 1, 3).setValue("JSON");
        sheet.getRange(i + 1, 4).setValue("Ostatnia aktualizacja: " + new Date().toISOString());
        found = true;
        break;
      }
    }
    
    if (!found) {
      sheet.appendRow(["dds_full_config", JSON.stringify(data), "JSON", "Ostatnia aktualizacja: " + new Date().toISOString()]);
    }
    
    return createJsonResponse({ status: "success" });

  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function handleGetCMSContent(view) {
  try {
    let content = getCMSContentData();
    if (content.status === 'CMS_NOT_INITIALIZED') {
      return createJsonResponse(content);
    }
    
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
    
    // Inicjalizacja DDS
    const ddsSheet = ss.insertSheet(CMS_CONFIG.DDS_SHEET_NAME);
    ddsSheet.appendRow(["Klucz", "Wartość", "Typ", "Opis"]);
    ddsSheet.getRange("A1:D1").setFontWeight("bold").setBackground("#d9ead3");
    
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

function generateIndexView(fullData) {
  if (!fullData) return fullData;
  const optimizedData = JSON.parse(JSON.stringify(fullData));
  if (optimizedData.blog && Array.isArray(optimizedData.blog)) {
    optimizedData.blog = optimizedData.blog.map(post => {
      delete post.content;
      delete post.faqs;
      delete post.seo;
      return post;
    });
  }
  return optimizedData;
}
