"use client";

import React, { useState } from 'react';
import { Verified, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { logCustomEvent } from '../../../utils/customLogger';
import { FormLabel } from '@/shared/ui/forms/FormLabel';
import { FormInput } from '@/shared/ui/forms/FormInput';
import { FormButton } from '@/shared/ui/forms/FormButton';

interface LeadFormProps {
  id?: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ id }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    bot_check_field: ''
  });

  const [hasStartedFilling, setHasStartedFilling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const isPhoneValid = formData.phone.length === 0 || /^\+48 \d{3} \d{3} \d{3}$/.test(formData.phone);
    if (!isPhoneValid) {
      setError('Podaj poprawny numer telefonu (np. +48 123 456 789) lub pozostaw to pole puste.');
      setIsLoading(false);
      return;
    }
    
    // Dual-track: Log to GAS (existing)
    logCustomEvent({
      event_name: 'lead_form_submitted',
      user_email: formData.email,
      metadata: {
        name: formData.name,
        phone: formData.phone,
        company: formData.company
      }
    });

    // Dual-track: Send to new API
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'lead',
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            companyName: formData.company,
            nip: '',
            companySize: '',
            service: 'Lead ze strony głównej',
            message: '',
            bot_check_field: formData.bot_check_field
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Wystąpił problem podczas wysyłania wiadomości.');
      }

      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', company: '', bot_check_field: '' });
      setHasStartedFilling(false);
    } catch (error) {
      console.error('Failed to send contact form:', error);
      setError('Wystąpił problem z wysłaniem formularza. Spróbuj ponownie później lub skontaktuj się z nami telefonicznie.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasStartedFilling) {
      setHasStartedFilling(true);
      logCustomEvent({ 
        event_name: 'lead_form_started', 
        metadata: { first_field: e.target.name } 
      });
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!hasStartedFilling) {
      setHasStartedFilling(true);
      logCustomEvent({ 
        event_name: 'lead_form_started', 
        metadata: { first_field: 'phone' } 
      });
    }

    if (value.length === 0) {
      setFormData({ ...formData, phone: '' });
      return;
    }

    if (value.length < 4 && formData.phone.length >= 4) {
      setFormData({ ...formData, phone: '' });
      return;
    }
    
    let cleaned = value.replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+48')) {
      cleaned = '+48' + cleaned.replace(/^\+?48?/, '');
    }
    
    let digits = cleaned.substring(3).replace(/\D/g, '').substring(0, 9);
    let formatted = '+48';
    
    if (digits.length > 0) formatted += ' ' + digits.substring(0, 3);
    if (digits.length > 3) formatted += ' ' + digits.substring(3, 6);
    if (digits.length > 6) formatted += ' ' + digits.substring(6, 9);
    
    setFormData({ ...formData, phone: formatted });
  };
  return (
    <section id={id || 'contact'} className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-blue/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:items-center">
          
          {/* Left Side: Copy & Benefits */}
          <div className="lg:w-1/2">
            <h2 className="text-4xl lg:text-6xl text-brand-navy leading-[1.1] mb-8">
              Zacznij odzyskiwać należności <span className="text-brand-blue">szybciej i skuteczniej</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-xl">
              Daj nam szansę pokazać, jak połączenie automatyzacji i wiedzy prawniczej może poprawić płynność finansową Twojej firmy.
            </p>

            <div className="space-y-6">
              {[
                "Darmowa analiza portfela wierzytelności",
                "Dostęp do platformy w modelu Success Fee",
                "Wsparcie dedykowanego opiekuna i prawnika"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                    <Verified size={20} className="fill-brand-blue text-white" />
                  </div>
                  <span className="text-lg font-bold text-brand-navy">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Form Card */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-[var(--radius-brand-card)] shadow-2xl shadow-slate-200 border border-slate-100 p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-brand-blue"></div>
              
              {!isSuccess && (
                <h3 className="text-2xl font-black text-brand-navy mb-8">Zapytaj o ofertę dla Twojej firmy</h3>
              )}
              
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center text-center py-8 animate-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-100">
                    <CheckCircle2 size={32} strokeWidth={3} />
                  </div>
                  <h4 className="text-2xl font-black text-brand-navy mb-4">Dziękujemy za zapytanie!</h4>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                    Otrzymaliśmy Twoje zgłoszenie. Nasz ekspert skontaktuje się z Tobą wkrótce, aby omówić szczegóły i przedstawić ofertę.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)} 
                    className="mt-8 text-brand-blue font-bold hover:underline transition-all"
                  >
                    Wyślij kolejne zapytanie
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Honeypot field - hidden from users, filled by bots */}
                  <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                    <input 
                      type="text" 
                      name="bot_check_field" 
                      tabIndex={-1} 
                      autoComplete="new-password" 
                      value={formData.bot_check_field} 
                      onChange={handleChange} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <FormLabel>Imię i nazwisko</FormLabel>
                    <FormInput 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jan Kowalski"
                      required
                      className={formData.name ? 'bg-white' : 'bg-slate-50'}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <FormLabel>Email służbowy</FormLabel>
                    <FormInput 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jan@firma.pl"
                      required
                      className={formData.email ? 'bg-white' : 'bg-slate-50'}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <FormLabel>Numer telefonu (opcjonalnie)</FormLabel>
                  <FormInput 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="+48 000 000 000"
                    className={formData.phone ? 'bg-white' : 'bg-slate-50'}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <FormLabel>Nazwa firmy</FormLabel>
                  <FormInput 
                    type="text" 
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Twoja Firma Sp. z o.o."
                    className={formData.company ? 'bg-white' : 'bg-slate-50'}
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-[var(--radius-brand-button)] flex items-start gap-3 text-sm font-medium animate-in fade-in duration-300">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <FormButton 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-6 text-xl shadow-brand-navy/20 mt-4 bg-brand-navy hover:bg-brand-blue transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      <span>Wysyłanie...</span>
                    </>
                  ) : (
                    "Wyślij zgłoszenie"
                  )}
                </FormButton>

                <p className="text-[11px] text-center text-slate-500 leading-relaxed pt-4">
                  Dane podane w formularzu będą przetwarzane przez Kancelarię Prawną RPMS z siedzibą w Poznaniu wyłącznie w celu realizacji zgłoszenia oraz według zasad zawartych w <a href="/polityka-prywatnosci" className="underline hover:text-brand-blue">Polityce prywatności</a>.
                </p>
              </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LeadForm;

