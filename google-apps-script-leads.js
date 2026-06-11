const SHEET_NAME = "Leads";

function doPost(event) {
  const sheet = getLeadsSheet_();
  const data = JSON.parse(event.postData.contents || "{}");

  sheet.appendRow([
    data.data || new Date().toISOString(),
    data.nome || "",
    data.whatsapp || "",
    data.email || "",
    data.origem || "",
    data.pagina || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getLeadsSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Data", "Nome", "WhatsApp", "E-mail", "Origem", "Pagina"]);
  }

  return sheet;
}
