/**
 * RPMS MULTI-TENANT ENGINE v10.1.0 (ScriptNiowe)
 * Plik: src/main_v2.gs
 */

const API_KEY = "TWOJ_TAJNY_KLUCZ_Z_AI_STUDIO"; // Powinien zgadzać się z env w Next.js

const SYSTEM_CONFIG = {
  ROOT_FOLDER_NAME: 'RPMS-Windykacja',
  MASTER_INDEX_NAME: 'RPMS_MASTER_INDEX',
  MASTER_SHEET_USERS: 'LISTA_KLIENTOW',
  CLIENT_SHEET_DEBTORS: 'DB_DLUZNICY',
  CLIENT_SHEET_CASES: 'DB_SPRAWY',
  CLIENT_SHEET_INVOICES: 'DB_FAKTURY'
};

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ status: 'error', message: 'Brak danych w żądaniu POST' });
    }

    let contents;
    try {
      contents = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return createJsonResponse({ status: 'error', message: 'Błąd parsowania JSON: ' + parseErr.toString() });
    }

    // KRYTYCZNE: Sprawdzenie klucza API
    if (contents.apiKey !== API_KEY) {
      return createJsonResponse({ status: 'error', message: 'Nieautoryzowany dostęp.' });
    }

    const action = contents.action;
    const payload = contents.payload || contents; 

    switch(action) {
      case 'CHECK_EMAIL_STATUS': return checkEmailStatus(payload.email);
      case 'REGISTER_USER':      return registerTenant(payload);
      case 'LOGIN_USER':         return verifyLogin(payload);
      
      // NOWE AKCJE AUTH 2.0
      case 'ACTIVATE_ACCOUNT':        return activateAccount(payload);
      case 'REQUEST_PASSWORD_RESET':  return requestPasswordReset(payload);
      case 'RESET_PASSWORD':          return resetPassword(payload);
      case 'RESEND_ACTIVATION_EMAIL': return resendActivationEmail(payload);

      case 'INIT_DEBT':          return batchInitDebt({...payload, items: [payload]});
      case 'BATCH_INIT_DEBT':    return batchInitDebt(payload);
      case 'UPDATE_STATUS':      return updateStatus(payload);
      case 'UPDATE_DEBTOR_EMAIL': return updateDebtorEmail(payload);
      case 'GET_FILE_BLOB':      return getFileBlob(payload);
      case 'DELETE_CASE':        return deleteCase(payload);
      case 'DELETE_INVOICE':     return deleteInvoice(payload);
      case 'UPDATE_DEBT_DATA':   return updateDebtData(payload);
      case 'UPDATE_CMS':         return handleUpdateCMSContent(payload);
      case 'INITIALIZE_CMS':     return handleInitializeCMS(payload);
      case 'LOG_EVENT':          return logEventToSheet(payload);
      default: return createJsonResponse({ status: 'error', message: 'Nieznana akcja: ' + action });
    }
  } catch (err) { 
    try {
      return createJsonResponse({ status: 'error', message: "Silnik Backendowy (Krytyczny): " + err.toString() }); 
    } catch (finalErr) {
      return ContentService.createTextOutput("Fatal Error: " + err.toString());
    }
  }
}

function doGet(e) {
  try {
    const params = e.parameter || {};
    if (params.path === 'sitemap.xml') {
      return generateSitemap();
    }
    if (params.action === 'GET_CMS' || !params.email) {
      if (params.action === 'GET_LOGS') {
        return getLogsFromSheet();
      }
      return handleGetCMSContent();
    }
    return handleFetchDashboard(params.email);
  } catch (err) {
    return ContentService.createTextOutput("Critical Error: " + err.toString());
  }
}
