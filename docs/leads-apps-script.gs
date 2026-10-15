// Google Apps Script that receives lead-form submissions from the site and
// appends them to the "Website Leads" Google Sheet.
//
// Setup (one time):
//   1. Open the Sheet -> Extensions -> Apps Script, paste this file in.
//   2. Deploy -> New deployment -> type "Web app".
//        Execute as: Me.   Who has access: Anyone.
//   3. Authorize when prompted, then copy the web app URL.
//   4. Put that URL in .env.local as VITE_LEADS_URL (and in your host's env).
//
// After editing this script, use Deploy -> Manage deployments -> Edit ->
// New version, otherwise the live URL keeps running the old code.

// Notifications go to the account the script runs as ("Execute as: Me"), so
// no address needs to live in this public repo.
var NOTIFY_EMAIL = Session.getEffectiveUser().getEmail();

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  sheet.appendRow([
    new Date(),
    clean_(data.name),
    clean_(data.email),
    clean_(data.phone),
    clean_(data.message),
  ]);

  MailApp.sendEmail(
    NOTIFY_EMAIL,
    "New website lead: " + clean_(data.name),
    "Name: " + clean_(data.name) + "\n" +
      "Email: " + clean_(data.email) + "\n" +
      "Phone: " + clean_(data.phone) + "\n\n" +
      clean_(data.message)
  );

  return ContentService.createTextOutput("ok");
}

// Coerce to a trimmed string and neutralise spreadsheet formula injection:
// a leading = + - @ would otherwise be evaluated as a formula in the Sheet.
function clean_(value) {
  var s = String(value == null ? "" : value).trim().slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
