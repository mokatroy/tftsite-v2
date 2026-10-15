/**
 * 1) افتح https://script.google.com
 * 2) مشروع جديد → الصق الكود ده
 * 3) Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4) انسخ الرابط (ينتهي بـ /exec) وحطه في data/overlay_meta.json
 *    تحت المفتاح: "feedbackEndpoint"
 */
function doPost(e) {
  try {
    var data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    var message = data.message || '(فارغ)';
    var version = data.version || '?';
    var subject = data.subject || ('MokaTroy Overlay Feedback v' + version);
    MailApp.sendEmail({
      to: 'mokatroy@gmail.com',
      subject: subject,
      body: message + '\n\n---\nOverlay version: ' + version + '\nSource: in-app overlay'
    });
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('MokaTroy feedback endpoint OK');
}
