import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { cmsService } from '@/shared/api/apiClientFactory';
import { render } from '@react-email/render';
import UnifiedTemplate from '@/components/emails/UnifiedTemplate';
import React from 'react';

const replaceVars = (text: string, data: any) => {
  if (!text) return '';
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
};

export async function POST(request: Request) {
  try {
    // 1. Authorization check
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRM_WEBHOOK_SECRET;
    
    // If CRM_WEBHOOK_SECRET is set in .env, enforce it
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const { userId, userEmail, templateType, data } = payload;

    if (!userEmail || !templateType) {
      return NextResponse.json({ error: 'Missing required fields: userEmail, templateType' }, { status: 400 });
    }

    // 2. Fetch CMS settings to get email configuration and templates
    let cmsSettings: any = {};
    let emailTemplates: any = null;
    try {
      const cmsData = await cmsService.getCMS();
      if (cmsData && cmsData.full_content && cmsData.full_content.settings) {
        cmsSettings = cmsData.full_content.settings.email || {};
        // Note: in EmailTemplatesManager it's stored at logic.localContent.emailTemplates
        emailTemplates = cmsData.full_content.emailTemplates; 
      }
    } catch (error) {
      console.error('Failed to fetch CMS settings for webhook email:', error);
    }

    const smtpUser = cmsSettings.smtpUser || process.env.SMTP_USER;
    const smtpPass = cmsSettings.smtpPass || process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      return NextResponse.json({ error: 'Brak konfiguracji serwera e-mail.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // 3. Find the template
    const template = emailTemplates?.[templateType];
    if (!template) {
      return NextResponse.json({ error: `Template ${templateType} not found in CMS.` }, { status: 404 });
    }

    // 4. Render and send
    const subject = replaceVars(template.subject, data);
    const bodyHtml = replaceVars(template.body, data);

    const htmlContent = await render(
      React.createElement(UnifiedTemplate, {
        subject: subject,
        greeting: '', // The body from CMS already contains the greeting if it's HTML
        body: bodyHtml,
        footer: 'Zespół prawny RPMS Windykacja',
        isRawHtmlBody: true
      })
    );

    await transporter.sendMail({
      from: smtpUser,
      to: userEmail,
      subject: subject,
      html: htmlContent,
    });

    // TODO: In the future, save this notification to Firestore for the in-app notification bell
    // await saveNotificationToFirestore(userId, subject, bodyHtml);

    return NextResponse.json({ success: true, message: 'Webhook processed and email sent.' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
