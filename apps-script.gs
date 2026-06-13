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

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
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
