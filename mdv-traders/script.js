/* =========================================================
   MDV Traders – Main JavaScript (shared by every page)
   ---------------------------------------------------------
   CONTENTS
   1. SETTINGS  <-- EDIT YOUR DETAILS HERE
   2. Product list  <-- EDIT YOUR PRODUCTS HERE
   3. Spare parts list  <-- EDIT YOUR SPARE PARTS HERE
   4. Icons (inline SVG)
   5. Shared header, footer & floating buttons
   6. Products page (cards + Domestic/Commercial filter)
   7. Spare parts grid
   8. Forms (validation + sending to Google Sheets)
   9. Start everything when the page loads
   ========================================================= */

/* ---------------------------------------------------------
   1. SETTINGS
   --------------------------------------------------------- */

// Paste your Google Apps Script Web App URL here (see SETUP-GUIDE.md).
// It looks like: https://script.google.com/macros/s/AKfycb..../exec
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyxY8aef8MCi-9Q4lMg0E9kTNfrix64yWzQ75Cksy3hUK2LJXbRKEmJta9VORlYE2Tz/exec";

// Business details – change these once and they update on every page.
const BUSINESS = {
  name: "MDV Traders",
  website: "mdvtraders.in",
  phone: "7417374540",          // How the number is SHOWN, e.g. "+91 98765 43210"
  phoneLink: "+917417374540",     // For tap-to-call, e.g. "+919876543210" (no spaces)
  whatsapp: "917417374540",       // For WhatsApp: country code + number, NO "+" or spaces, e.g. "919876543210"
  email: "mahadev_enterprises_roorke@gmail.com",           // e.g. "info@mdvtraders.in"
  address: "#160/1 Purwavali, Near by Shiv Mandir Railway Road, Roorkee Uttarakhand",       // e.g. "Shop 12, Main Road, Your City – 600001"
  serviceArea: "Roorkee and Haridwar",
  hours: "Mon – Sat: 9:00 AM – 7:00 PM",           // e.g. "Mon – Sat: 9:00 AM – 7:00 PM"
  brands: "Aquaguard, Kent, Pureit, Livpure",         // e.g. "Kent, Aquaguard, Pureit, Livpure"
};

/* ---------------------------------------------------------
   2. PRODUCT LIST
   To add a product: copy one { ... } block, paste it, and edit.
   category must be "domestic" or "commercial".
   PLACEHOLDER IMAGES: replace each "image" with your own photo,
   e.g. "images/ro-purifier.jpg" (600 x 450 px works well).
   --------------------------------------------------------- */
