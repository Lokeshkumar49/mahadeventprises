/**
 * =========================================================
 *  MDV Traders – Google Apps Script (Code.gs)
 *  Receives form submissions from the website and saves them
 *  into this Google Sheet.
 *
 *  - Tab "Service Requests" <- service-request.html
 *  - Tab "Contacts"         <- contact.html
 *
 *  Tabs and header rows are created automatically if missing.
 *  See SETUP-GUIDE.md for step-by-step deployment.
 * =========================================================
 */

/* ---------- SETTINGS ---------- */

// Optional: email address to notify when a new request arrives.
// Leave as "" to turn email notifications OFF.
const NOTIFY_EMAIL = ""; // e.g. "owner@gmail.com"

const SPREADSHEET_ID = "1xLzbyTWxLmjI_p-12wA0bGo84zHWTJ5y_UT1jPhV93Y";
const SERVICE_SHEET = "Service Requests";
const CONTACT_SHEET = "Contacts";
const TIMEZONE = "Asia/Kolkata";

const SERVICE_HEADERS = [
  "Request ID", "Timestamp", "Name", "Mobile", "Alternate Number", "Email",
  "Address", "Pincode", "Product/Model", "Service Type", "Problem",
  "Preferred Date", "Time Slot", "Status",
];

const CONTACT_HEADERS = ["Reference ID", "Timestamp", "Name", "Phone", "Message", "Status"];

/* ---------- MAIN: receives the POST from the website ---------- */
function doPost(e) {
  // A lock stops two submissions writing to the same row at the same time
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: "error", message: "No data received" });
    }

    const data = JSON.parse(e.postData.contents);

    // Honeypot: if the hidden "website" field is filled, it's a bot – pretend success
    if (data.website) {
      return jsonResponse({ status: "success", requestId: "" });
    }

    const timestamp = Utilities.formatDate(new Date(), TIMEZONE, "dd-MM-yyyy HH:mm:ss");

    if (data.formType === "contact") {
      // ----- Contact form -----
      const name = clean(data.fullName, 100);
      const phone = clean(data.mobile, 15);
      const message = clean(data.message, 1000);
      if (!name || !/^[6-9]\d{9}$/.test(phone) || !message) {
        return jsonResponse({ status: "error", message: "Missing or invalid fields" });
      }
      const refId = validId(data.requestId, "MDV-C") || makeId("MDV-C");
      const sheet = getSheet(CONTACT_SHEET, CONTACT_HEADERS);
      sheet.appendRow([refId, timestamp, name, phone, message, "New"]);

      notifyOwner("New contact message – " + refId,
        "Name: " + name + "\nPhone: " + phone + "\n\nMessage:\n" + message);

      return jsonResponse({ status: "success", requestId: refId });
    }

    // ----- Service request form (default) -----
    const row = {
      name: clean(data.fullName, 100),
      mobile: clean(data.mobile, 15),
      alt: clean(data.altMobile, 15),
      email: clean(data.email, 150),
      address: clean(data.address, 500),
      pincode: clean(data.pincode, 6),
      product: clean(data.product, 150),
      serviceType: clean(data.serviceType, 50),
      problem: clean(data.problem, 1000),
      date: clean(data.preferredDate, 10),
      slot: clean(data.timeSlot, 40),
    };

    // Server-side checks (never trust the browser alone)
    if (!row.name || !/^[6-9]\d{9}$/.test(row.mobile) || !row.address ||
        !/^[1-9]\d{5}$/.test(row.pincode) || !row.serviceType) {
      return jsonResponse({ status: "error", message: "Missing or invalid fields" });
    }

    const requestId = validId(data.requestId, "MDV") || makeId("MDV");
    const sheet = getSheet(SERVICE_SHEET, SERVICE_HEADERS);
    sheet.appendRow([
      requestId, timestamp, row.name, row.mobile, row.alt, row.email,
      row.address, row.pincode, row.product, row.serviceType, row.problem,
      row.date, row.slot, "New",
    ]);

    notifyOwner("New service request – " + requestId + " (" + row.serviceType + ")",
      "Request ID: " + requestId +
      "\nName: " + row.name +
      "\nMobile: " + row.mobile +
      (row.alt ? "\nAlternate: " + row.alt : "") +
      (row.email ? "\nEmail: " + row.email : "") +
      "\nAddress: " + row.address + " – " + row.pincode +
      "\nProduct/Model: " + (row.product || "-") +
      "\nService: " + row.serviceType +
      "\nPreferred: " + row.date + ", " + row.slot +
      "\n\nProblem:\n" + (row.problem || "-"));

    return jsonResponse({ status: "success", requestId: requestId });
  } catch (err) {
    console.error(err);
    return jsonResponse({ status: "error", message: "Server error: " + err.message });
  } finally {
    lock.releaseLock();
  }
}

/* Visiting the Web App URL in a browser shows this – handy for testing */
function doGet() {
  return jsonResponse({ status: "ok", message: "MDV Traders form endpoint is running." });
}

/* ---------- HELPERS ---------- */

/**
 * Returns JSON to the website.
 * CORS note: Apps Script cannot set custom headers, but Google's response
 * already allows cross-site reads. The website sends data as "text/plain",
 * which avoids the browser's "preflight" check – so it works from any domain.
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Gets a tab by name, creating it (with bold, frozen headers) if needed. */
function getSheet(name, headers) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e8f7fb");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Trims text, limits its length, and blocks "formula injection"
 * (text starting with = + - @ would otherwise run as a formula in Sheets).
 */
function clean(value, maxLength) {
  let text = String(value == null ? "" : value).trim().slice(0, maxLength);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

/** Accepts the ID made by the website only if it has the right format. */
function validId(id, prefix) {
  const pattern = new RegExp("^" + prefix + "-\\d{8}-\\d{4}$");
  return pattern.test(String(id || "")) ? String(id) : "";
}

/** Makes an ID like MDV-20261103-1234 */
function makeId(prefix) {
  const date = Utilities.formatDate(new Date(), TIMEZONE, "yyyyMMdd");
  return prefix + "-" + date + "-" + Math.floor(1000 + Math.random() * 9000);
}

/** Sends an email to the owner (only if NOTIFY_EMAIL is set). */
function notifyOwner(subject, body) {
  if (!NOTIFY_EMAIL) return;
  try {
    MailApp.sendEmail(NOTIFY_EMAIL, subject, body + "\n\n— Sent from mdvtraders.in");
  } catch (err) {
    console.error("Email failed: " + err.message); // saving still succeeds
  }
}

/** Run this once from the editor to create both tabs and test permissions. */
function setup() {
  getSheet(SERVICE_SHEET, SERVICE_HEADERS);
  getSheet(CONTACT_SHEET, CONTACT_HEADERS);
}
