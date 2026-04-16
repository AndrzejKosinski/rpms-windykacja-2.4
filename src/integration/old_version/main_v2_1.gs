/**
 * RPMS MULTI-TENANT ENGINE v10.1.1 (ScriptNiowe)
 * Plik: src/main_v2_1.gs
 * Zawiera przywróconą logikę Sitemap.
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

/**
 * Generowanie mapy strony XML
 */
function generateSitemap() {
  try {
    const content = getCMSContentData();
    const baseUrl = "https://rpms-windykacja.pl"; 
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    
    xml += '<url>';
    xml += '<loc>' + baseUrl + '/</loc>';
    xml += '<changefreq>weekly</changefreq>';
    xml += '<priority>1.0</priority>';
    xml += '</url>';
    
    xml += '<url>';
    xml += '<loc>' + baseUrl + '/blog</loc>';
    xml += '<changefreq>daily</changefreq>';
    xml += '<priority>0.8</priority>';
    xml += '</url>';
    
    if (content && content.full_content && content.full_content.blog) {
      content.full_content.blog.forEach(function(post) {
        if (post.status === 'published') {
          xml += '<url>';
          const postPath = post.slug ? post.slug : post.id;
          xml += '<loc>' + baseUrl + '/blog/' + escapeXml(postPath) + '</loc>';
          xml += '<lastmod>' + (post.publishedAt || new Date().toISOString().split('T')[0]) + '</lastmod>';
          xml += '<changefreq>monthly</changefreq>';
          xml += '<priority>0.6</priority>';
          xml += '</url>';
        }
      });
    }
    
    xml += '</urlset>';
    
    return ContentService.createTextOutput(xml)
      .setMimeType(ContentService.MimeType.XML);
  } catch (err) {
    return ContentService.createTextOutput("Sitemap Error: " + err.toString());
  }
}

/**
 * Pomocnicza funkcja do ucieczki znaków XML
 */
function escapeXml(unsafe) {
  if (!unsafe) return "";
  return unsafe.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
