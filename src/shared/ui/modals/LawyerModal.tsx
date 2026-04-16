import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Send, ShieldCheck, Gavel, Scale, MessageSquare, CheckCircle2, Clock, Users2, Sparkles, Star, FileText, Search, Handshake, Phone } from 'lucide-react';
import { logCustomEvent } from '../../../utils/customLogger';
import { FormLabel } from '@/shared/ui/forms/FormLabel';
import { FormInput } from '@/shared/ui/forms/FormInput';
import { FormButton } from '@/shared/ui/forms/FormButton';

interface LawyerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LawyerModal: React.FC<LawyerModalProps> = ({ isOpen, onClose }) => {
  const [topic, setTopic] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      logCustomEvent({ event_name: 'lawyer_modal_opened' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickTopics = [
    { label: "Odzyskanie należności / windykacja faktury", placeholder: "Podaj numer faktury, kwotę oraz datę płatności. Czy dłużnik odebrał towar lub usługę?" },
    { label: "Weryfikacja dłużnika", placeholder: "Podaj NIP dłużnika. Sprawdzimy jego majątek i wiarygodność w bazach gospodarczych." },
    { label: "Analiza szans i kosztów", placeholder: "Opisz krótko sytuację. Ocenimy prawdopodobieństwo odzyskania środków i przedstawimy koszty prowadzenia sprawy." },
    { label: "Przygotowanie pozwu", placeholder: "Podaj kwotę sporu. Czy posiadasz komplet dokumentów (faktury, wezwania do zapłaty)?" },
    { label: "Negocjacje z dłużnikiem / ugoda", placeholder: "Na jakim etapie są rozmowy? Czy dłużnik deklaruje chęć spłaty w ratach?" },
    { label: "Monitoring płatności", placeholder: "Ile faktur miesięcznie wystawiasz? Jaki jest średni termin płatności w Twojej branży?" },
    { label: "Przejęcie sprawy w toku (sąd lub komornik)", placeholder: "Podaj sygnaturę akt oraz nazwę sądu lub komornika prowadzącego sprawę." },
    { label: "Inne pytanie dotyczące windykacji", placeholder: "Opisz krótko swoje pytanie lub problem prawny związany z windykacją, o którym chciałbyś porozmawiać." }
  ];

  const currentPlaceholder = quickTopics.find(t => t.label === topic)?.placeholder || "Dzień dobry, jestem zainteresowany/a uzyskaniem informacji /";

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = phone.length === 0 || /^\+48 \d{3} \d{3} \d{3}$/.test(phone);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow clearing the field
    if (value.length === 0) {
      setPhone('');
      return;
    }

    // If user is trying to delete the prefix, allow clearing
    if (value.length < 4 && phone.length >= 4) {
      setPhone('');
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
    
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dual-track: Log to GAS (existing)
    logCustomEvent({
      event_name: 'lawyer_form_submitted',
      user_email: email,
      metadata: { topic, name, phone, description_length: description.length }
    });

    // Dual-track: Send to new API
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'lawyer',
          data: {
            name,
            email,
            phone,
            topic,
            message: description
          }
        }),
      });
    } catch (error) {
      console.error('Failed to send contact form:', error);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setDescription('');
      setTopic('');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-navy/75 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Modal Container - Zoptymalizowana wysokość i przewijanie */}
      <div className="bg-white w-full max-w-5xl h-auto max-h-[95vh] rounded-[var(--radius-brand-card)] md:rounded-[var(--radius-brand-card)] shadow-2xl relative z-10 overflow-hidden flex flex-col lg:flex-row animate-in slide-in-from-bottom-8 duration-500 border border-slate-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-50/50 border border-slate-100 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-full transition-all z-20 shadow-sm"
        >
          <X size={20} />
        </button>
        
        {/* Left Side: Expert Profile (30% Width) */}
        <div className="lg:w-[30%] bg-slate-50 p-8 lg:p-10 flex flex-col border-r border-slate-100 shrink-0">
          <div className="relative w-24 h-24 mb-4 shrink-0 mx-auto lg:mx-0">
            <Image 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=240&h=240" 
              alt="Mec. Anna Kowalska" 
              fill
              sizes="120px"
              className="object-cover rounded-[var(--radius-brand-card)] shadow-lg border-4 border-white"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 px-2.5 py-0.5 rounded-full border-4 border-slate-50 flex items-center gap-1 shadow-md">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <span className="text-[8px] font-black text-white uppercase tracking-wider">Online</span>
            </div>
          </div>

          <div className="text-center lg:text-left mb-4">
            <h3 className="text-xl font-black text-brand-navy mb-0.5 italic">Mec. Anna Kowalska</h3>
            <p className="text-brand-blue font-bold text-[10px] uppercase tracking-wider mb-2">Senior Legal Partner</p>
            <div className="flex items-center justify-center lg:justify-start gap-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
              <span className="text-[10px] font-black text-slate-400 ml-1">4.9/5.0</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {[
              { icon: <Gavel size={14} />, text: "Specjalista ds. sporów B2B" },
              { icon: <Scale size={14} />, text: "12+ lat doświadczenia" },
              { icon: <Clock size={14} />, text: "Czas odpowiedzi: ~15 min" },
              { icon: <ShieldCheck size={14} />, text: "Tajemnica Prawna" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-white rounded-[var(--radius-brand-input)] flex items-center justify-center text-brand-navy shadow-sm group-hover:bg-brand-blue group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <p className="text-[10px] font-bold text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <ShieldCheck size={14} className="text-brand-blue" />
              </div>
              <span>100% Poufności</span>
            </div>
            <p className="text-[9px] text-slate-400 leading-relaxed">
              Dane podane w formularzu będą przetwarzane przez Kancelarię Prawną RPMS z siedzibą w Poznaniu w celu realizacji zgłoszenia oraz według zasad zawartych w <a href="/polityka-prywatnosci" className="text-brand-blue underline hover:text-brand-navy transition-colors">Polityce Prywatności</a>.
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Lead Form (70% Width) */}
        <div className="lg:w-[70%] p-6 lg:p-10 relative flex flex-col justify-center overflow-y-auto no-scrollbar">
          {!isSubmitted ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6">
                <h1 className="text-3xl md:text-5xl font-black text-brand-navy mb-2 tracking-tight leading-[1.2]">
                  Zadaj pytanie <span className="text-brand-blue">ekspertowi.</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm md:text-lg leading-relaxed mb-8">
                  Opisz swoją sprawę. Nasi prawnicy przeanalizują sytuację i doradzą Ci najlepsze rozwiązanie – bezpłatnie i bez zobowiązań.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <FormLabel className={`transition-colors ${focusedField === 'topic' ? 'text-brand-blue' : 'text-brand-navy'}`}>Czego dotyczy Twoje pytanie?</FormLabel>
                  <select 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onFocus={() => setFocusedField('topic')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`w-full px-5 py-4 border rounded-[var(--radius-brand-button)] outline-none font-bold text-sm text-brand-navy focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 shadow-sm focus:shadow-xl focus:shadow-brand-blue/5 transition-all ${
                      topic ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200'
                    } focus:bg-white`}
                  >
                    <option value="">Wybierz temat z listy...</option>
                    {quickTopics.map((t, idx) => (
                      <option key={idx} value={t.label}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <FormLabel className={`transition-colors ${focusedField === 'name' ? 'text-brand-blue' : 'text-brand-navy'}`}>Podaj imię</FormLabel>
                  <FormInput 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="np. Jan Kowalski" 
                    icon={<Users2 className={`transition-colors ${focusedField === 'name' ? 'text-brand-blue' : 'text-slate-300'}`} size={18} />}
                    className={`text-sm ${name.length > 0 ? 'bg-white' : 'bg-slate-50'}`} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <FormLabel className={`transition-colors ${focusedField === 'email' ? 'text-brand-blue' : 'text-brand-navy'}`}>Podaj adres e-mail do kontaktu</FormLabel>
                    <div className="relative">
                      <FormInput 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="np. jan.kowalski@firma.pl" 
                        icon={<FileText className={`transition-colors ${focusedField === 'email' ? 'text-brand-blue' : 'text-slate-300'}`} size={18} />}
                        className={`text-sm ${email.length > 0 ? 'bg-white' : 'bg-slate-50'}`} 
                      />
                      {isEmailValid && <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in duration-300 pointer-events-none" />}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FormLabel className={`transition-colors ${focusedField === 'phone' ? 'text-brand-blue' : 'text-brand-navy'}`}>Podaj numer telefonu (opcjonalnie)</FormLabel>
                    <div className="relative">
                      <FormInput 
                        type="tel" 
                        value={phone}
                        onChange={handlePhoneChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="+48 ___ ___ ___" 
                        pattern="^\+48 \d{3} \d{3} \d{3}$"
                        title="Wymagany format: +48 XXX XXX XXX"
                        icon={<Phone className={`transition-colors ${focusedField === 'phone' ? 'text-brand-blue' : 'text-slate-300'}`} size={18} />}
                        className={`text-sm ${phone.length > 0 ? 'bg-white' : 'bg-slate-50'}`} 
                      />
                      {isPhoneValid && phone.length > 0 && <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in duration-300 pointer-events-none" />}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <FormLabel className={`transition-colors ${focusedField === 'description' ? 'text-brand-blue' : 'text-brand-navy'}`}>Wpisz treść swojego pytania...</FormLabel>
                  <textarea 
                    placeholder={currentPlaceholder}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onFocus={() => setFocusedField('description')}
                    onBlur={() => setFocusedField(null)}
                    rows={4}
                    required
                    className={`w-full px-5 py-4 border rounded-[var(--radius-brand-button)] outline-none font-medium focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 shadow-sm focus:shadow-xl focus:shadow-brand-blue/5 transition-all resize-none ${
                      description.length > 0 ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200'
                    } focus:bg-white`}
                  />
                </div>

                <div className="pt-2">
                  <FormButton 
                    type="submit"
                    className="sm:py-5 text-base sm:text-lg shadow-brand-blue/25 active:scale-95"
                  >
                    Wyślij pytanie <Send size={20} />
                  </FormButton>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-700">
              <div className="w-16 h-16 bg-green-500 text-white rounded-[var(--radius-brand-button)] flex items-center justify-center mb-6 shadow-xl shadow-green-100">
                <CheckCircle2 size={32} strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-black text-brand-navy mb-2 italic">Zlecenie przyjęte!</h2>
              <p className="text-slate-500 font-medium text-sm max-w-xs mx-auto leading-relaxed">
                Mecenas Anna otrzymała Twoje zgłoszenie. Analiza potrwa około <span className="text-brand-blue font-black underline decoration-brand-blue/20">15 minut</span>. Oddzwonimy niezwłocznie.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyerModal;