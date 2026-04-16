import React, { useState } from 'react';
import { Mail, Save, RefreshCw, Eye, Code, FileText, ShieldCheck } from 'lucide-react';
import { TiptapEmailEditor } from './TiptapEmailEditor';
import { useCMSStore } from '../store/cmsStore';
import { cmsService } from '@/shared/api/apiClientFactory';

const LivePreview = ({ template, previewAsAuth }: { template: any, previewAsAuth: boolean }) => {
  const processHtmlBody = (html: string) => {
    if (!html) return '';
    return html
      .replace(/<blockquote>/g, '<blockquote style="border-left: 4px solid #137fec; padding: 15px 25px; background-color: #f0f9ff; margin: 30px 0; color: #0a2e5c;">')
      .replace(/<p>/g, '<p style="margin: 0 0 8px 0; color: #0a2e5c;">')
      .replace(/<ul>/g, '<ul style="margin: 0 0 12px 0; padding-left: 20px; color: #0a2e5c;">')
      .replace(/<li>/g, '<li style="margin-bottom: 2px; color: #0a2e5c;">');
  };

  const currentButtonText = previewAsAuth ? template.buttonText : (template.buttonTextNoAuth || template.buttonText);
  const currentButtonStyle = previewAsAuth ? template.buttonStyle : (template.buttonStyleNoAuth || template.buttonStyle);
  const currentButtonHelpText = previewAsAuth ? template.buttonHelpText : (template.buttonHelpTextNoAuth || template.buttonHelpText);

  return (
    <div className="w-full max-w-[600px] bg-[#f6f9fc] rounded-xl shadow-2xl font-sans overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-[#0a2e5c] p-[30px_40px] text-center">
        <h1 className="text-white m-0 text-2xl font-extrabold tracking-tight">
          RPMS <span className="text-[#137fec]">Windykacja</span>
        </h1>
      </div>
      
      {/* Content */}
      <div className="bg-white p-8 sm:p-10">
        {template.greeting && (
          <p className={`text-[#0a2e5c] ${template.greetingStyle === 'standard' ? 'text-lg font-bold m-[0_0_16px_0]' : 'text-2xl font-black m-[0_0_20px_0]'}`}>
            {template.greeting}
          </p>
        )}
        
        <div 
          className="text-[#0a2e5c] text-base leading-relaxed m-[0_0_24px_0] prose prose-p:my-0 prose-ul:my-0 prose-li:my-0 max-w-none"
          dangerouslySetInnerHTML={{ __html: processHtmlBody(template.body) || 'Brak treści' }}
        />

        {currentButtonText && currentButtonStyle !== 'link' && (
          <div className="text-center my-8">
            <span className="inline-block bg-[#137fec] text-white px-8 py-4 rounded-xl font-extrabold text-base">
              {currentButtonText}
            </span>
          </div>
        )}

        {currentButtonText && currentButtonStyle === 'link' && (
          <div className="my-8 text-left">
            {currentButtonHelpText && (
              <p className="text-[#0a2e5c] text-base font-bold m-[0_0_8px_0]">
                {currentButtonHelpText}
              </p>
            )}
            <span className="inline-block text-[#137fec] font-bold text-base border-b border-[#137fec] pb-0.5">
              {currentButtonText}
            </span>
          </div>
        )}

        <hr className="border-[#e2e8f0] my-[30px]" />
        
        <p className="text-[#94a3b8] text-sm leading-relaxed m-[0_0_20px_0] text-center whitespace-pre-wrap">
          {template.footer || 'Brak stopki'}
        </p>
        
        <p className="text-[#94a3b8] text-[11px] font-semibold uppercase tracking-widest text-center m-0">
          © {new Date().getFullYear()} RPMS Windykacja • Standard LegalTech • Poznań
        </p>
      </div>
    </div>
  );
};

