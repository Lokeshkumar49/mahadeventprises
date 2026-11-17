# MDV Traders Website – Setup Guide

A plain HTML/CSS/JS website. No build step: upload the files and it works.

## 1. Folder structure

```
mdv-traders/
├── index.html              Home
├── products.html           Products (with Domestic / Commercial filter)
├── services.html           Services + RO spare parts
├── service-request.html    Service request form -> Google Sheets
├── contact.html            Contact details, form, map
├── terms.html              Terms & Conditions
├── 404.html                Custom "page not found"
├── style.css               All styles (colours at the top)
├── script.js               All JavaScript + your settings, products & parts
├── favicon.svg             Placeholder icon
├── sitemap.xml
├── robots.txt
├── .htaccess               For Apache/cPanel hosting (404 page, HTTPS, caching)
├── images/                 Put your own photos here
├── google-apps-script/
│   └── Code.gs             Paste into Google Apps Script
└── SETUP-GUIDE.md          This file
```

## 2. Connect the forms to Google Sheets

1. Open the target [Google spreadsheet](https://docs.google.com/spreadsheets/d/1xLzbyTWxLmjI_p-12wA0bGo84zHWTJ5y_UT1jPhV93Y/edit). The script is configured to create and use the "Service Requests" and "Contacts" tabs in this file.
2. In the spreadsheet, click **Extensions > Apps Script**.
3. Delete any code in the editor, then paste the full contents of `google-apps-script/Code.gs`.
4. Optional: to get an email for every new request, put your email in `const NOTIFY_EMAIL = "you@gmail.com";`
5. Click **Save** (disk icon).
6. In the function dropdown at the top, choose **setup** and click **Run**. Google will ask for permission: click **Review permissions**, choose your account, click **Advanced > Go to project (unsafe)**, then **Allow**. (This is your own script, so it's safe.) This creates the "Service Requests" and "Contacts" tabs.
7. Click **Deploy > New deployment**. Click the gear icon and pick **Web app**.
   - Description: `MDV forms`
   - **Execute as: Me**
   - **Who has access: Anyone**
8. Click **Deploy**, then **copy the Web App URL**. It ends in `/exec`.
9. Open `script.js` and paste it into the line near the top:
   ```js
   const SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
   ```
10. Test: open the URL in your browser. You should see `{"status":"ok", ...}`. Then submit the form on your website and check the sheet.

**Changing Code.gs later?** Go to **Deploy > Manage deployments > Edit (pencil) > Version: New version > Deploy**. The URL stays the same. If you make a *new* deployment instead, the URL changes and you'll need to update `script.js`.

**Status column:** each new row starts as "New". You can change it to "Assigned", "Done", etc. To make it a dropdown, select column N > **Data > Data validation > Dropdown**.

## 3. Placeholders to replace

| Where | What to change |
|---|---|
| `script.js` > `SCRIPT_URL` | Your Google Apps Script Web App URL |
| `script.js` > `BUSINESS` | phone (shown), phoneLink (tel:), whatsapp (91 + number, no +), email, address, serviceArea, hours, brands |
| `script.js` > `PRODUCTS` | Product names, descriptions, features and **image** links (currently placehold.co) |
| `script.js` > `SPARE_PARTS` | Add/remove parts if needed |
| `index.html` hero `<img>` | Hero photo (currently placehold.co) |
| `index.html` testimonials | 3 sample reviews marked "Sample review – replace" |
| `index.html` + `contact.html` JSON-LD | `[ADD NUMBER]`, `[ADD EMAIL]`, `[ADD ADDRESS]`, `[ADD CITY]`, `[ADD STATE]`, `[ADD PINCODE]`, `[ADD CITIES / AREAS]`, `[ADD HOURS]` |
| `contact.html` map iframe | Google Maps embed link: Maps > your shop > Share > Embed a map |
| `contact.html` + `terms.html` | Fallback `[ADD ...]` text (filled automatically from `BUSINESS`, but also used if JavaScript is off) |
| `terms.html` | `[ADD CITY]` in the Governing law section; review the whole page with a lawyer |
| All pages `og:image` | Upload a 1200 × 630 image to `images/og-image.jpg` |
| `favicon.svg` | Your logo icon |
| `service-request.html` time slots | Change the times (9 AM – 12 PM etc.) if needed |

**Tip:** search all files for `[ADD` and `PLACEHOLDER` to find everything.

## 4. Upload to hosting and connect mdvtraders.in

**Option A – cPanel / Hostinger / any shared hosting**
1. Log in to your hosting panel and open **File Manager**.
2. Open `public_html` and upload **all files and folders** (including `.htaccess`). `index.html` must be directly inside `public_html`.
3. Turn on **free SSL (Let's Encrypt)** in the panel.
4. At your domain registrar (GoDaddy, BigRock, Hostinger…), set the domain's **nameservers** to the ones your host gives you, *or* add an **A record** for `@` and `www` pointing to your host's IP address.
5. Wait for DNS (a few minutes up to 24–48 hours), then open <https://mdvtraders.in>.

**Option B – Free static hosting (Netlify / Cloudflare Pages)**
1. Drag and drop the folder on <https://app.netlify.com/drop> (or create a Cloudflare Pages project and upload it).
2. In the site's **Domain settings**, add `mdvtraders.in` and follow the DNS records it shows you.
3. HTTPS is turned on automatically. Netlify uses `404.html` automatically; you can delete `.htaccess`.

**After going live**
- Add the site to **Google Search Console** and submit `https://mdvtraders.in/sitemap.xml`.
- Create or update your **Google Business Profile** with the same name, phone and address.
- Submit a test service request from your phone and check it appears in the sheet.