const PRODUCTS = [
  {
    name: "RO Water Purifier",
    category: "domestic",
    image: "https://placehold.co/600x450/e8f7fb/0b6fb8?text=RO+Purifier%0A(Placeholder)",
    description: "Removes dissolved salts, heavy metals and impurities. Ideal for borewell or high-TDS water.",
    features: ["Multi-stage RO purification", "7–10 litre storage tank", "Suitable for TDS up to 2000 ppm"],
    featured: true,
  },
  {
    name: "RO + UV Water Purifier",
    category: "domestic",
    image: "https://placehold.co/600x450/e8f7fb/0b6fb8?text=RO+%2B+UV%0A(Placeholder)",
    description: "Double protection: RO removes dissolved impurities and UV kills bacteria and viruses.",
    features: ["RO + UV double purification", "Auto shut-off when tank is full", "Wall-mount or counter-top"],
    featured: true,
  },
  {
    name: "RO + UV + TDS Controller",
    category: "domestic",
    image: "https://placehold.co/600x450/e8f7fb/0b6fb8?text=RO+%2B+UV+%2B+TDS%0A(Placeholder)",
    description: "Keeps healthy natural minerals in your water with an adjustable TDS controller.",
    features: ["Retains essential minerals", "Adjustable taste (TDS)", "Filter-change indicator"],
    featured: true,
  },
  {
    name: "UV Water Purifier",
    category: "domestic",
    image: "https://placehold.co/600x450/e8f7fb/0b6fb8?text=UV+Purifier%0A(Placeholder)",
    description: "Best for low-TDS municipal or corporation water. Kills germs without wasting water.",
    features: ["Zero water wastage", "Instant purification", "Low maintenance"],
  },
  {
    name: "UF Water Purifier",
    category: "domestic",
    image: "https://placehold.co/600x450/e8f7fb/0b6fb8?text=UF+Purifier%0A(Placeholder)",
    description: "Works without electricity. Removes bacteria, cysts and suspended particles.",
    features: ["No electricity needed", "Hollow-fibre UF membrane", "Budget friendly"],
  },
  {
    name: "Gravity-Based Purifier",
    category: "domestic",
    image: "https://placehold.co/600x450/e8f7fb/0b6fb8?text=Gravity+Purifier%0A(Placeholder)",
    description: "Simple, portable purifier for homes with low-TDS water and irregular power supply.",
    features: ["No electricity or tap connection", "Easy to clean", "Large storage capacity"],
  },
  {
    name: "Commercial RO Plant (25 – 100 LPH)",
    category: "commercial",
    image: "https://placehold.co/600x450/e8f7fb/0b6fb8?text=Commercial+RO%0A(Placeholder)",
    description: "For offices, schools, clinics, restaurants and small businesses.",
    features: ["25 to 100 litres per hour", "Stainless steel / FRP options", "Installation & AMC available"],
    featured: true,
  },
  {
    name: "Industrial RO Plant (250 – 2000 LPH)",
    category: "commercial",
    image: "https://placehold.co/600x450/e8f7fb/0b6fb8?text=Industrial+RO%0A(Placeholder)",
    description: "High-capacity plants for factories, hospitals, hostels, apartments and packaged water.",
    features: ["250 to 2000+ litres per hour", "Custom design for your water", "Site survey & water test"],
  },
];

/* ---------------------------------------------------------
   3. SPARE PARTS LIST (shown on services.html)
   --------------------------------------------------------- */
const SPARE_PARTS = [
  { name: "Sediment Filter", icon: "filter", description: "First stage. Traps mud, sand, rust and dust. Protects the other filters." },
  { name: "Carbon Filter (Pre / Post)", icon: "filter", description: "Removes chlorine, bad smell and bad taste from water." },
  { name: "RO Membrane", icon: "layers", description: "The heart of the purifier. Removes dissolved salts and heavy metals." },
  { name: "UV Lamp / UV Chamber", icon: "sun", description: "Kills bacteria and viruses. Lamp brightness reduces with time." },
  { name: "SMPS Adaptor", icon: "plug", description: "Power supply that runs the pump and solenoid valve." },
  { name: "Booster Pump", icon: "activity", description: "Increases water pressure so the RO membrane works properly." },
  { name: "Solenoid Valve (SV)", icon: "toggle", description: "Opens and closes the water inlet automatically." },
  { name: "Flow Restrictor", icon: "sliders", description: "Controls reject-water flow and maintains membrane pressure." },
  { name: "Membrane Housing", icon: "box", description: "Holds the RO membrane. Replace if cracked or leaking." },
  { name: "Storage Tank", icon: "droplet", description: "Stores purified water. Available in various sizes." },
  { name: "Tap / Faucet", icon: "tap", description: "Dispensing tap for clean, purified water." },
  { name: "TDS Controller", icon: "gauge", description: "Adjusts mineral level (TDS) for better taste." },
  { name: "Pipes & Connectors", icon: "link", description: "Food-grade pipes, elbows, T-joints and fittings." },
];

/* ---------------------------------------------------------
   4. ICONS – simple line icons as inline SVG
   Use in HTML like: <span data-icon="shield"></span>
   --------------------------------------------------------- */
