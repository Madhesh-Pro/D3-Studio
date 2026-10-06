/**
 * Google Apps Script receiver for the D3 Studio project enquiry form.
 *
 * 1. Create a Google Sheet and open Extensions → Apps Script.
 * 2. Paste this file into Code.gs and save.
 * 3. Deploy → New deployment → Web app.
 * 4. Execute as: Me. Access: Anyone.
 * 5. Copy the /exec URL into VITE_GOOGLE_APPS_SCRIPT_URL.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Enquiries");
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Enquiries");
      sheet.appendRow([
        "Submitted At", "Name", "Brand", "Website Type", "Goals",
        "Existing Website", "Domain", "Style", "Inspiration", "Budget",
        "Timeline", "Email", "Phone", "Contact Method"
      ]);
      sheet.setFrozenRows(1);
    }

    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.submittedAt || new Date(), data.name || "", data.brand || "",
      data.websiteType || "", data.goals || "", data.existingWebsite || "",
      data.domain || "", data.style || "", data.inspiration || "",
      data.budget || "", data.timeline || "", data.email || "",
      data.phone || "", data.contactMethod || ""
    ]);

    // Send instant email notification to your inbox
    try {
      MailApp.sendEmail({
        to: "madheshsec@gmail.com",
        subject: "🚀 New D3 Studio Enquiry: " + (data.name || "Client") + " (" + (data.brand || "Brand") + ")",
        htmlBody:
          "<div style='font-family:Arial,sans-serif;line-height:1.6;color:#111;max-width:600px;'>" +
          "<h2 style='color:#111;border-bottom:2px solid #e2ff3b;padding-bottom:8px;'>New Project Brief Received!</h2>" +
          "<p>A potential client just submitted the project enquiry form on D3 Studio.</p>" +
          "<table style='width:100%;border-collapse:collapse;margin-top:15px;font-size:14px;'>" +
          "<tr><td style='padding:6px;font-weight:bold;width:140px;'>Name:</td><td>" + (data.name || "-") + "</td></tr>" +
          "<tr><td style='padding:6px;font-weight:bold;'>Brand:</td><td>" + (data.brand || "-") + "</td></tr>" +
          "<tr><td style='padding:6px;font-weight:bold;'>Website Type:</td><td>" + (data.websiteType || "-") + "</td></tr>" +
          "<tr><td style='padding:6px;font-weight:bold;'>Goals:</td><td>" + (data.goals || "-") + "</td></tr>" +
          "<tr><td style='padding:6px;font-weight:bold;'>Existing Site:</td><td>" + (data.existingWebsite || "-") + "</td></tr>" +
          "<tr><td style='padding:6px;font-weight:bold;'>Domain:</td><td>" + (data.domain || "-") + "</td></tr>" +
          "<tr><td style='padding:6px;font-weight:bold;'>Style:</td><td>" + (data.style || "-") + "</td></tr>" +
          "<tr><td style='padding:6px;font-weight:bold;'>Inspiration:</td><td>" + (data.inspiration || "-") + "</td></tr>" +
          "<tr><td style='padding:6px;font-weight:bold;'>Budget:</td><td>" + (data.budget || "-") + "</td></tr>" +
          "<tr><td style='padding:6px;font-weight:bold;'>Timeline:</td><td>" + (data.timeline || "-") + "</td></tr>" +
          "<tr><td style='padding:6px;font-weight:bold;'>Email:</td><td><a href='mailto:" + (data.email || "") + "'>" + (data.email || "-") + "</a></td></tr>" +
          "<tr><td style='padding:6px;font-weight:bold;'>Phone:</td><td><a href='tel:" + (data.phone || "") + "'>" + (data.phone || "-") + "</a></td></tr>" +
          "<tr><td style='padding:6px;font-weight:bold;'>Preferred Contact:</td><td>" + (data.contactMethod || "-") + "</td></tr>" +
          "</table>" +
          "<p style='margin-top:25px;font-size:12px;color:#666;'>Also saved to your Google Sheet in the <b>Enquiries</b> tab.</p>" +
          "</div>"
      });
    } catch (mailError) {
      // Ignore mail errors so response still succeeds
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
