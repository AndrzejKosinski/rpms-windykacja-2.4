import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { cmsService, userService } from '@/shared/api/apiClientFactory';
import { render } from '@react-email/render';
import UnifiedTemplate from '@/components/emails/UnifiedTemplate';
import React from 'react';
import { rateLimit, getClientIp } from '../../../utils/rateLimit';

const replaceVars = (text: string, data: any) => {
  if (!text) return '';
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
};

// Default templates in case CMS fetch fails
const DEFAULT_TEMPLATES = {
  autoresponder: {
    enabled: true,
    subject: 'Dziękujemy za kontakt, {{name}}',
    greeting: 'Witaj {{name}},',
    body: 'Dziękujemy za przesłanie wiadomości. Skontaktujemy się z Tobą najszybciej jak to możliwe.\n\nTwoja wiadomość:\n{{message}}',
    footer: 'Pozdrawiamy,\nZespół RPMS'
  },
  leadAutoresponder: {
    enabled: true,
    subject: 'Dziękujemy za zainteresowanie ofertą RPMS, {{name}}',
    greeting: 'Dzień dobry {{name}},',
    body: 'Dziękujemy za przesłanie zapytania ofertowego. Nasz ekspert skontaktuje się z Tobą najszybciej jak to możliwe, aby omówić szczegóły współpracy.',
    footer: 'Pozdrawiamy,\nZespół RPMS'
  },
  adminNotification: {
    enabled: true,
    subject: 'Nowe zapytanie od: {{name}}',
    greeting: 'Cześć Administratorze,',
    body: 'Otrzymałeś nową wiadomość z formularza kontaktowego.\n\nOd: {{name}} ({{email}})\nTelefon: {{phone}}\n\n{{details}}\n\nWiadomość:\n{{message}}',
    footer: 'Wiadomość wygenerowana automatycznie przez system RPMS.'
  },
  confirmLeadDebt: {
    enabled: true,
    subject: 'Otrzymaliśmy Twoje zgłoszenie windykacyjne',
    greeting: 'Szanowny Kliencie,',
    body: 'Dziękujemy za zaufanie. Nasz zespół prawny właśnie rozpoczął analizę merytoryczną przesłanych dokumentów.\n\nZgłoszone wierzytelności:\n{{CASE_DETAILS}}\n\nCo dalej?\n- Weryfikacja NIP\n- Wstępna strategia\n- Akceptacja',
    buttonText: 'Przejdź do Panelu',
    footer: 'Zespół prawny RPMS Windykacja'
  },
  welcomeUser: {
    enabled: true,
    subject: 'Witaj w RPMS Windykacja – Twój bezpieczny panel został aktywowany',
    greeting: 'Witaj, {{USER_NAME}}!',
    body: 'Twoje konto w nowoczesnym systemie odzyskiwania należności zostało pomyślnie utworzone. Od teraz masz pełny wgląd w przebieg swoich spraw 24/7.\n\nTwoje dane logowania:\nE-mail: {{USER_EMAIL}}',
    buttonText: 'Przejdź do Panelu Spraw',
    footer: 'Zespół prawny RPMS Windykacja'
  },
  accountActivation: {
    enabled: true,
    subject: 'Aktywuj swoje konto w RPMS Windykacja',
    greeting: 'Witaj {{USER_NAME}},',
    body: 'Prosimy o potwierdzenie adresu e-mail, aby odblokować pełną funkcjonalność systemu windykacyjnego.',
    buttonText: 'Potwierdź adres e-mail',
    footer: 'Zespół prawny RPMS Windykacja'
  },
  passwordReset: {
    enabled: true,
    subject: 'Resetowanie hasła w systemie RPMS Windykacja',
    greeting: 'Witaj {{USER_NAME}},',
    body: 'Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta.\nLink jest ważny przez 60 minut. Jeśli to nie Ty prosiłeś o zmianę hasła, zignoruj tę wiadomość.',
    buttonText: 'Ustaw nowe hasło',
    footer: 'Zespół prawny RPMS Windykacja'
  },
  inviteLead: {
    enabled: true,
    subject: 'Zaproszenie do założenia konta w RPMS Windykacja',
    greeting: 'Szanowny Kliencie,',
    body: 'Twoja sprawa windykacyjna jest w toku. Załóż darmowe konto w naszym systemie, aby móc śledzić jej status 24/7 oraz bezpiecznie wymieniać dokumenty z naszym zespołem prawnym.',
    buttonText: 'Załóż darmowe konto',
    footer: 'Zespół prawny RPMS Windykacja'
  },
  newCaseMessage: {
    enabled: true,
    subject: 'Nowa wiadomość w Twojej sprawie {{CASE_ID}}',
    greeting: 'Witaj,',
    body: 'W Twojej sprawie ({{CASE_ID}}) pojawiła się nowa wiadomość lub dokument od opiekuna prawnego. Zaloguj się do panelu, aby sprawdzić szczegóły.',
    buttonText: 'Przejdź do Panelu',
    footer: 'Zespół prawny RPMS Windykacja'
  },
  caseClosed: {
    enabled: true,
    subject: 'Zakończenie sprawy windykacyjnej {{CASE_ID}}',
    greeting: 'Szanowny Kliencie,',
    body: 'Informujemy, że działania w sprawie {{CASE_ID}} zostały zakończone. Raport końcowy oraz podsumowanie kosztów znajdują się w Twoim panelu klienta.',
    buttonText: 'Zobacz raport końcowy',
    footer: 'Zespół prawny RPMS Windykacja'
  }
};