const ICON_PATHS = {
  droplet: '<path d="M12 2.7 17.7 8.3a8 8 0 1 1-11.3 0z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  package: '<path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7z"/><polyline points="3.3 7 12 12 20.7 7"/><line x1="12" y1="22" x2="12" y2="12"/>',
  headset: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  refresh: '<polyline points="23 4 23 10 17 10"/><path d="M20.5 15a9 9 0 1 1-2.1-9.4L23 10"/>',
  truck: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  filter: '<polygon points="22 3 2 3 10 12.5 10 19 14 21 14 12.5 22 3"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  checkCircle: '<path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><polyline points="22 4 12 14 9 11"/>',
  star: '<polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"/>',
  menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="8"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.2" y1="4.2" x2="5.6" y2="5.6"/><line x1="18.4" y1="18.4" x2="19.8" y2="19.8"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.2" y1="19.8" x2="5.6" y2="18.4"/><line x1="18.4" y1="5.6" x2="19.8" y2="4.2"/>',
  plug: '<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z"/>',
  toggle: '<rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="3"/>',
  sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  box: '<rect x="6" y="2" width="12" height="20" rx="3"/><line x1="6" y1="7" x2="18" y2="7"/><line x1="6" y1="17" x2="18" y2="17"/>',
  tap: '<path d="M4 9h9a4 4 0 0 1 4 4v1"/><path d="M4 6v6"/><path d="M8 9V5h3"/><path d="M17 18.5a1.5 1.5 0 1 1-3 0c0-1 1.5-3 1.5-3s1.5 2 1.5 3z"/>',
  gauge: '<path d="M12 14l4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  move: '<polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>',
  thumbsUp: '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.3a2 2 0 0 0 2-1.7l1.4-9a2 2 0 0 0-2-2.3z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>',
  clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
};

// WhatsApp logo (filled, not a line icon)
const WHATSAPP_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41z"/></svg>';

/** Returns an inline SVG string for the given icon name. */
function icon(name) {
  const path = ICON_PATHS[name] || ICON_PATHS.droplet;
  const filled = name === "star" ? ' fill="currentColor"' : ' fill="none"';
  return (
    '<svg viewBox="0 0 24 24"' + filled +
    ' stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    path + "</svg>"
  );
}

/** Builds a WhatsApp link with a pre-filled message. */
function whatsappLink(message) {
  return "https://wa.me/" + BUSINESS.whatsapp + "?text=" + encodeURIComponent(message);
}

/** Safely escapes text before putting it into HTML. */
function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------------------------------------------------------
   5. SHARED HEADER, FOOTER & FLOATING BUTTONS
   Every page has <div id="site-header"></div> and
   <div id="site-footer"></div>. They are filled in here so you
   only edit the menu and footer in ONE place.
   --------------------------------------------------------- */
const NAV_LINKS = [
  { href: "index.html", label: "Home", page: "home" },
  { href: "products.html", label: "Products", page: "products" },
  { href: "services.html", label: "Services", page: "services" },
  { href: "service-request.html", label: "Request Service", page: "request", cta: true },
  { href: "contact.html", label: "Contact Us", page: "contact" },
];

function renderHeader() {
  const holder = document.getElementById("site-header");
  if (!holder) return;
  const current = document.body.dataset.page;

  const links = NAV_LINKS.map((l) => {
    const active = l.page === current ? ' aria-current="page"' : "";
    return '<li' + (l.cta ? ' class="nav-cta"' : "") + '><a href="' + l.href + '"' + active + ">" + l.label + "</a></li>";
  }).join("");

  holder.innerHTML =
    '<header class="site-header">' +
      '<div class="container nav">' +
        '<div class="brand-lockup">' +
          '<a class="logo" href="index.html" aria-label="Mahadev Enterprises – Home">' + icon("droplet") + "Mahadev <span>Enterprises</span></a>" +
          '<span class="authorization-label">Authorised Eureka Forbes Service Center</span>' +
        "</div>" +
        '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Open menu">' + icon("menu") + "</button>" +
        '<nav class="nav-menu" id="nav-menu" aria-label="Main menu"><ul>' + links + "</ul></nav>" +
      "</div>" +
    "</header>";

  // Mobile menu open / close
  const toggle = holder.querySelector(".nav-toggle");
  const menu = holder.querySelector(".nav-menu");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.innerHTML = icon(open ? "close" : "menu");
  });
}

