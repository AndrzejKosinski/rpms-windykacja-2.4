/**
 * RPMS ANALYTICS ENGINE v1.1.0
 * Plik: src/analytics.gs
 */

function getLogSpreadsheet() {
  const root = getOrCreateSystemRoot();
  const fileName = "RPMS_ACTIVITY_LOGS";
  const files = root.getFilesByName(fileName);
  
  if (files.hasNext()) {
    return SpreadsheetApp.openById(files.next().getId());
  }
  
  const ss = SpreadsheetApp.create(fileName);
  DriveApp.getFileById(ss.getId()).moveTo(root);
  
  const sheet = ss.getSheets()[0];
  sheet.setName("ActivityLogs");
  sheet.appendRow(["Timestamp", "Event Name", "User Email", "Session ID", "Metadata", "URL", "User Agent"]);
  sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#f3f3f3");
  sheet.setFrozenRows(1);
  
  return ss;
}

function logEventToSheet(data) {
  try {
    const ss = getLogSpreadsheet();
    let sheet = ss.getSheetByName("ActivityLogs");
    
    if (!sheet) {
      sheet = ss.insertSheet("ActivityLogs");
      sheet.appendRow(["Timestamp", "Event Name", "User Email", "Session ID", "Metadata", "URL", "User Agent"]);
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#f3f3f3");
      sheet.setFrozenRows(1);
    }
    
    sheet.appendRow([
      data.timestamp,
      data.event_name,
      data.user_email,
      data.session_id,
      data.metadata,
      data.url,
      data.user_agent
    ]);
    
    return createJsonResponse({status: "success"});
  } catch (err) {
    return createJsonResponse({status: "error", message: err.toString()});
  }
}

function getLogsFromSheet() {
  try {
    const ss = getLogSpreadsheet();
    const sheet = ss.getSheetByName("ActivityLogs");
    
    if (!sheet) {
      return createJsonResponse({logs: []});
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const logs = rows.map(function(row) {
      const obj = {};
      headers.forEach(function(header, i) {
        const key = header.toLowerCase().replace(/ /g, "_");
        obj[key] = row[i];
      });
      return obj;
    });
    
    return createJsonResponse({logs: logs});
  } catch (err) {
    return createJsonResponse({status: "error", message: err.toString()});
  }
}
