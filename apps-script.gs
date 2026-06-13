const SHEET_ID = "1id-FLNO1zvsfuVEVwLKfAg55F4PU-e1JthuPGY01Axw";
const SHEET_NAME = "Foglio1";

function doPost(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents || "{}");
  const timestamp = new Date();
  const signature = createSignature_(timestamp, data);

  sheet.appendRow([
    timestamp,
    clean_(data.groupName),
    clean_(data.finalGrade),
    Number(data.firstTryCorrectAnswers) || 0,
    Number(data.totalAnswers) || 0,
    Number(data.wrongAnswers) || 0,
    signature
  ]);

  updateWinnerFormatting_(sheet);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function aggiornaVincitore() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  updateWinnerFormatting_(sheet);
}

function updateWinnerFormatting_(sheet) {
  const lastRow = sheet.getLastRow();
  const lastColumn = 7;

  if (lastRow < 2) return;

  const dataRange = sheet.getRange(2, 1, lastRow - 1, lastColumn);
  dataRange
    .setBackground(null)
    .setFontColor(null)
    .setFontWeight("normal");

  const rows = dataRange.getValues();
  let winner = null;

  rows.forEach((row, index) => {
    const entry = {
      rowNumber: index + 2,
      timestamp: row[0] instanceof Date ? row[0].getTime() : new Date(row[0]).getTime(),
      grade: parseGrade_(row[2]),
      wrongAnswers: Number(row[5]) || 0
    };

    if (!winner || isBetterEntry_(entry, winner)) {
      winner = entry;
    }
  });

  if (!winner) return;

  sheet.getRange(winner.rowNumber, 1, 1, lastColumn)
    .setBackground("#1f7a4d")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
}

function isBetterEntry_(entry, currentWinner) {
  if (entry.grade !== currentWinner.grade) {
    return entry.grade > currentWinner.grade;
  }
  if (entry.wrongAnswers !== currentWinner.wrongAnswers) {
    return entry.wrongAnswers < currentWinner.wrongAnswers;
  }
  return entry.timestamp < currentWinner.timestamp;
}

function parseGrade_(value) {
  const grade = String(value || "").toLowerCase();
  if (grade.indexOf("lode") !== -1) return 31;
  const match = grade.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function createSignature_(timestamp, data) {
  const raw = [
    timestamp.toISOString(),
    clean_(data.groupName),
    clean_(data.finalGrade),
    Number(data.firstTryCorrectAnswers) || 0,
    Number(data.totalAnswers) || 0,
    Number(data.wrongAnswers) || 0
  ].join("|");
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  return digest
    .slice(0, 6)
    .map(byte => (byte + 256).toString(16).slice(-2))
    .join("")
    .toUpperCase();
}

function clean_(value) {
  return String(value || "").trim().slice(0, 120);
}