function renderFooter() {
  const holder = document.getElementById("site-footer");
  if (!holder) return;
  const year = new Date().getFullYear();

  holder.innerHTML =
    '<footer class="site-footer">' +
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<a class="logo" href="index.html">' + icon("droplet") + "MDV <span>Traders</span></a>" +
            "<p>Water purifier sales, installation, repair, AMC and genuine RO spare parts. Pure water for every home and business.</p>" +
            '<p><strong>Service area:</strong> <span data-biz="serviceArea"></span></p>' +
          "</div>" +
          "<div>" +
            "<h2>Quick Links</h2>" +
            "<ul>" +
              NAV_LINKS.map((l) => '<li><a href="' + l.href + '">' + l.label + "</a></li>").join("") +
              '<li><a href="terms.html">Terms &amp; Conditions</a></li>' +
            "</ul>" +
          "</div>" +
          "<div>" +
            "<h2>Contact</h2>" +
            '<ul class="footer-contact">' +
              "<li>" + icon("pin") + '<span data-biz="address"></span></li>' +
              "<li>" + icon("phone") + '<a data-href="tel" data-biz="phone" href="#"></a></li>' +
              "<li>" + icon("mail") + '<a data-href="mailto" data-biz="email" href="#"></a></li>' +
              "<li>" + icon("clock") + '<span data-biz="hours"></span></li>' +
            "</ul>" +
          "</div>" +
        "</div>" +
        '<div class="footer-bottom">' +
          "<span>© " + year + " MDV Traders · mdvtraders.in · All rights reserved.</span>" +
          '<a href="terms.html">Terms &amp; Conditions</a>' +
        "</div>" +
      "</div>" +
    "</footer>";
}

function renderFloatingButtons() {
  const wrap = document.createElement("div");
  wrap.innerHTML =
    '<a class="float-whatsapp" href="' + whatsappLink("Hi MDV Traders, I need help with a water purifier.") +
      '" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">' + WHATSAPP_SVG + "</a>" +
    '<a class="float-call" href="tel:' + BUSINESS.phoneLink + '" aria-label="Call MDV Traders now">' + icon("phone") + "Call Now</a>";
  document.body.appendChild(wrap);
}

/**
 * Fills business details into the page:
 *   <span data-biz="phone"></span>      -> text from BUSINESS.phone
 *   <a data-href="tel">                  -> tel: link
 *   <a data-href="whatsapp">             -> WhatsApp link
 *   <a data-href="mailto">               -> email link
 */
function fillBusinessDetails() {
  document.querySelectorAll("[data-biz]").forEach((el) => {
    const value = BUSINESS[el.dataset.biz];
    if (value) el.textContent = value;
  });
  document.querySelectorAll("[data-href]").forEach((el) => {
    const type = el.dataset.href;
    if (type === "tel") el.href = "tel:" + BUSINESS.phoneLink;
    if (type === "mailto") el.href = "mailto:" + BUSINESS.email;
    if (type === "whatsapp") {
      el.href = whatsappLink(el.dataset.message || "Hi MDV Traders, I have an enquiry.");
      el.target = "_blank";
      el.rel = "noopener";
    }
  });
}

/** Replaces every <span data-icon="name"></span> with the SVG icon. */
function renderIcons() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = icon(el.dataset.icon);
  });
}

/* ---------------------------------------------------------
   6. PRODUCTS (products.html and the home page preview)
   --------------------------------------------------------- */
function productCardHTML(p) {
  const features = p.features.map((f) => "<li>" + icon("check") + "<span>" + escapeHTML(f) + "</span></li>").join("");
  const enquiry = whatsappLink("Hi MDV Traders, I am interested in the " + p.name + ". Please share the best price and details.");
  const demo = "service-request.html?service=Installation&product=" + encodeURIComponent(p.name + " (Demo request)");

  return (
    '<article class="card product-card" data-category="' + p.category + '">' +
      // PLACEHOLDER IMAGE – replace in the PRODUCTS list above
      '<img class="product-card__img" src="' + p.image + '" alt="' + escapeHTML(p.name) + '" loading="lazy" width="600" height="450">' +
      '<div class="product-card__body">' +
        '<span class="product-card__tag">' + (p.category === "commercial" ? "Commercial" : "Domestic") + "</span>" +
        "<h3>" + escapeHTML(p.name) + "</h3>" +
        "<p>" + escapeHTML(p.description) + "</p>" +
        '<ul class="product-card__features">' + features + "</ul>" +
        '<p class="product-card__price">Call for best price</p>' +
        '<div class="card__actions">' +
          '<a class="btn btn--whatsapp btn--sm" href="' + enquiry + '" target="_blank" rel="noopener">' + WHATSAPP_SVG.replace("<svg", '<svg fill="currentColor"') + "Enquire Now</a>" +
          '<a class="link-arrow" href="' + demo + '">Request Demo</a>' +
        "</div>" +
      "</div>" +
    "</article>"
  );
}

