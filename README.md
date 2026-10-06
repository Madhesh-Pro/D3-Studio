# D3 Studio

Web design and development studio application built with React, Vite, and Tailwind CSS.

## Google Sheets Integration Setup

The project brief / enquiry form submits responses directly to a Google Sheet via a Google Apps Script Web App.

### Setup Instructions

1. **Create a new Google Sheet**:
   - Go to [Google Sheets](https://sheets.new) and create a new blank spreadsheet (e.g. named D3 Studio - Project Enquiries).

2. **Open Apps Script**:
   - In the spreadsheet menu, go to **Extensions** → **Apps Script**.

3. **Paste the backend code**:
   - Delete any placeholder code inside Code.gs.
   - Copy and paste the entire contents of [google-apps-script/Code.gs](./google-apps-script/Code.gs).
   - Click the **Save** (disk) icon or press Ctrl + S.

4. **Deploy as a Web App**:
   - Click the blue **Deploy** button at top right → **New deployment**.
   - Click the gear icon next to *Select type* and choose **Web app**.
   - Fill in:
     - **Description**: D3 Studio Enquiry Form API
     - **Execute as**: Me (your email)
     - **Who has access**: Anyone *(Crucial: must be set to Anyone so submissions from the website can be received without Google login)*
   - Click **Deploy**.
   - If prompted, click **Authorize access**, choose your Google account, click **Advanced**, and then click **Go to Untitled project (unsafe)** to grant permissions.

5. **Copy the Web App URL**:
   - Copy the Web App URL ending with /exec (format: https://script.google.com/macros/s/AKfycb.../exec).

6. **Configure Environment Variable**:
   - In the root of the project, create or edit .env:
     `env
     VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
     `
   - An example template is provided in [.env.example](./.env.example).

### How It Works

- The script automatically checks for a sheet named **Enquiries**.
- If it does not exist, it creates it with the columns:
  - Submitted At, Name, Brand, Website Type, Goals, Existing Website, Domain, Style, Inspiration, Budget, Timeline, Email, Phone, Contact Method.
- New inquiries are appended as rows chronologically.
