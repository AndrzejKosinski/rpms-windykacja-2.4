import React from 'react';
import { Building2, Phone, Mail, MapPin, Linkedin, Facebook, Twitter, ShieldCheck } from 'lucide-react';
import { CompanyInfo } from '../../types/cms';

interface CompanyInfoSectionProps {
  data: CompanyInfo | undefined;
  onChange: (field: string, value: any, subfield?: string) => void;
}

export const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({ data, onChange }) => {
  const companyData = {
    phone: data?.phone || '',
    email: data?.email || '',
    address: data?.address || '',
    socials: data?.socials || {},
    copyrightName: data?.copyrightName || ''
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-brand-blue/10 rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue">
          <Building2 size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">Ustawienia Firmy</h3>
          <p className="text-slate-500 font-medium">Zarządzaj globalnymi danymi kontaktowymi i tożsamością marki.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kontakt i Adres */}
        <div className="bg-[#0f172a] rounded-[var(--radius-brand-card)] border border-slate-800 p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-brand-blue" size={20} />
            <h4 className="text-lg font-bold text-white">Dane Podstawowe</h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Numer Telefonu</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text"
                  value={companyData.phone}
                  onChange={(e) => onChange('phone', e.target.value)}
                  placeholder="+48 000 000 000"
                  className="w-full bg-slate-900 border border-slate-800 rounded-[var(--radius-brand-button)] py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Adres E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email"
                  value={companyData.email}
                  onChange={(e) => onChange('email', e.target.value)}
                  placeholder="biuro@kancelaria.pl"
                  className="w-full bg-slate-900 border border-slate-800 rounded-[var(--radius-brand-button)] py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Adres Siedziby</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text"
                  value={companyData.address}
                  onChange={(e) => onChange('address', e.target.value)}
                  placeholder="ul. Przykładowa 1, 00-000 Miasto"
                  className="w-full bg-slate-900 border border-slate-800 rounded-[var(--radius-brand-button)] py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Nazwa do Copyright (Stopka)</label>
              <input 
                type="text"
                value={companyData.copyrightName}
                onChange={(e) => onChange('copyrightName', e.target.value)}
                placeholder="Windykacja RPMS - Kancelaria Prawna"
                className="w-full bg-slate-900 border border-slate-800 rounded-[var(--radius-brand-button)] py-4 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue transition-all"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-[#0f172a] rounded-[var(--radius-brand-card)] border border-slate-800 p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Linkedin className="text-brand-blue" size={20} />
            <h4 className="text-lg font-bold text-white">Media Społecznościowe</h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">LinkedIn URL</label>
              <div className="relative">
                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text"
                  value={companyData.socials.linkedin || ''}
                  onChange={(e) => onChange('socials', e.target.value, 'linkedin')}
                  placeholder="https://linkedin.com/company/..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-[var(--radius-brand-button)] py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Facebook URL</label>
              <div className="relative">
                <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text"
                  value={companyData.socials.facebook || ''}
                  onChange={(e) => onChange('socials', e.target.value, 'facebook')}
                  placeholder="https://facebook.com/..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-[var(--radius-brand-button)] py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Twitter / X URL</label>
              <div className="relative">
                <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text"
                  value={companyData.socials.twitter || ''}
                  onChange={(e) => onChange('socials', e.target.value, 'twitter')}
                  placeholder="https://twitter.com/..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-[var(--radius-brand-button)] py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue transition-all"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-brand-blue/5 border border-brand-blue/10 rounded-[var(--radius-brand-button)]">
            <p className="text-xs text-brand-blue/80 font-medium leading-relaxed">
              <strong>Info:</strong> Te dane zostaną automatycznie zaktualizowane w nagłówku, stopce oraz we wszystkich widżetach kontaktowych na stronie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