function renderProducts() {
  // Full list with filter (products.html)
  const grid = document.getElementById("product-grid");
  if (grid) {
    const draw = (category) => {
      const list = category === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);
      grid.innerHTML = list.map(productCardHTML).join("");
      const count = document.getElementById("product-count");
      if (count) count.textContent = list.length + (list.length === 1 ? " product" : " products") + " shown";
    };

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        draw(btn.dataset.filter);
      });
    });
    draw("all");
  }

  // Short preview of "featured" products (index.html)
  const preview = document.getElementById("product-preview");
  if (preview) {
    preview.innerHTML = PRODUCTS.filter((p) => p.featured).slice(0, 3).map(productCardHTML).join("");
  }
}

/* ---------------------------------------------------------
   7. SPARE PARTS GRID (services.html)
   --------------------------------------------------------- */
function renderParts() {
  const grid = document.getElementById("parts-grid");
  if (!grid) return;
  grid.innerHTML = SPARE_PARTS.map((part) => {
    const msg = "Hi MDV Traders, I need a " + part.name + " for my water purifier. Brand/Model: ";
    return (
      '<article class="card part-card">' +
        '<span class="icon-badge">' + icon(part.icon) + "</span>" +
        "<h3>" + escapeHTML(part.name) + "</h3>" +
        "<p>" + escapeHTML(part.description) + "</p>" +
        '<div class="card__actions"><a class="btn btn--outline btn--sm" href="' + whatsappLink(msg) +
          '" target="_blank" rel="noopener">Enquire<span class="visually-hidden"> about ' + escapeHTML(part.name) + "</span></a></div>" +
      "</article>"
    );
  }).join("");
}

/* ---------------------------------------------------------
   8. FORMS – validation and sending to Google Sheets
   Any <form data-form="service"> or <form data-form="contact">
   is handled here automatically.
   --------------------------------------------------------- */

/** Cleans a phone number: removes spaces, dashes, +91 and leading 0. */
function cleanMobile(value) {
  let v = String(value).replace(/[\s\-()]/g, "");
  if (v.startsWith("+91")) v = v.slice(3);
  else if (v.length === 12 && v.startsWith("91")) v = v.slice(2);
  else if (v.length === 11 && v.startsWith("0")) v = v.slice(1);
  return v;
}
const isIndianMobile = (v) => /^[6-9]\d{9}$/.test(cleanMobile(v));

/** Today's date as YYYY-MM-DD in the visitor's local time. */
function todayISO() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

/**
 * Validation rules. Each returns "" when OK, or an error message.
 * A rule is only used if the form contains a field with that name.
 */
