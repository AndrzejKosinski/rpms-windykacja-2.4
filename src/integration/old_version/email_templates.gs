/**
 * REZYDENCJA SZABLONÓW E-MAIL - RPMS WINDYKACJA
 */

const EMAIL_TEMPLATES = {
  'WELCOME_NEW_USER': {
    subject: "Witaj w RPMS Windykacja – Twój bezpieczny panel został aktywowany",
    body: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #0a2e5c; line-height: 1.6;">
        <div style="background-color: #0a2e5c; padding: 40px; text-align: center; border-radius: 24px 24px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -1px;">RPMS<span style="color: #137fec;"> Windykacja</span></h1>
        </div>
        <div style="padding: 40px; background-color: #ffffff; border: 1px solid #e0f2fe; border-top: none; border-radius: 0 0 24px 24px;">
          <h2 style="font-size: 28px; font-weight: 900; margin-top: 0; italic">Witaj, {{USER_NAME}}!</h2>
          <p style="font-size: 16px; font-weight: 500; color: #64748b;">Twoje konto w nowoczesnym systemie odzyskiwania należności zostało pomyślnie utworzone. Od teraz masz pełny wgląd w przebieg swoich spraw 24/7.</p>
          
          <div style="background-color: #f8fafc; border-radius: 16px; padding: 24px; margin: 30px 0; border: 1px solid #f1f5f9;">
            <p style="margin: 0; font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Twoje dane logowania:</p>
            <p style="margin: 8px 0 0 0; font-size: 15px; font-weight: 800; color: #0a2e5c;">E-mail: <span style="color: #137fec;">{{USER_EMAIL}}</span></p>
          </div>

          <a href="{{DASHBOARD_URL}}" style="display: block; background-color: #137fec; color: #ffffff; text-decoration: none; padding: 20px; border-radius: 12px; text-align: center; font-weight: 800; font-size: 16px; box-shadow: 0 10px 20px -5px rgba(19, 127, 236, 0.3);">Przejdź do Panelu Spraw</a>
          
          <p style="font-size: 13px; color: #94a3b8; margin-top: 30px; text-align: center;">Zespół prawny RPMS Windykacja</p>
        </div>
        <div style="padding: 20px; text-align: center; font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">
          © 2024 RPMS Windykacja • Standard LegalTech • Warszawa
        </div>
      </div>
    `
  },

  'CONFIRM_LEAD_DEBT': {
    subject: "Otrzymaliśmy Twoje zgłoszenie windykacyjne - Analiza w toku",
    body: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #0a2e5c; line-height: 1.6;">
        <div style="background-color: #0a2e5c; padding: 40px; text-align: center; border-radius: 24px 24px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -1px;">RPMS<span style="color: #137fec;"> Windykacja</span></h1>
        </div>
        <div style="padding: 40px; background-color: #ffffff; border: 1px solid #e0f2fe; border-top: none; border-radius: 0 0 24px 24px;">
          <h2 style="font-size: 28px; font-weight: 900; margin-top: 0;">Potwierdzenie przyjęcia sprawy</h2>
          <p style="font-size: 16px; font-weight: 500; color: #64748b;">Dziękujemy za zaufanie. Nasz zespół prawny właśnie rozpoczął analizę merytoryczną przesłanych dokumentów.</p>
          
          <div style="border-left: 4px solid #137fec; padding: 15px 25px; background-color: #f0f9ff; margin: 30px 0;">
            <p style="margin: 0; font-size: 14px; font-weight: 700;">Zgłoszone wierzytelności:</p>
            <p style="margin: 5px 0 0 0; font-size: 13px; font-weight: 500; color: #0a2e5c;">{{CASE_DETAILS}}</p>
          </div>

          <p style="font-size: 15px; font-weight: 700;">Co dalej?</p>
          <ul style="padding-left: 20px; font-size: 14px; color: #64748b;">
            <li>W ciągu 15 minut nasz system zweryfikuje NIP dłużnika w bazach gospodarczych.</li>
            <li>Opiekun prawny przygotuje wstępną strategię odzyskania kwoty.</li>
            <li>Otrzymasz powiadomienie o gotowej analizie do akceptacji.</li>
          </ul>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
            <p style="font-size: 14px; font-weight: 800; margin-bottom: 10px;">Chcesz monitorować postępy w czasie rzeczywistym?</p>
            <a href="{{DASHBOARD_URL}}" style="display: inline-block; color: #137fec; text-decoration: none; font-weight: 800; font-size: 14px; border-bottom: 2px solid #137fec;">Ustaw hasło i wejdź do Panelu &rarr;</a>
          </div>
        </div>
      </div>
    `
  }
};
