import React, { useState, useEffect } from 'react';
import { Mail, Save, RefreshCw, Send, Info } from 'lucide-react';

const DEFAULT_TEMPLATES = {
  'WELCOME_NEW_USER': {
    name: 'Powitanie nowego klienta',
    subject: 'Witaj w RPMS Windykacja – Twój bezpieczny panel został aktywowany',
    body: '<p>Witaj, <strong>{{USER_NAME}}</strong>!</p><p>Twoje konto w nowoczesnym systemie odzyskiwania należności zostało pomyślnie utworzone. Od teraz masz pełny wgląd w przebieg swoich spraw 24/7.</p><p>Twoje dane logowania:<br/>E-mail: <strong>{{USER_EMAIL}}</strong></p><p><a href="{{DASHBOARD_URL}}">Przejdź do Panelu Spraw</a></p>',
    variables: ['{{USER_NAME}}', '{{USER_EMAIL}}', '{{DASHBOARD_URL}}']
  },
  'ACCOUNT_ACTIVATION': {
    name: 'Weryfikacja adresu e-mail',
    subject: 'Aktywuj swoje konto w RPMS Windykacja',
    body: '<p>Witaj <strong>{{USER_NAME}}</strong>,</p><p>prosimy o potwierdzenie adresu e-mail, aby odblokować pełną funkcjonalność systemu windykacyjnego.</p><p><a href="{{ACTIVATION_URL}}">Potwierdź adres e-mail</a></p>',
    variables: ['{{USER_NAME}}', '{{ACTIVATION_URL}}']
  },
  'PASSWORD_RESET': {
    name: 'Resetowanie hasła',
    subject: 'Resetowanie hasła w systemie RPMS Windykacja',
    body: '<p>Witaj <strong>{{USER_NAME}}</strong>,</p><p>otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta.</p><p><a href="{{RESET_URL}}">Ustaw nowe hasło</a></p><p>Link jest ważny przez 60 minut. Jeśli to nie Ty prosiłeś o zmianę hasła, zignoruj tę wiadomość.</p>',
    variables: ['{{USER_NAME}}', '{{RESET_URL}}']
  },
  'CONFIRM_LEAD_DEBT': {
    name: 'Potwierdzenie przyjęcia sprawy',
    subject: 'Otrzymaliśmy Twoje zgłoszenie windykacyjne - Analiza w toku',
    body: '<p>Dziękujemy za zaufanie. Nasz zespół prawny właśnie rozpoczął analizę merytoryczną przesłanych dokumentów.</p><p><strong>Zgłoszone wierzytelności:</strong><br/>{{CASE_DETAILS}}</p><p>Co dalej?</p><ul><li>W ciągu 15 minut nasz system zweryfikuje NIP dłużnika w bazach gospodarczych.</li><li>Opiekun prawny przygotuje wstępną strategię odzyskania kwoty.</li><li>Otrzymasz powiadomienie o gotowej analizie do akceptacji.</li></ul><p><a href="{{DASHBOARD_URL}}">Ustaw hasło i wejdź do Panelu</a></p>',
    variables: ['{{CASE_DETAILS}}', '{{DASHBOARD_URL}}']
  },
  'CASE_STATUS_UPDATE': {
    name: 'Zmiana statusu sprawy',
    subject: 'Aktualizacja statusu sprawy: {{CASE_ID}}',
    body: '<p>Witaj,</p><p>Status Twojej sprawy <strong>{{CASE_ID}}</strong> uległ zmianie.</p><p>Poprzedni status: <s>{{OLD_STATUS}}</s><br/>Nowy status: <strong>{{NEW_STATUS}}</strong></p><p><a href="{{DASHBOARD_URL}}">Przejdź do Panelu Spraw</a></p>',
    variables: ['{{CASE_ID}}', '{{OLD_STATUS}}', '{{NEW_STATUS}}', '{{DASHBOARD_URL}}']
  },
  'DOCUMENT_REQUIRED': {
    name: 'Brakujące dokumenty',
    subject: 'Wymagane dodatkowe dokumenty do sprawy {{CASE_ID}}',
    body: '<p>Witaj,</p><p>Abyśmy mogli kontynuować prace nad Twoją sprawą, prosimy o przesłanie następującego dokumentu:</p><p><strong>{{DOCUMENT_NAME}}</strong></p><p><a href="{{UPLOAD_URL}}">Prześlij dokument</a></p>',
    variables: ['{{CASE_ID}}', '{{DOCUMENT_NAME}}', '{{UPLOAD_URL}}']
  },
  'PAYMENT_REMINDER': {
    name: 'Przypomnienie o płatności',
    subject: 'Przypomnienie o płatności - RPMS Windykacja',
    body: '<p>Witaj,</p><p>Przypominamy o zbliżającym się terminie płatności.</p><p>Kwota do zapłaty: <strong>{{AMOUNT}}</strong><br/>Termin płatności: <strong>{{DUE_DATE}}</strong></p><p><a href="{{PAYMENT_LINK}}">Opłać teraz</a></p>',
    variables: ['{{AMOUNT}}', '{{DUE_DATE}}', '{{PAYMENT_LINK}}']
  }
};

export const EmailTemplatesManager = ({ logic }: { logic: any }) => {
  const [activeTemplate, setActiveTemplate] = useState<string>('WELCOME_NEW_USER');
  const [isTesting, setIsTesting] = useState(false);

  // Initialize templates if they don't exist in CMS
  useEffect(() => {
    if (!logic.localContent.emailTemplates) {
      const initialTemplates: any = {};
      Object.entries(DEFAULT_TEMPLATES).forEach(([key, val]) => {
        initialTemplates[key] = { subject: val.subject, body: val.body };
      });
      logic.setLocalContent({
        ...logic.localContent,
        emailTemplates: initialTemplates
      });
    }
  }, []);

  const templates = logic.localContent.emailTemplates || {};
  const currentTemplateData = templates[activeTemplate] || { subject: '', body: '' };
  const currentTemplateMeta = DEFAULT_TEMPLATES[activeTemplate as keyof typeof DEFAULT_TEMPLATES];

  const handleUpdate = (field: 'subject' | 'body', value: string) => {
    logic.setLocalContent({
      ...logic.localContent,
      emailTemplates: {
        ...templates,
        [activeTemplate]: {
          ...currentTemplateData,
          [field]: value
        }
      }
    });
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'test_template',
          data: {
            subject: currentTemplateData.subject,
            body: currentTemplateData.body
          }
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Wysłano testowy e-mail z tym szablonem!');
      } else {
        alert(`Błąd: ${result.error}`);
      }
    } catch (error) {
      alert('Błąd połączenia z serwerem.');
    } finally {
      setIsTesting(false);
    }
  };

  const insertVariable = (variable: string) => {
    handleUpdate('body', currentTemplateData.body + ' ' + variable);
  };

  if (!logic.localContent.emailTemplates) return <div className="p-10 text-white">Inicjalizacja szablonów...</div>;

  return (
    <div className="flex h-[calc(100vh-160px)] gap-6 animate-in fade-in duration-500">
      {/* Sidebar */}
      <div className="w-1/3 bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center">
            <Mail size={20} />
          </div>
          <h3 className="text-xl font-black text-white">Szablony E-mail</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {Object.entries(DEFAULT_TEMPLATES).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setActiveTemplate(key)}
              className={`w-full text-left px-4 py-4 rounded-[var(--radius-brand-button)] transition-all ${
                activeTemplate === key 
                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="font-bold text-sm mb-1">{meta.name}</div>
              <div className="text-[10px] uppercase tracking-widest opacity-70">{key}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <div>
            <h4 className="text-lg font-bold text-white mb-1">Edycja: {currentTemplateMeta?.name}</h4>
            <p className="text-xs text-slate-400">Zmieniaj treść, używając tagów HTML (np. &lt;strong&gt;, &lt;p&gt;, &lt;br/&gt;)</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleTest}
              disabled={isTesting}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-[var(--radius-brand-button)] font-bold text-xs transition-all flex items-center gap-2 border border-slate-700"
            >
              {isTesting ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
              Wyślij test
            </button>
            <button
              onClick={logic.handleSave}
              disabled={logic.isSaving}
              className="px-4 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-[var(--radius-brand-button)] font-bold text-xs transition-all shadow-lg shadow-brand-blue/20 flex items-center gap-2"
            >
              {logic.isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              Zapisz szablony
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Temat wiadomości</label>
            <input 
              type="text" 
              value={currentTemplateData.subject}
              onChange={(e) => handleUpdate('subject', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-[var(--radius-brand-input)] px-4 py-3 outline-none focus:border-brand-blue font-medium"
            />
          </div>

          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Treść wiadomości (HTML)</label>
              <div className="flex gap-2">
                {currentTemplateMeta?.variables.map(v => (
                  <button 
                    key={v}
                    onClick={() => insertVariable(v)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-brand-blue text-[10px] font-mono rounded border border-slate-700 transition-colors"
                    title="Kliknij, aby dodać na końcu treści"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <textarea 
              value={currentTemplateData.body}
              onChange={(e) => handleUpdate('body', e.target.value)}
              className="w-full flex-1 min-h-[300px] bg-slate-800 border border-slate-700 text-slate-300 rounded-[var(--radius-brand-input)] px-4 py-4 outline-none focus:border-brand-blue font-mono text-sm leading-relaxed resize-none"
            />
          </div>
          
          <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-xl p-4 flex gap-3 items-start">
            <Info size={18} className="text-brand-blue shrink-0 mt-0.5" />
            <p className="text-xs text-brand-blue/80 leading-relaxed">
              <strong>Wskazówka:</strong> Treść, którą tu wpiszesz, zostanie automatycznie osadzona w głównej, granatowej ramie z logo RPMS Windykacja. Nie musisz dodawać tagów &lt;html&gt; ani &lt;body&gt;. Używaj prostych znaczników jak &lt;p&gt; (akapit), &lt;strong&gt; (pogrubienie), &lt;br/&gt; (nowa linia) lub &lt;a href="..."&gt; (link).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplatesManager;
