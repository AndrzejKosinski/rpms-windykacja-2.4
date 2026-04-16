import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, PieChart, FileText, Send, CheckCircle2, BadgeCheck } from 'lucide-react';
import { logCustomEvent } from '../../../utils/customLogger';
import { FormLabel } from '@/shared/ui/forms/FormLabel';
import { FormInput } from '@/shared/ui/forms/FormInput';
import { FormButton } from '@/shared/ui/forms/FormButton';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const [phone, setPhone] = useState('');
  const [problem, setProblem] = useState('');

  useEffect(() => {
    if (isOpen) {
      logCustomEvent({ event_name: 'consultation_modal_opened' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logCustomEvent({
      event_name: 'consultation_form_submitted',
      metadata: { amount_range: amount, phone, problem }
    });
    setSubmitted(true);
    setTimeout(onClose, 3000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-brand-navy/80 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      <div className="bg-white w-full max-w-[1000px] rounded-[var(--radius-brand-card)] shadow-[0_40px_100px_-20px_rgba(10,46,92,0.5)] relative z-10 overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-500 min-h-[600px]">
        
        {/* Sidebar - Path to Victory */}
        <div className="lg:w-1/3 bg-brand-navy p-12 text-white flex flex-col border-r border-white/5">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-brand-blue rounded-[var(--radius-brand-button)] flex items-center justify-center">
               <BadgeCheck size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter">Audyt Ekspercki</span>
          </div>

          <h3 className="text-2xl font-black mb-8 leading-tight text-text-inverse">Tak odzyskamy Twoje środki:</h3>

          <div className="space-y-12 relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-white/10"></div>
            
            {[
              { icon: <FileText size={18} />, title: "Analiza dokumentacji", desc: "Sprawdzamy poprawność faktur i dowodów wykonania." },
              { icon: <PieChart size={18} />, title: "Ocena wypłacalności", desc: "Weryfikujemy majątek dłużnika w bazach big-data." },
              { icon: <ShieldCheck size={18} />, title: "Strategia prawna", desc: "Dobieramy najskuteczniejszy tryb (EPU vs Cywilny)." }
            ].map((step, idx) => (
              <div key={idx} className="flex gap-6 relative z-10">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-brand-blue border border-white/5 backdrop-blur-md">
                  {step.icon}
                </div>
                <div>
                  <h4 className="font-black text-sm mb-1 text-text-inverse">{step.title}</h4>
                  <p className="text-xs text-text-inverse opacity-70 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-12 border-t border-white/5">
            <div className="flex items-center gap-4 text-brand-blue">
              <div className="w-2 h-2 bg-brand-blue rounded-full animate-ping"></div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em]">Ekspert dostępny teraz</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="lg:w-2/3 p-10 lg:p-16 relative flex flex-col justify-center">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-3 text-slate-400 hover:bg-slate-50 hover:text-brand-navy rounded-full transition-all"
          >
            <X size={24} />
          </button>

          {!submitted ? (
            <>
              <div className="mb-10">
                <div className="inline-block px-4 py-1.5 bg-brand-light-blue text-brand-blue text-[11px] font-black uppercase tracking-[0.2em] rounded-full mb-4">
                  Konsultacja Niestandardowa
                </div>
                <h2 className="text-4xl font-black text-brand-navy mb-4">Opisz swoją sytuację</h2>
                <p className="text-slate-500 font-medium">Przygotujemy dla Ciebie darmową, wstępną analizę prawną i operacyjną.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <FormLabel className="text-slate-400">Kwota zaległości</FormLabel>
                    <select 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={`w-full px-5 py-4 border rounded-[var(--radius-brand-button)] outline-none font-bold text-brand-navy focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 shadow-sm focus:shadow-xl focus:shadow-brand-blue/5 transition-all ${
                        amount ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200'
                      } focus:bg-white`}
                    >
                      <option value="">Wybierz przedział...</option>
                      <option value="5-10k">5 000 - 10 000 PLN</option>
                      <option value="10-50k">10 000 - 50 000 PLN</option>
                      <option value="50-100k">50 000 - 100 000 PLN</option>
                      <option value="100k+">Powyżej 100 000 PLN</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <FormLabel className="text-slate-400">Numer telefonu</FormLabel>
                    <FormInput 
                      type="tel" 
                      placeholder="+48 ..." 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={phone ? 'bg-white' : 'bg-slate-50'}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <FormLabel className="text-slate-400">Z czym masz największy problem?</FormLabel>
                  <textarea 
                    placeholder="Np. Dłużnik unika kontaktu, spór o jakość wykonania usługi, brak majątku dłużnika..."
                    rows={4}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className={`w-full px-5 py-4 border rounded-[var(--radius-brand-button)] outline-none font-medium focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 shadow-sm focus:shadow-xl focus:shadow-brand-blue/5 transition-all resize-none ${
                      problem ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200'
                    } focus:bg-white`}
                    required
                  />
                </div>

                <FormButton 
                  type="submit"
                  className="py-6 text-xl"
                >
                  Poproś o analizę ekspercką <Send size={20} />
                </FormButton>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                  <ShieldCheck size={14} /> Gwarancja poufności danych firmowych
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-700">
              <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-200">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-black text-brand-navy mb-4">Wiadomość wysłana!</h2>
              <p className="text-slate-500 font-medium text-lg max-w-sm mx-auto">
                Nasz ekspert analizuje już Twoje zgłoszenie. Oddzwonimy do Ciebie w ciągu najbliższych <span className="text-brand-blue font-black underline decoration-brand-blue/20">15 minut</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;
