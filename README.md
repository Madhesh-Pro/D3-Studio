# D3 Studio (New Design)

Independent digital studio website for D3 Studio, built with React, Vite, and Tailwind CSS. Features an interactive browser showcase preview, dynamic animations, and a 6-step project brief enquiry form integrated directly with Google Sheets and automated email alerts.

---

## ⚡ Features & Updates

- **Modern Editorial Aesthetic**: High-contrast typography, interactive showcase preview with dynamic 3D depth, orbit badge, and ticker animations.
- **6-Step Project Brief Form**:
  - **Step 1: Client & Business**: Name, Brand, Industry, and Business Overview.
  - **Step 2: Project Type**: Business Website, E-Commerce, Portfolio, Landing Page, Web Application, Other.
  - **Step 3: Goals & Scope**: Objectives, Existing Website status, Domain status.
  - **Step 4: Design Style**: Minimal, Modern, Premium, Bold, Colorful, Dark, Not Sure, and optional inspiration links.
  - **Step 5: Budget & Timeline**: Tiered budget ranges and turnaround times.
  - **Step 6: Contact & Preferences**: Email, Phone / WhatsApp, Preferred Contact Method.
- **Enhanced Validation & UX**: Inline validation feedback, smooth scrolling to form steps, and mobile-responsive layout.
- **Live Google Sheets Connection**: Direct form submission to Google Sheets with backward compatibility and automatic header migration.
- **Email Notifications**: Instant email notification dispatched to `madheshsec@gmail.com` on every client submission.

---

## 📊 Google Sheets & Apps Script Setup

The project brief form submits client responses directly to a Google Sheet via a Google Apps Script Web App.

### Setup Instructions

1. **Open or Create your Google Sheet**:
   - Go to [Google Sheets](https://sheets.new) or open your existing **D3 Studio - Project Enquiries** sheet.

2. **Open Apps Script**:
   - In Google Sheets, navigate to **Extensions** → **Apps Script**.

3. **Paste the Code**:
   - Replace any existing code in `Code.gs` with the updated contents of [google-apps-script/Code.gs](./google-apps-script/Code.gs).
   - Press **Save** (`Ctrl + S` or the disk icon).

4. **Deploy as a Web App**:
   - Click **Deploy** → **New deployment** (or **Manage deployments** → edit to create a new version).
   - Select type: **Web app**.
   - **Description**: `D3 Studio Enquiry Form API`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(Required so website visitors can submit inquiries)*
   - Click **Deploy**.
   - Grant authorization if prompted.

5. **Copy the Web App URL**:
   - Copy the URL ending in `/exec` (e.g. `https://script.google.com/macros/s/.../exec`).

6. **Configure Environment Variable**:
   - In `.env` / `.env.local`:
     ```env
     VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
     ```
   - *Note: A working fallback URL is already configured in `src/App.tsx`, so submissions work seamlessly out-of-the-box.*

### Sheet Columns (16 Columns)

The script automatically sets up the **Enquiries** sheet with the following columns:
1. `Submitted At`
2. `Name`
3. `Brand`
4. `Website Type`
5. `Goals`
6. `Existing Website`
7. `Domain`
8. `Style`
9. `Inspiration`
10. `Budget`
11. `Timeline`
12. `Email`
13. `Phone`
14. `Contact Method`
15. `Industry`
16. `Business Overview`

> **Note on Migration**: If your existing Google Sheet only had the previous 14 columns, the script will automatically detect and add columns 15 and 16 (`Industry` and `Business Overview`) without altering your existing records.

---

## 🛠️ Development & Build

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
