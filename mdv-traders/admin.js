const ADMIN_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyMlbXetxnHBcHcLdgWY4TU7fw3yeHx3X2-BlZRNCH6FLQaxBGpeBiQd_yG2jLCtyQX/exec";
const SESSION_KEY = "mdv-admin-session";
const COLUMNS = [
  ["type", "type"],
  ["reference", "reference"],
  ["timestamp", "timestamp"],
  ["Name", "Name"],
  ["phone", "phone"],
  ["Alternate Number", "Alternate Number"],
  ["Email", "Email"],
  ["Address", "Address"],
  ["Pincode", "Pincode"],
  ["Product/Model", "Product/Model"],
  ["serviceMessage", "serviceMessage"],
  ["Problem", "Problem"],
  ["Preferred Date", "Preferred Date"],
  ["Time Slot", "Time Slot"],
  ["status", "status"],
];

const loginPanel = document.getElementById("login-panel");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("login-form");
const loginNotice = document.getElementById("login-notice");
const dashboardNotice = document.getElementById("dashboard-notice");
const rowsElement = document.getElementById("query-rows");
const resultCount = document.getElementById("result-count");
const pageIndicator = document.getElementById("page-indicator");
const previousButton = document.getElementById("previous-page");
const nextButton = document.getElementById("next-page");
const searchInput = document.getElementById("search-input");
const typeFilter = document.getElementById("type-filter");
const statusFilter = document.getElementById("status-filter");
const pageSizeSelect = document.getElementById("page-size");
let sessionToken = sessionStorage.getItem(SESSION_KEY) || "";
let currentPage = 1;
let totalRecords = 0;
let searchTimer;
let loadSequence = 0;

function showNotice(element, message, isError) {
  element.textContent = message || "";
  element.classList.toggle("is-error", Boolean(isError));
}

async function request(action, data) {
  const response = await fetch(ADMIN_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(Object.assign({ action: action, token: sessionToken }, data || {})),
  });
  if (!response.ok) throw new Error("The server returned HTTP " + response.status + ".");
  const result = await response.json();
  if (result.status !== "success") {
    if (action === "adminLogin" && result.message === "Missing or invalid fields") {
      throw new Error("This Apps Script URL is still running the old form handler. In the Apps Script project for this URL, replace Code.gs with the updated local file, save it, then deploy a new version.");
    }
    throw new Error(result.message || "The request failed.");
  }
  return result;
}

function displayLogin(message, isError) {
  loadSequence += 1;
  sessionToken = "";
  sessionStorage.removeItem(SESSION_KEY);
  dashboard.hidden = true;
  loginPanel.hidden = false;
  showNotice(loginNotice, message, isError);
}

function displayDashboard() {
  loginPanel.hidden = true;
  dashboard.hidden = false;
  showNotice(loginNotice, "", false);
}

function recordValue(record, key) {
  if (key === "type") return record.type === "service" ? "Service request" : "Contact message";
  if (key === "reference") return record["Request ID"] || record["Reference ID"] || "";
  if (key === "phone") return record.Mobile || record.Phone || "";
  if (key === "serviceMessage") return record["Service Type"] || record.Message || "";
  if (key === "status") return record.status || "";
  return record[key] || "";
}

function renderRows(records) {
  rowsElement.replaceChildren();
  if (!records.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = COLUMNS.length;
    cell.className = "empty-row";
    cell.textContent = "No queries match these filters.";
    row.appendChild(cell);
    rowsElement.appendChild(row);
    return;
  }

  records.forEach(function (record) {
    const row = document.createElement("tr");
    COLUMNS.forEach(function (column) {
      const cell = document.createElement("td");
      cell.textContent = recordValue(record, column[1]);
      row.appendChild(cell);
    });
    rowsElement.appendChild(row);
  });
}

async function loadRecords() {
  const sequence = ++loadSequence;
  showNotice(dashboardNotice, "Loading queries…", false);
  previousButton.disabled = true;
  nextButton.disabled = true;
  try {
    const result = await request("adminList", {
      page: currentPage,
      pageSize: Number(pageSizeSelect.value),
      type: typeFilter.value,
      status: statusFilter.value,
      search: searchInput.value.trim(),
    });
    if (sequence !== loadSequence) return;
    totalRecords = result.total;
    const pageCount = Math.max(1, Math.ceil(totalRecords / result.pageSize));
    if (currentPage > pageCount) {
      currentPage = pageCount;
      return loadRecords();
    }

    renderRows(result.records);
    const first = totalRecords ? (currentPage - 1) * result.pageSize + 1 : 0;
    const last = Math.min(currentPage * result.pageSize, totalRecords);
    resultCount.textContent = totalRecords
      ? "Showing " + first + "–" + last + " of " + totalRecords + " queries"
      : "0 queries";
    pageIndicator.textContent = "Page " + currentPage + " of " + pageCount;
    previousButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= pageCount;
    showNotice(dashboardNotice, "", false);
  } catch (error) {
    if (sequence !== loadSequence) return;
    if (/session has expired/i.test(error.message)) {
      displayLogin("Your session expired. Please sign in again.", true);
      return;
    }
    showNotice(dashboardNotice, error.message, true);
    renderRows([]);
    resultCount.textContent = "";
    pageIndicator.textContent = "";
  }
}

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const button = loginForm.querySelector("button");
  button.disabled = true;
  showNotice(loginNotice, "Signing in…", false);
  try {
    const result = await request("adminLogin", { password: loginForm.elements.password.value });
    sessionToken = result.token;
    sessionStorage.setItem(SESSION_KEY, sessionToken);
    loginForm.reset();
    currentPage = 1;
    displayDashboard();
    await loadRecords();
  } catch (error) {
    showNotice(loginNotice, error.message, true);
  } finally {
    button.disabled = false;
  }
});

document.getElementById("logout-button").addEventListener("click", async function () {
  try {
    await request("adminLogout");
  } catch (error) {
    console.error("Could not end the admin session:", error);
  }
  displayLogin("You have signed out.", false);
});

previousButton.addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage -= 1;
    loadRecords();
  }
});
nextButton.addEventListener("click", function () {
  if (currentPage * Number(pageSizeSelect.value) < totalRecords) {
    currentPage += 1;
    loadRecords();
  }
});
[typeFilter, statusFilter, pageSizeSelect].forEach(function (control) {
  control.addEventListener("change", function () {
    currentPage = 1;
    loadRecords();
  });
});
searchInput.addEventListener("input", function () {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(function () {
    currentPage = 1;
    loadRecords();
  }, 250);
});

if (sessionToken) {
  displayDashboard();
  loadRecords();
}