export async function POST(request: Request) {
  try {
    // Rate limiting: 5 requests per minute per IP for contact form
    const ip = getClientIp(request);
    const rateLimitResult = rateLimit(`contact_${ip}`, { limit: 5, windowMs: 60 * 1000 });
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Zbyt wiele zapytań. Spróbuj ponownie za chwilę.' }, 
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      );
    }

    const body = await request.json();
    const { type, data } = body;

    // Honeypot check - if the hidden field is filled, it's a bot
    if (data && data.bot_check_field) {
      console.log('Bot detected via honeypot. Silently rejecting.');
      // Return fake success to fool the bot
      return NextResponse.json({ success: true, message: 'Wiadomości wysłane pomyślnie' });
    }

    const processHtmlBody = (html: string) => {
      if (!html) return '';
      return html
        .replace(/<blockquote>/g, '<blockquote style="border-left: 4px solid #137fec; padding: 15px 25px; background-color: #f0f9ff; margin: 30px 0; color: #0a2e5c;">')
        .replace(/<p>/g, '<p style="margin: 0 0 8px 0; color: #0a2e5c;">')
        .replace(/<ul>/g, '<ul style="margin: 0 0 12px 0; padding-left: 20px; color: #0a2e5c;">')
        .replace(/<li>/g, '<li style="margin-bottom: 2px; color: #0a2e5c;">');
    };

    // Fetch CMS settings to get email configuration
    let cmsSettings: any = {};
    let emailTemplates: any = null;
    try {
      const cmsData = await cmsService.getCMS();
      if (cmsData && cmsData.full_content && cmsData.full_content.settings) {
        cmsSettings = cmsData.full_content.settings.email || {};
        emailTemplates = cmsData.full_content.settings.emailTemplates;
      }
    } catch (error) {
      console.error('Failed to fetch CMS settings for email:', error);
    }

    const smtpUser = cmsSettings.smtpUser || process.env.SMTP_USER;
    const smtpPass = cmsSettings.smtpPass || process.env.SMTP_PASS;
    const destination = cmsSettings.destination || process.env.CONTACT_EMAIL_DESTINATION;

    if (!smtpUser || !smtpPass || !destination) {
      console.error('Missing email configuration. Please configure in Admin Panel or .env');
      return NextResponse.json(
        { error: 'Brak konfiguracji serwera e-mail.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Assuming Gmail/Google Workspace for now, could be configurable
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Default templates if not set in CMS
    const templates = emailTemplates || DEFAULT_TEMPLATES;

    if (type === 'test') {
      const testHtml = await render(
        React.createElement(UnifiedTemplate, {
          subject: 'Test konfiguracji SMTP - RPMS',
          greeting: 'Witaj,',
          body: processHtmlBody('<p>Ta wiadomość została wysłana z Panelu Administratora systemu RPMS.</p><blockquote><p><strong>Ważna informacja:</strong></p><p>Jeśli ją czytasz, oznacza to, że Twoja konfiguracja serwera SMTP działa poprawnie!</p></blockquote>'),
          footer: 'Pozdrawiamy,\nZespół RPMS',
          isRawHtmlBody: true
        })
      );

      await transporter.sendMail({
        from: smtpUser,
        to: destination,
        subject: '[Test] Test konfiguracji SMTP - RPMS',
        html: testHtml,
      });

      return NextResponse.json({ success: true, message: 'Wiadomość testowa wysłana pomyślnie' });
    }

    // For 'lawyer' and 'lead', we might have extra fields. 
    // We split them into 'message' (pure user input) and 'details' (technical summary for admin).
    let enrichedData = { ...data };
    enrichedData.details = '';
    
    if (type === 'lead') {
      enrichedData.details = `Firma: ${data.companyName || '-'}\nNIP: ${data.nip || '-'}\nWielkość: ${data.companySize || '-'}\nUsługa: ${data.service || '-'}`;
      enrichedData.message = data.message || '';
    } else if (type === 'lawyer') {
      enrichedData.details = `Temat: ${data.topic || '-'}`;
      enrichedData.message = data.message || '';
    } else {
      enrichedData.message = data.message || '';
    }

    const promises = [];

    // Determine which templates to use based on the request type
    let userTemplateKey = '';
    let adminTemplateKey = '';
    let recipientEmail = '';
    let buttonUrl = '';

    switch (type) {
      case 'contactForm':
      case 'lawyer':
        userTemplateKey = 'autoresponder';
        adminTemplateKey = 'adminNotification';
        recipientEmail = data?.email;
        break;
      case 'lead':
        userTemplateKey = 'leadAutoresponder';
        adminTemplateKey = 'adminNotification';
        recipientEmail = data?.email;
        break;
      case 'leadDebt':
        userTemplateKey = 'confirmLeadDebt';
        adminTemplateKey = 'adminNotification';
        recipientEmail = data?.email;
        buttonUrl = data?.DASHBOARD_URL || 'https://rpms.pl/panel';
        break;
      case 'welcomeUser':
        userTemplateKey = 'welcomeUser';
        recipientEmail = data?.USER_EMAIL;
        buttonUrl = data?.DASHBOARD_URL || 'https://rpms.pl/panel';
        break;
      case 'accountActivation':
        userTemplateKey = 'accountActivation';
        recipientEmail = data?.USER_EMAIL;
        buttonUrl = data?.ACTIVATION_URL;
        break;
      case 'passwordReset':
        userTemplateKey = 'passwordReset';
        recipientEmail = data?.USER_EMAIL;
        buttonUrl = data?.RESET_URL;
        break;
      case 'inviteLead':
        userTemplateKey = 'inviteLead';
        recipientEmail = data?.USER_EMAIL;
        buttonUrl = data?.REGISTER_URL;
        break;
      case 'newCaseMessage':
        userTemplateKey = 'newCaseMessage';
        recipientEmail = data?.USER_EMAIL;
        buttonUrl = data?.DASHBOARD_URL;
        break;
      case 'caseClosed':
        userTemplateKey = 'caseClosed';
        recipientEmail = data?.USER_EMAIL;
        buttonUrl = data?.DASHBOARD_URL;
        break;
      default:
        userTemplateKey = 'autoresponder';
        adminTemplateKey = 'adminNotification';
        recipientEmail = data?.email;
    }

    // Determine if user has an active account
    let hasActiveAccount = data?.hasActiveAccount;
    if (hasActiveAccount === undefined && recipientEmail) {
      const userStatus = await userService.checkUserStatus(recipientEmail);
      hasActiveAccount = userStatus.isActive;
    }

    // 1. Send Admin Notification (if applicable)
    if (adminTemplateKey && templates[adminTemplateKey]?.enabled !== false) {
      const tpl = templates[adminTemplateKey];
      const subject = replaceVars(tpl.subject, enrichedData);
      
      const isAuth = hasActiveAccount !== false;
      const finalButtonText = isAuth ? tpl.buttonText : (tpl.buttonTextNoAuth || tpl.buttonText);
      const finalButtonStyle = isAuth ? (tpl.buttonStyle || 'button') : (tpl.buttonStyleNoAuth || tpl.buttonStyle || 'button');
      const finalButtonHelpText = isAuth ? tpl.buttonHelpText : (tpl.buttonHelpTextNoAuth || tpl.buttonHelpText);

      const htmlContent = await render(
        React.createElement(UnifiedTemplate, {
          subject: subject,
          greeting: replaceVars(tpl.greeting, enrichedData),
          body: processHtmlBody(replaceVars(tpl.body, enrichedData)),
          footer: replaceVars(tpl.footer, enrichedData),
          buttonText: finalButtonText,
          buttonUrl: buttonUrl,
          buttonStyle: finalButtonStyle,
          buttonHelpText: replaceVars(finalButtonHelpText, enrichedData),
          isRawHtmlBody: true,
          greetingStyle: tpl.greetingStyle || 'large'
        })
      );

      promises.push(
        transporter.sendMail({
          from: smtpUser,
          to: destination,
          subject: subject,
          html: htmlContent,
          replyTo: data?.email || smtpUser,
        })
      );
    }

    // 2. Send Autoresponder/Notification to Client
    if (userTemplateKey && templates[userTemplateKey]?.enabled && recipientEmail) {
      const tpl = templates[userTemplateKey];
      const subject = replaceVars(tpl.subject, enrichedData);
      
      const isAuth = hasActiveAccount !== false;
      const finalButtonText = isAuth ? tpl.buttonText : (tpl.buttonTextNoAuth || tpl.buttonText);
      const finalButtonStyle = isAuth ? (tpl.buttonStyle || 'button') : (tpl.buttonStyleNoAuth || tpl.buttonStyle || 'button');
      const finalButtonHelpText = isAuth ? tpl.buttonHelpText : (tpl.buttonHelpTextNoAuth || tpl.buttonHelpText);

      const htmlContent = await render(
        React.createElement(UnifiedTemplate, {
          subject: subject,
          greeting: replaceVars(tpl.greeting, enrichedData),
          body: processHtmlBody(replaceVars(tpl.body, enrichedData)),
          footer: replaceVars(tpl.footer, enrichedData),
          buttonText: finalButtonText,
          buttonUrl: buttonUrl,
          buttonStyle: finalButtonStyle,
          buttonHelpText: replaceVars(finalButtonHelpText, enrichedData),
          isRawHtmlBody: true,
          greetingStyle: tpl.greetingStyle || 'large'
        })
      );

      promises.push(
        transporter.sendMail({
          from: smtpUser,
          to: recipientEmail,
          subject: subject,
          html: htmlContent,
        })
      );
    }

    await Promise.all(promises);

    // TODO: Phase 2 - Save to Database
    // try {
    //   await databaseService.saveContactSubmission({ type, data, timestamp: new Date() });
    // } catch (dbError) {
    //   console.error('Failed to save to database:', dbError);
    // }

    return NextResponse.json({ success: true, message: 'Wiadomości wysłane pomyślnie' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wysyłania wiadomości.' },
      { status: 500 }
    );
  }
}