const RULES = {
  fullName: (v) => (v.length < 2 ? "Please enter your full name." : v.length > 100 ? "Name is too long (max 100 characters)." : ""),
  mobile: (v) => (!v ? "Please enter your mobile number." : !isIndianMobile(v) ? "Please enter a valid 10-digit mobile number (starting with 6, 7, 8 or 9)." : ""),
  altMobile: (v) => (v && !isIndianMobile(v) ? "Please enter a valid 10-digit number, or leave this empty." : ""),
  email: (v) => (v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "Please enter a valid email address, or leave this empty." : ""),
  address: (v) => (v.length < 10 ? "Please enter your full address (house no., street, area, city)." : v.length > 500 ? "Address is too long." : ""),
  pincode: (v) => (!/^[1-9]\d{5}$/.test(v) ? "Please enter a valid 6-digit pincode." : ""),
  product: (v) => (v.length > 150 ? "Please keep this under 150 characters." : ""),
  serviceType: (v) => (!v ? "Please choose the type of service you need." : ""),
  problem: (v) => (v.length > 1000 ? "Please keep the description under 1000 characters." : ""),
  preferredDate: (v) => (!v ? "Please choose a preferred date." : v < todayISO() ? "Please choose today or a future date." : ""),
  timeSlot: (v) => (!v ? "Please choose a preferred time slot." : ""),
  message: (v) => (v.length < 5 ? "Please type a short message (at least 5 characters)." : v.length > 1000 ? "Please keep your message under 1000 characters." : ""),
  agree: (checked) => (!checked ? "Please accept the Terms & Conditions to continue." : ""),
};

/** Reads a field's value (works for inputs, selects, radios and checkboxes). */
function fieldValue(form, name) {
  const el = form.elements[name];
  if (!el) return "";
  if (el.type === "checkbox") return el.checked;
  return String(el.value || "").trim();
}

/** Shows or clears the error message under a field. */
function setFieldError(form, name, message) {
  const errorEl = form.querySelector("#" + name + "-error");
  if (errorEl) errorEl.textContent = message;
  const el = form.elements[name];
  const inputs = el && el.length !== undefined && !el.tagName ? Array.from(el) : [el];
  inputs.forEach((input) => {
    if (!input) return;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  });
}

/** Validates one field. Returns true if valid. */
function validateField(form, name) {
  if (!RULES[name] || !form.elements[name]) return true;
  const message = RULES[name](fieldValue(form, name));
  setFieldError(form, name, message);
  return !message;
}

/** Validates all fields. Returns the first invalid field name, or null. */
function validateForm(form) {
  let firstInvalid = null;
  Object.keys(RULES).forEach((name) => {
    if (!validateField(form, name) && !firstInvalid) firstInvalid = name;
  });
  return firstInvalid;
}

/** Creates an ID like MDV-20261103-1234 (or MDV-C-20261103-1234 for contacts). */
function makeRequestId(prefix) {
  const d = new Date();
  const date = d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return prefix + "-" + date + "-" + random;
}

/** Shows a success or error box below the form. */
function showStatus(form, type, html) {
  const box = form.querySelector(".form-status");
  if (!box) return;
  box.className = "form-status form-status--" + type;
  box.innerHTML = html;
  box.hidden = false;
  box.setAttribute("tabindex", "-1");
  box.focus({ preventScroll: true });
  box.scrollIntoView({ behavior: "smooth", block: "center" });
}

/** Turns the loading state of the submit button on/off. */
function setBusy(form, busy) {
  const btn = form.querySelector('button[type="submit"]');
  form.dataset.busy = busy ? "true" : "false";
  form.setAttribute("aria-busy", String(busy));
  if (!btn) return;
  if (!btn.dataset.label) btn.dataset.label = btn.innerHTML;
  btn.disabled = busy;
  btn.innerHTML = busy ? '<span class="spinner" aria-hidden="true"></span> Sending…' : btn.dataset.label;
}

function errorHTML() {
  return (
    "<strong>Sorry, we couldn't send your request right now.</strong><br>" +
    'Please call us at <a href="tel:' + BUSINESS.phoneLink + '">' + escapeHTML(BUSINESS.phone) + "</a> " +
    'or <a href="' + whatsappLink("Hi MDV Traders, I tried to submit a request on your website.") +
    '" target="_blank" rel="noopener">message us on WhatsApp</a>. We will help you right away.'
  );
}

/** Sends the data to the Google Apps Script Web App. */
async function sendToGoogleSheet(payload) {
  if (!SCRIPT_URL || SCRIPT_URL.indexOf("PASTE_") === 0) {
    throw new Error("SCRIPT_URL is not set in script.js. See SETUP-GUIDE.md.");
  }
  // 20-second timeout so the visitor is never stuck waiting
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    // "text/plain" avoids a CORS "preflight" request, which Apps Script cannot answer.
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Server returned " + response.status);
    const result = await response.json();
    if (result.status !== "success") throw new Error(result.message || "Unknown error");
    return result;
  } finally {
    clearTimeout(timer);
  }
}

