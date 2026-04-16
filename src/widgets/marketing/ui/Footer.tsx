import React from 'react';
import { ShieldCheck, Facebook, Linkedin, Twitter, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { Footer as FooterType, Page } from '../../../views/dashboard/types/cms';
import Link from 'next/link';

interface FooterProps {
  onNavigate?: (view: 'HOME' | 'BLOG' | 'FAQ') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const { siteContent } = useAppContext();
  
  const footerData: FooterType | undefined = siteContent?.footer;
  const pages: Page[] = siteContent?.pages || [];

  const handleLinkClick = (e: React.MouseEvent, view: 'HOME' | 'BLOG' | 'FAQ') => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(view);
    }
  };

  const handleDynamicLinkClick = (e: React.MouseEvent, url: string) => {
    if (url.startsWith('#')) {
      e.preventDefault();
      onNavigate?.('HOME');
      setTimeout(() => {
        document.querySelector(url)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer className="bg-slate-50 pt-24 pb-12 border-t border-slate-200">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Kolumna 1: Brand */}
          <div className="space-y-8">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => onNavigate?.('HOME')}
            >
              <div className="w-10 h-10 bg-brand-navy rounded-[var(--radius-brand-button)] flex items-center justify-center text-white shadow-lg">
                <ShieldCheck size={24} />
              </div>
              <span className="text-2xl font-black text-brand-navy tracking-tighter italic">Windykacja <span className="text-brand-blue">RPMS</span></span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">
              {footerData?.brandDescription || 'Nowoczesna kancelaria prawna specjalizująca się w twardej windykacji B2B. Łączymy tradycyjne wartości prawnicze z technologią przyszłości.'}
            </p>
            <div className="flex gap-4">
              {(siteContent?.companyInfo?.socials?.linkedin || footerData?.socialMedia?.linkedin) && (
                <a href={siteContent?.companyInfo?.socials?.linkedin || footerData?.socialMedia?.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-slate-200 rounded-[var(--radius-brand-button)] flex items-center justify-center text-slate-400 hover:text-brand-blue hover:border-brand-blue transition-all shadow-sm">
                  <Linkedin size={20} />
                </a>
              )}
              {(siteContent?.companyInfo?.socials?.facebook || footerData?.socialMedia?.facebook) && (
                <a href={siteContent?.companyInfo?.socials?.facebook || footerData?.socialMedia?.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-slate-200 rounded-[var(--radius-brand-button)] flex items-center justify-center text-slate-400 hover:text-brand-blue hover:border-brand-blue transition-all shadow-sm">
                  <Facebook size={20} />
                </a>
              )}
              {(siteContent?.companyInfo?.socials?.twitter || footerData?.socialMedia?.twitter) && (
                <a href={siteContent?.companyInfo?.socials?.twitter || footerData?.socialMedia?.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-slate-200 rounded-[var(--radius-brand-button)] flex items-center justify-center text-slate-400 hover:text-brand-blue hover:border-brand-blue transition-all shadow-sm">
                  <Twitter size={20} />
                </a>
              )}
              {(!siteContent?.companyInfo?.socials?.linkedin && !footerData?.socialMedia?.linkedin && 
                !siteContent?.companyInfo?.socials?.facebook && !footerData?.socialMedia?.facebook && 
                !siteContent?.companyInfo?.socials?.twitter && !footerData?.socialMedia?.twitter) && (
                <>
                  <a href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-[var(--radius-brand-button)] flex items-center justify-center text-slate-400 hover:text-brand-blue hover:border-brand-blue transition-all shadow-sm">
                    <Linkedin size={20} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-[var(--radius-brand-button)] flex items-center justify-center text-slate-400 hover:text-brand-blue hover:border-brand-blue transition-all shadow-sm">
                    <Facebook size={20} />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Dynamiczne Kolumny */}
          {footerData?.columns?.map((col) => (
            <div key={col.id}>
              <h4 className="text-sm font-black text-brand-navy uppercase tracking-[0.2em] mb-8">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.id}>
                    {link.isExternal ? (
                      <a 
                        href={link.url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-brand-blue font-medium transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-brand-blue transition-colors"></span>
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        href={link.url} 
                        onClick={(e) => handleDynamicLinkClick(e, link.url)}
                        className="text-slate-500 hover:text-brand-blue font-medium transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-brand-blue transition-colors"></span>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Fallback jeśli brak kolumn */}
          {(!footerData?.columns || footerData.columns.length === 0) && (
            <>
              {/* Kolumna 2: Usługi */}
              <div>
                <h4 className="text-sm font-black text-brand-navy uppercase tracking-[0.2em] mb-8">Usługi RPMS</h4>
                <ul className="space-y-4">
                  {['Windykacja Polubowna', 'Windykacja Sądowa (EPU)', 'Nadzór Komorniczy', 'Wywiad Gospodarczy', 'Monitoring Płatności'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-slate-500 hover:text-brand-blue font-medium transition-colors flex items-center gap-2 group">
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-brand-blue transition-colors"></span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kolumna 3: Firma */}
              <div>
                <h4 className="text-sm font-black text-brand-navy uppercase tracking-[0.2em] mb-8">O Kancelarii</h4>
                <ul className="space-y-4">
                  {['O nas', 'Zespół prawny', 'Baza wiedzy', 'FAQ', 'Kontakt'].map((item) => (
                    <li key={item}>
                      <a 
                        href={item === 'Baza wiedzy' ? '/blog' : item === 'FAQ' ? '/faq' : '#'} 
                        onClick={(e) => {
                          if (item === 'Baza wiedzy') handleLinkClick(e, 'BLOG');
                          else if (item === 'FAQ') handleLinkClick(e, 'FAQ');
                          else if (item === 'O nas' || item === 'Kontakt') {
                            e.preventDefault();
                            onNavigate?.('HOME');
                            setTimeout(() => {
                              const id = item === 'O nas' ? '#why_us' : '#lead_form';
                              document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }
                        }}
                        className="text-slate-500 hover:text-brand-blue font-medium transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-brand-blue transition-colors"></span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Kolumna 4: Kontakt (Zawsze widoczna) */}
          <div>
            <h4 className="text-sm font-black text-brand-navy uppercase tracking-[0.2em] mb-8">Kontakt bezpośredni</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue shrink-0 shadow-sm">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Infolinia RPMS</p>
                  <a href={`tel:${(siteContent?.companyInfo?.phone || siteContent?.contactBar?.phone || '+48 61 222 44 44').replace(/\s+/g, '')}`} className="text-brand-navy font-black hover:text-brand-blue transition-colors">{siteContent?.companyInfo?.phone || siteContent?.contactBar?.phone || '+48 61 222 44 44'}</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue shrink-0 shadow-sm">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">E-mail</p>
                  <a href={`mailto:${siteContent?.companyInfo?.email || siteContent?.contactBar?.email || 'biuro@rpms.pl'}`} className="text-brand-navy font-black hover:text-brand-blue transition-colors">{siteContent?.companyInfo?.email || siteContent?.contactBar?.email || 'biuro@rpms.pl'}</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-[var(--radius-brand-button)] flex items-center justify-center text-brand-blue shrink-0 shadow-sm">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Siedziba główna</p>
                  <p className="text-brand-navy font-black">{siteContent?.companyInfo?.address || footerData?.address || 'ul. Poznańska 12, Poznań'}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Dolny pasek */}
        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center md:justify-start gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            {footerData?.bottomBarLinks && footerData.bottomBarLinks.length > 0 ? (
              footerData.bottomBarLinks.map((link) => (
                link.isExternal ? (
                  <a 
                    key={link.id}
                    href={link.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-navy transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link 
                    key={link.id}
                    href={link.url} 
                    onClick={(e) => handleDynamicLinkClick(e, link.url)}
                    className="hover:text-brand-navy transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              ))
            ) : (
              <>
                <a href="#" className="hover:text-brand-navy transition-colors">Polityka Prywatności</a>
                <a href="#" className="hover:text-brand-navy transition-colors">Regulamin Serwisu</a>
                <a href="#" className="hover:text-brand-navy transition-colors">Cookies</a>
              </>
            )}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center md:text-left">
            © {currentYear} {siteContent?.companyInfo?.copyrightName || footerData?.copyrightText || 'Windykacja RPMS - Kancelaria Prawna. Wszystkie prawa zastrzeżone.'}
          </p>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-[var(--radius-brand-button)] shadow-sm">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-[10px] font-black text-brand-navy uppercase tracking-widest">Systemy RPMS Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
