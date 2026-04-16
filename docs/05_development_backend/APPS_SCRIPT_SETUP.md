# Konfiguracja Google Apps Script (Backend)

Dokument zawiera instrukcje i fragmenty kodu niezbędne do poprawnej konfiguracji backendu opartego na Google Apps Script.

## 1. Obsługa Akcji (doPost i doGet)
Główny skrypt (`main.gs`) musi obsługiwać akcje przesyłane z frontendu Next.js.

### Logowanie Zdarzeń (Custom Logging)
```javascript
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  if (data.action === 'LOG_EVENT') {
    return logEventToSheet(data);
  }
}

function logEventToSheet(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("ActivityLogs") || ss.insertSheet("ActivityLogs");
  
  // Nagłówki jeśli arkusz jest nowy
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Event Name", "User Email", "Metadata", "URL"]);
  }
  
  sheet.appendRow([
    data.timestamp,
    data.event_name,
    data.user_email,
    data.metadata,
    data.url
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({status: "success"}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 2. Zarządzanie Treścią (CMS)
Skrypt musi umożliwiać pobieranie i aktualizację treści strony przechowywanej w arkuszu `CMS_Content`.

### Pobieranie Treści (GET_CMS)
```javascript
function doGet(e) {
  var action = e.parameter.action;
  if (action === 'GET_CMS') {
    return getCMSContent();
  }
}

function getCMSContent() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CMS_Content");
  var data = sheet.getDataRange().getValues();
  // Logika mapowania wierszy na obiekt JSON...
}
```

## 3. Procedura Wdrożenia
Po każdej zmianie kodu w edytorze Apps Script:
1. Kliknij **Wdróż** (Deploy) -> **Zarządzaj wdrożeniami**.
2. Edytuj aktualne wdrożenie.
3. Wybierz **Nowa wersja** (New version).
4. Kliknij **Wdróż**.
5. Skopiuj **Adres URL aplikacji internetowej** i wklej go do zmiennej `NEXT_PUBLIC_CMS_BACKEND_URL` w pliku `.env`.

## 4. Bezpieczeństwo
- Skrypt musi być wdrożony jako: **Wykonaj jako: Ja** (Administrator).
- Dostęp: **Każdy** (ponieważ Next.js komunikuje się z nim po stronie serwera lub klienta, a autoryzacja odbywa się za pomocą `APPS_SCRIPT_API_KEY` przesyłanego w nagłówkach lub body).
