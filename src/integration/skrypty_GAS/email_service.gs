/**
 * RPMS EMAIL ENGINE v1.0.0
 */

function sendSystemEmail(to, templateKey, placeholders) {
  try {
    const template = EMAIL_TEMPLATES[templateKey];
    if (!template) throw new Error("Template not found: " + templateKey);

    let htmlBody = template.body;
    let subject = template.subject;

    Object.keys(placeholders).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      htmlBody = htmlBody.replace(regex, placeholders[key]);
      subject = subject.replace(regex, placeholders[key]);
    });

    GmailApp.sendEmail(to, subject, "", {
      htmlBody: htmlBody,
      name: "RPMS Windykacja",
      noReply: true
    });
    
    console.log(`Email sent to ${to} [${templateKey}]`);
    return true;
  } catch (err) {
    console.error("Email Service Error: " + err.toString());
    return false;
  }
}