const TemplatesManager: React.FC = () => {
  const logic = useCMSStore();
  const [activeCategory, setActiveCategory] = useState<'forms' | 'auth' | 'crm'>('forms');
  const [activeTemplate, setActiveTemplate] = useState<string>('autoresponder');
  const [previewAsAuth, setPreviewAsAuth] = useState<boolean>(true);
  
  // Default templates matching GAS
  const defaultTemplates: Record<string, any> = {
    // Kategoria: Formularze
    autoresponder: { category: 'forms', name: 'Autoresponder (Kontakt)', enabled: true, subject: 'Dziękujemy za kontakt, {{name}}', greeting: 'Witaj {{name}},', body: '<p>Dziękujemy za przesłanie wiadomości. Skontaktujemy się z Tobą najszybciej jak to możliwe.</p><p>Twoja wiadomość:<br>{{message}}</p>', buttonText: '', footer: 'Pozdrawiamy,\nZespół RPMS' },
    leadAutoresponder: { category: 'forms', name: 'Autoresponder (Lead)', enabled: true, subject: 'Dziękujemy za zainteresowanie ofertą RPMS, {{name}}', greeting: 'Dzień dobry {{name}},', body: '<p>Dziękujemy za przesłanie zapytania ofertowego. Nasz ekspert skontaktuje się z Tobą najszybciej jak to możliwe, aby omówić szczegóły współpracy.</p>', buttonText: '', footer: 'Pozdrawiamy,\nZespół RPMS' },
    adminNotification: { category: 'forms', name: 'Powiadomienie (Dla Admina)', enabled: true, subject: 'Nowe zapytanie od: {{name}}', greeting: 'Cześć Administratorze,', body: '<p>Otrzymałeś nową wiadomość z formularza kontaktowego.</p><p>Od: {{name}} ({{email}})<br>Telefon: {{phone}}</p><p>{{details}}</p><p>Wiadomość:<br>{{message}}</p>', buttonText: '', footer: 'Wiadomość wygenerowana automatycznie przez system RPMS.' },
    confirmLeadDebt: { category: 'forms', name: 'Potwierdzenie Zgłoszenia (Lead)', enabled: true, subject: 'Otrzymaliśmy Twoje zgłoszenie windykacyjne', greeting: 'Szanowny Kliencie,', body: '<p>Dziękujemy za zaufanie. Nasz zespół prawny właśnie rozpoczął analizę merytoryczną przesłanych dokumentów.</p><blockquote><p><strong>Zgłoszone wierzytelności:</strong></p><p>{{CASE_DETAILS}}</p></blockquote><p><strong>Co dalej?</strong></p><ul><li>Weryfikacja NIP</li><li>Wstępna strategia</li><li>Akceptacja</li></ul>', buttonText: 'Ustaw hasło i wejdź do Panelu →', buttonStyle: 'link', buttonHelpText: 'Chcesz monitorować postępy w czasie rzeczywistym?', footer: 'Zespół prawny RPMS Windykacja' },
    
    // Kategoria: Auth
    welcomeUser: { category: 'auth', name: 'Powitanie Nowego Użytkownika', enabled: true, subject: 'Witaj w RPMS Windykacja – Twój bezpieczny panel został aktywowany', greeting: 'Witaj, {{USER_NAME}}!', body: '<p>Twoje konto w nowoczesnym systemie odzyskiwania należności zostało pomyślnie utworzone. Od teraz masz pełny wgląd w przebieg swoich spraw 24/7.</p><p>Twoje dane logowania:<br>E-mail: <strong>{{USER_EMAIL}}</strong></p>', buttonText: 'Przejdź do Panelu Spraw', footer: 'Zespół prawny RPMS Windykacja' },
    accountActivation: { category: 'auth', name: 'Weryfikacja E-mail', enabled: true, subject: 'Aktywuj swoje konto w RPMS Windykacja', greeting: 'Witaj {{USER_NAME}},', body: '<p>Prosimy o potwierdzenie adresu e-mail, aby odblokować pełną funkcjonalność systemu windykacyjnego.</p>', buttonText: 'Potwierdź adres e-mail', footer: 'Zespół prawny RPMS Windykacja' },
    passwordReset: { category: 'auth', name: 'Resetowanie hasła', enabled: true, subject: 'Resetowanie hasła w systemie RPMS Windykacja', greeting: 'Witaj {{USER_NAME}},', body: '<p>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta.</p><p>Link jest ważny przez 60 minut. Jeśli to nie Ty prosiłeś o zmianę hasła, zignoruj tę wiadomość.</p>', buttonText: 'Ustaw nowe hasło', footer: 'Zespół prawny RPMS Windykacja' },
    inviteLead: { category: 'auth', name: 'Zaproszenie do założenia konta', enabled: true, subject: 'Zaproszenie do założenia konta w RPMS Windykacja', greeting: 'Szanowny Kliencie,', body: '<p>Twoja sprawa windykacyjna jest w toku. Załóż darmowe konto w naszym systemie, aby móc śledzić jej status 24/7 oraz bezpiecznie wymieniać dokumenty z naszym zespołem prawnym.</p>', buttonText: 'Załóż darmowe konto', footer: 'Zespół prawny RPMS Windykacja' },

    // Kategoria: CRM
    caseStatusUpdate: { category: 'crm', name: 'Zmiana statusu sprawy', enabled: true, subject: 'Aktualizacja statusu sprawy: {{CASE_ID}}', greeting: 'Witaj,', body: '<p>Status Twojej sprawy <strong>{{CASE_ID}}</strong> uległ zmianie.</p><p>Poprzedni status: <s>{{OLD_STATUS}}</s><br>Nowy status: <strong>{{NEW_STATUS}}</strong></p>', buttonText: 'Przejdź do Panelu Spraw', footer: 'Zespół prawny RPMS Windykacja' },
    documentRequired: { category: 'crm', name: 'Brakujące dokumenty', enabled: true, subject: 'Wymagane dodatkowe dokumenty do sprawy {{CASE_ID}}', greeting: 'Witaj,', body: '<p>Abyśmy mogli kontynuować prace nad Twoją sprawą, prosimy o przesłanie następującego dokumentu:</p><p><strong>{{DOCUMENT_NAME}}</strong></p>', buttonText: 'Prześlij dokument', footer: 'Zespół prawny RPMS Windykacja' },
    paymentReminder: { category: 'crm', name: 'Przypomnienie o płatności', enabled: true, subject: 'Przypomnienie o płatności - RPMS Windykacja', greeting: 'Witaj,', body: '<p>Przypominamy o zbliżającym się terminie płatności.</p><p>Kwota do zapłaty: <strong>{{AMOUNT}}</strong><br>Termin płatności: <strong>{{DUE_DATE}}</strong></p>', buttonText: 'Opłać teraz', footer: 'Zespół prawny RPMS Windykacja' },
    newCaseMessage: { category: 'crm', name: 'Nowa wiadomość w sprawie', enabled: true, subject: 'Nowa wiadomość w Twojej sprawie {{CASE_ID}}', greeting: 'Witaj,', body: '<p>W Twojej sprawie (<strong>{{CASE_ID}}</strong>) pojawiła się nowa wiadomość lub dokument od opiekuna prawnego. Zaloguj się do panelu, aby sprawdzić szczegóły.</p>', buttonText: 'Przejdź do Panelu', footer: 'Zespół prawny RPMS Windykacja' },
    caseClosed: { category: 'crm', name: 'Zakończenie sprawy', enabled: true, subject: 'Zakończenie sprawy windykacyjnej {{CASE_ID}}', greeting: 'Szanowny Kliencie,', body: '<p>Informujemy, że działania w sprawie <strong>{{CASE_ID}}</strong> zostały zakończone. Raport końcowy oraz podsumowanie kosztów znajdują się w Twoim panelu klienta.</p>', buttonText: 'Zobacz raport końcowy', footer: 'Zespół prawny RPMS Windykacja' }
  };

  const savedTemplates = logic.localContent.settings?.emailTemplates || {};
  const mergedTemplates = { ...defaultTemplates, ...savedTemplates };
  const currentTemplate = mergedTemplates[activeTemplate] || defaultTemplates['autoresponder'];

  const handleUpdate = (field: string, value: string | boolean) => {
    const currentSettings = logic.localContent.settings || {};
    logic.setLocalContent({
      ...logic.localContent,
      settings: {
        ...currentSettings,
        emailTemplates: {
          ...mergedTemplates,
          [activeTemplate]: {
            ...currentTemplate,
            [field]: value
          }
        }
      }
    });
  };

  const availableVariables = activeCategory === 'forms' 
    ? ['{{name}}', '{{email}}', '{{phone}}', '{{message}}', '{{details}}', '{{CASE_DETAILS}}']
    : activeCategory === 'auth' 
    ? ['{{USER_NAME}}', '{{USER_EMAIL}}', '{{ACTIVATION_URL}}', '{{RESET_URL}}', '{{REGISTER_URL}}', '{{DASHBOARD_URL}}']
    : ['{{CASE_ID}}', '{{OLD_STATUS}}', '{{NEW_STATUS}}', '{{DOCUMENT_NAME}}', '{{UPLOAD_URL}}', '{{AMOUNT}}', '{{DUE_DATE}}', '{{PAYMENT_LINK}}'];

  return (
    <div className="animate-in fade-in duration-500 h-full flex flex-col">
      {/* Header & Actions */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center">
            <Mail size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Szablony Komunikacji</h3>
            <p className="text-slate-400 text-sm">Zarządzaj ujednoliconymi wzorami e-mail (React Email).</p>
          </div>
        </div>
        
        <button
          onClick={() => logic.handleSave(async (content) => { await cmsService.updateCMS(content); })}
          disabled={logic.isSaving}
          className={`px-8 py-3 rounded-[var(--radius-brand-button)] font-black text-[11px] uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 ${
            logic.saveStatus === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
            logic.saveStatus === 'error' ? 'bg-red-500 text-white shadow-red-500/20' :
            'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-brand-blue/20'
          }`}
        >
          {logic.isSaving ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              Zapisywanie...
            </>
          ) : logic.saveStatus === 'success' ? (
            <>
              <Save size={14} />
              Zapisano pomyślnie
            </>
          ) : (
            <>
              <Save size={14} />
              Zapisz Szablony
            </>
          )}
        </button>
      </div>

      {/* Category Selector */}
      <div className="flex gap-4 mb-6 border-b border-slate-800 pb-4 shrink-0">
        <button
          onClick={() => { setActiveCategory('forms'); setActiveTemplate('autoresponder'); }}
          className={`px-6 py-3 rounded-[var(--radius-brand-button)] font-bold text-sm transition-all flex items-center gap-2 ${
            activeCategory === 'forms' 
            ? 'bg-slate-800 text-white' 
            : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <FileText size={16} />
          Formularze i Leady
        </button>
        <button
          onClick={() => { setActiveCategory('auth'); setActiveTemplate('welcomeUser'); }}
          className={`px-6 py-3 rounded-[var(--radius-brand-button)] font-bold text-sm transition-all flex items-center gap-2 ${
            activeCategory === 'auth' 
            ? 'bg-slate-800 text-white' 
            : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck size={16} />
          Autoryzacja i Konto
        </button>
        <button
          onClick={() => { setActiveCategory('crm'); setActiveTemplate('caseStatusUpdate'); }}
          className={`px-6 py-3 rounded-[var(--radius-brand-button)] font-bold text-sm transition-all flex items-center gap-2 ${
            activeCategory === 'crm' 
            ? 'bg-slate-800 text-white' 
            : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <RefreshCw size={16} />
          Powiadomienia CRM
        </button>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-8 min-h-0">
        
        {/* Left Column: Editor */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-2 pb-10 custom-scrollbar">
          {/* Template Selector */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(mergedTemplates)
              .filter(([_, tpl]: any) => tpl.category === activeCategory)
              .map(([key, tpl]: any) => (
                <button
                  key={key}
                  onClick={() => setActiveTemplate(key)}
                  className={`px-4 py-2 rounded-[var(--radius-brand-button)] font-bold text-xs transition-all ${
                    activeTemplate === key 
                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {tpl.name}
                </button>
              ))}
          </div>

          {/* Editor Form */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-button)]">
              <div>
                <h4 className="text-white font-bold">Status Szablonu</h4>
                <p className="text-xs text-slate-400">Czy ten e-mail ma być wysyłany automatycznie?</p>
              </div>
              <button
                onClick={() => handleUpdate('enabled', !currentTemplate.enabled)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                  currentTemplate.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    currentTemplate.enabled ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Temat Wiadomości</label>
              <input 
                type="text" 
                value={currentTemplate.subject || ''}
                onChange={(e) => handleUpdate('subject', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-[var(--radius-brand-input)] px-4 py-3 outline-none focus:border-brand-blue"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Powitanie / Tytuł</label>
                <div className="flex bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => handleUpdate('greetingStyle', 'large')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${currentTemplate.greetingStyle !== 'standard' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Duży nagłówek
                  </button>
                  <button
                    onClick={() => handleUpdate('greetingStyle', 'standard')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${currentTemplate.greetingStyle === 'standard' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Standardowe
                  </button>
                </div>
              </div>
              <input 
                type="text" 
                value={currentTemplate.greeting || ''}
                onChange={(e) => handleUpdate('greeting', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-[var(--radius-brand-input)] px-4 py-3 outline-none focus:border-brand-blue"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Główna Treść</label>
              <TiptapEmailEditor 
                initialValue={currentTemplate.body || ''}
                onChange={(html) => handleUpdate('body', html)}
              />
            </div>

            <div className="space-y-4 p-4 bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-button)]">
              <h4 className="text-white font-bold mb-4">Wezwanie do akcji (CTA)</h4>
              
              {/* Wariant A: Posiada konto */}
              <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Wariant A: Klient posiada konto</label>
                  <div className="flex bg-slate-900 rounded-lg p-1">
                    <button
                      onClick={() => handleUpdate('buttonStyle', 'button')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${currentTemplate.buttonStyle !== 'link' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Przycisk
                    </button>
                    <button
                      onClick={() => handleUpdate('buttonStyle', 'link')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${currentTemplate.buttonStyle === 'link' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Link tekstowy
                    </button>
                  </div>
                </div>
                
                {currentTemplate.buttonStyle === 'link' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tekst pomocniczy (nad linkiem)</label>
                    <input 
                      type="text" 
                      value={currentTemplate.buttonHelpText || ''}
                      onChange={(e) => handleUpdate('buttonHelpText', e.target.value)}
                      placeholder="np. Chcesz sprawdzić szczegóły?"
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-[var(--radius-brand-input)] px-4 py-3 outline-none focus:border-brand-blue"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tekst na przycisku / linku</label>
                  <input 
                    type="text" 
                    value={currentTemplate.buttonText || ''}
                    onChange={(e) => handleUpdate('buttonText', e.target.value)}
                    placeholder="np. Przejdź do Panelu Spraw"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-[var(--radius-brand-input)] px-4 py-3 outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              {/* Wariant B: Nie posiada konta */}
              <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-widest">Wariant B: Klient nie posiada konta</label>
                  <div className="flex bg-slate-900 rounded-lg p-1">
                    <button
                      onClick={() => handleUpdate('buttonStyleNoAuth', 'button')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${currentTemplate.buttonStyleNoAuth === 'button' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Przycisk
                    </button>
                    <button
                      onClick={() => handleUpdate('buttonStyleNoAuth', 'link')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${currentTemplate.buttonStyleNoAuth === 'link' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Link tekstowy
                    </button>
                  </div>
                </div>
                
                {currentTemplate.buttonStyleNoAuth === 'link' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tekst pomocniczy (nad linkiem)</label>
                    <input 
                      type="text" 
                      value={currentTemplate.buttonHelpTextNoAuth || ''}
                      onChange={(e) => handleUpdate('buttonHelpTextNoAuth', e.target.value)}
                      placeholder="np. Chcesz monitorować postępy w czasie rzeczywistym?"
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-[var(--radius-brand-input)] px-4 py-3 outline-none focus:border-brand-blue"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tekst na przycisku / linku</label>
                  <input 
                    type="text" 
                    value={currentTemplate.buttonTextNoAuth || ''}
                    onChange={(e) => handleUpdate('buttonTextNoAuth', e.target.value)}
                    placeholder="np. Załóż darmowe konto i wejdź do Panelu"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-[var(--radius-brand-input)] px-4 py-3 outline-none focus:border-brand-blue"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stopka</label>
              <textarea 
                value={currentTemplate.footer || ''}
                onChange={(e) => handleUpdate('footer', e.target.value)}
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-[var(--radius-brand-input)] px-4 py-3 outline-none focus:border-brand-blue resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Variables & Preview */}
        <div className="flex flex-col gap-6 h-full overflow-hidden pb-10">
          {/* Variables */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-6 shrink-0">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <Code size={16} className="text-brand-blue" />
              Dostępne Zmienne
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Skopiuj i wklej poniższe tagi w treści lub temacie. Zostaną one automatycznie podmienione na dane z systemu.
            </p>
            <div className="flex flex-wrap gap-2">
              {availableVariables.map(tag => (
                <code key={tag} className="bg-slate-900 border border-slate-800 text-brand-blue px-3 py-1.5 rounded-[var(--radius-brand-button)] text-xs font-bold">
                  {tag}
                </code>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-brand-blue" />
                <h4 className="text-white font-bold text-sm">Podgląd na żywo</h4>
              </div>
              <div className="flex bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setPreviewAsAuth(true)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${previewAsAuth ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Zarejestrowany
                </button>
                <button
                  onClick={() => setPreviewAsAuth(false)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${!previewAsAuth ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Niezarejestrowany
                </button>
              </div>
            </div>
            <div className="p-6 bg-slate-950 flex-1 overflow-y-auto custom-scrollbar flex justify-center items-start">
              <LivePreview template={currentTemplate} previewAsAuth={previewAsAuth} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TemplatesManager;