function setupForms() {
  // Date pickers: block past dates
  document.querySelectorAll('input[type="date"][data-min-today]').forEach((el) => {
    el.min = todayISO();
  });

  // Pre-fill the service form from the link, e.g. service-request.html?service=AMC&product=RO
  const params = new URLSearchParams(window.location.search);
  const serviceSelect = document.getElementById("serviceType");
  if (serviceSelect && params.get("service")) {
    const wanted = params.get("service");
    if (Array.from(serviceSelect.options).some((o) => o.value === wanted)) serviceSelect.value = wanted;
  }
  const productInput = document.getElementById("product");
  if (productInput && params.get("product")) productInput.value = params.get("product").slice(0, 150);

  document.querySelectorAll("form[data-form]").forEach((form) => {
    // Check each field when the visitor leaves it, and clear errors as they type
    form.addEventListener("focusout", (e) => {
      // Skip when moving to the submit button – submit validates everything anyway,
      // and showing an error here would shift the button and swallow the click.
      if (e.relatedTarget && e.relatedTarget.type === "submit") return;
      if (e.target.name && e.target.value) validateField(form, e.target.name);
    });
    form.addEventListener("input", (e) => {
      if (e.target.getAttribute("aria-invalid") === "true") validateField(form, e.target.name);
    });
    form.addEventListener("change", (e) => {
      if (e.target.type === "radio" || e.target.type === "checkbox") validateField(form, e.target.name);
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (form.dataset.busy === "true") return; // prevent double submission

      const type = form.dataset.form; // "service" or "contact"
      const isService = type === "service";

      // Do not report success for a request rejected by the honeypot.
      const honeypot = fieldValue(form, "formCheck");
      if (honeypot) {
        showStatus(form, "error", "<strong>We couldn't verify your request.</strong><br>Please refresh the page and try again.");
        return;
      }

      const firstInvalid = validateForm(form);
      if (firstInvalid) {
        const el = form.elements[firstInvalid];
        const focusTarget = el && el.length !== undefined && !el.tagName ? el[0] : el;
        if (focusTarget) focusTarget.focus();
        const box = form.querySelector(".form-status");
        if (box) box.hidden = true;
        return;
      }

      // Collect the data
      const requestId = makeRequestId(isService ? "MDV" : "MDV-C");
      const payload = { formType: type, requestId: requestId };
      ["fullName", "mobile", "altMobile", "email", "address", "pincode", "product", "serviceType", "problem", "preferredDate", "timeSlot", "message"]
        .forEach((name) => {
          if (form.elements[name]) payload[name] = fieldValue(form, name);
        });
      if (payload.mobile) payload.mobile = cleanMobile(payload.mobile);
      if (payload.altMobile) payload.altMobile = cleanMobile(payload.altMobile);
      payload.pageUrl = window.location.href;

      setBusy(form, true);
      try {
        await sendToGoogleSheet(payload);
        form.reset();
        if (isService) {
          showStatus(form, "success",
            "<strong>Thank you! Your service request has been received.</strong><br>" +
            'Your Request ID is<br><span class="request-id">' + requestId + "</span><br>" +
            "Please save this ID. Our team will call you shortly to confirm the visit.");
        } else {
          showStatus(form, "success",
            "<strong>Thank you for contacting MDV Traders!</strong><br>" +
            "We will get back to you soon. Reference: <strong>" + requestId + "</strong>");
        }
      } catch (err) {
        console.error("Form submission failed:", err);
        showStatus(form, "error", errorHTML());
      } finally {
        setBusy(form, false);
        const dateInput = form.querySelector('input[type="date"][data-min-today]');
        if (dateInput) dateInput.min = todayISO();
      }
    });
  });
}

/* ---------------------------------------------------------
   9. START – runs when the page has loaded
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderFloatingButtons();
  renderProducts();
  renderParts();
  renderIcons();
  fillBusinessDetails();
  setupForms();
});
