const SHEET_NAME = "Leads";
const SPREADSHEET_ID = "1bJGMfv3bmo8yoyBqWkmxHSbqJld0Qq5RFHmK6gIwcQA";

function doPost(event) {
  const sheet = getLeadsSheet_();
  const data = JSON.parse(event.postData.contents || "{}");
  const nextRow = sheet.getLastRow() + 1;
  const row = [
    data.data || new Date().toISOString(),
    data.nome || "",
    data.whatsapp || "",
    data.pais || "",
    data.email || "",
    data.origem || "",
    data.pagina || "",
  ];

  sheet.getRange(nextRow, 3).setNumberFormat("@");
  sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getLeadsSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Data", "Nome", "WhatsApp", "País", "E-mail", "Origem", "Pagina"]);
  } else {
    ensureCountryColumn_(sheet);
  }

  return sheet;
}

function ensureCountryColumn_(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const whatsappColumn = headers.indexOf("WhatsApp") + 1;
  const countryColumn = headers.indexOf("País") + 1;
  const insertAfter = whatsappColumn || 3;

  if (!countryColumn) {
    sheet.insertColumnAfter(insertAfter);
    sheet.getRange(1, insertAfter + 1).setValue("País");
  }

  if (whatsappColumn) {
    sheet.getRange(2, whatsappColumn, Math.max(sheet.getMaxRows() - 1, 1), 1).setNumberFormat("@");
  }
}

function normalizarPaisBrasilExistentes() {
  const sheet = getLeadsSheet_();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const whatsappColumn = headers.indexOf("WhatsApp") + 1;
  const countryColumn = headers.indexOf("País") + 1;

  if (!countryColumn || sheet.getLastRow() < 2) {
    return;
  }

  sheet
    .getRange(2, countryColumn, sheet.getLastRow() - 1, 1)
    .setValue("🇧🇷 Brasil");

  if (!whatsappColumn) {
    return;
  }

  const phoneRange = sheet.getRange(2, whatsappColumn, sheet.getLastRow() - 1, 1);
  const phones = phoneRange.getValues().map(([phone]) => {
    const raw = String(phone || "").trim();

    if (!raw) {
      return [raw];
    }

    const digits = raw.replace(/\D/g, "");

    if (!digits) {
      return [raw];
    }

    if (raw.startsWith("+")) {
      return [raw.replace(/^\+/, "")];
    }

    return [digits.startsWith("55") ? digits : `55 ${raw}`];
  });

  phoneRange.setNumberFormat("@");
  phoneRange.setValues(phones);
}
