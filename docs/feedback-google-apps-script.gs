/**
 * انسخ الكود كامل → Save
 * Deploy → Manage deployments → Edit → New version → Deploy
 * Execute as: Me | Who has access: Anyone
 */
function doPost(e) {
  var data = {};
  try {
    if (e.postData && e.postData.contents) {
      var type = (e.postData.type || '').toLowerCase();
      if (type.indexOf('json') >= 0) {
        data = JSON.parse(e.postData.contents);
      } else {
        // application/x-www-form-urlencoded
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }
  } catch (err) {
    data = e.parameter || {};
  }

  var message = data.message || data.text || '(فارغ)';
  var version = data.version || '?';
  var subject = data.subject || data._subject || ('MokaTroy Overlay Feedback v' + version);

  MailApp.sendEmail({
    to: 'mokatroy@gmail.com',
    subject: String(subject),
    body: String(message) + '\n\n---\nOverlay version: ' + version + '\nSource: in-app overlay'
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput('OK');
}
