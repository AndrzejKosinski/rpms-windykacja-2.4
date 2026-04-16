import React from 'react';
import { Plus, Trash2, Link as LinkIcon, Settings, Layout } from 'lucide-react';
import { Footer, FooterColumn, FooterLink } from '../../types/cms';

interface FooterEditorSectionProps {
  data?: Footer;
  onChange: (field: string, value: any) => void;
  pages?: any[];
}

const defaultFooter: Footer = {
  columns: [
    {
      id: 'col_1',
      title: 'Usługi RPMS',
      links: [
        { id: 'link_1_1', label: 'Windykacja Polubowna', url: '#', isExternal: false },
        { id: 'link_1_2', label: 'Windykacja Sądowa (EPU)', url: '#', isExternal: false },
        { id: 'link_1_3', label: 'Nadzór Komorniczy', url: '#', isExternal: false },
        { id: 'link_1_4', label: 'Wywiad Gospodarczy', url: '#', isExternal: false },
        { id: 'link_1_5', label: 'Monitoring Płatności', url: '#', isExternal: false }
      ]
    },
    {
      id: 'col_2',
      title: 'O Kancelarii',
      links: [
        { id: 'link_2_1', label: 'O nas', url: '#why_us', isExternal: false },
        { id: 'link_2_2', label: 'Zespół prawny', url: '#', isExternal: false },
        { id: 'link_2_3', label: 'Baza wiedzy', url: '/blog', isExternal: false },
        { id: 'link_2_4', label: 'FAQ', url: '/faq', isExternal: false },
        { id: 'link_2_5', label: 'Kontakt', url: '#lead_form', isExternal: false }
      ]
    }
  ],
  socialMedia: {
    linkedin: '',
    facebook: '',
    twitter: ''
  },
  brandDescription: 'Nowoczesna kancelaria prawna specjalizująca się w twardej windykacji B2B. Łączymy tradycyjne wartości prawnicze z technologią przyszłości.',
  copyrightText: 'Windykacja RPMS - Kancelaria Prawna. Wszystkie prawa zastrzeżone.',
  address: 'ul. Poznańska 12, Poznań',
  bottomBarLinks: []
};

export const FooterEditorSection: React.FC<FooterEditorSectionProps> = ({
  data = defaultFooter,
  onChange,
  pages = []
}) => {
  const handleAddColumn = () => {
    const newColumns = [...(data.columns || [])];
    newColumns.push({
      id: `col_${Date.now()}`,
      title: 'Nowa Kolumna',
      links: []
    });
    onChange('columns', newColumns);
  };

  const handleDeleteColumn = (colIdx: number) => {
    const newColumns = [...(data.columns || [])];
    newColumns.splice(colIdx, 1);
    onChange('columns', newColumns);
  };

  const handleColumnTitleChange = (colIdx: number, title: string) => {
    const newColumns = [...(data.columns || [])];
    newColumns[colIdx].title = title;
    onChange('columns', newColumns);
  };

  const handleAddLink = (colIdx: number) => {
    const newColumns = [...(data.columns || [])];
    newColumns[colIdx].links.push({
      id: `link_${Date.now()}`,
      label: 'Nowy Link',
      url: '#',
      isExternal: false
    });
    onChange('columns', newColumns);
  };

  const handleDeleteLink = (colIdx: number, linkIdx: number) => {
    const newColumns = [...(data.columns || [])];
    newColumns[colIdx].links.splice(linkIdx, 1);
    onChange('columns', newColumns);
  };

  const handleLinkChange = (colIdx: number, linkIdx: number, field: keyof FooterLink, value: any) => {
    const newColumns = [...(data.columns || [])];
    newColumns[colIdx].links[linkIdx] = {
      ...newColumns[colIdx].links[linkIdx],
      [field]: value
    };
    onChange('columns', newColumns);
  };

  const handleSocialChange = (platform: string, url: string) => {
    onChange('socialMedia', {
      ...(data.socialMedia || {}),
      [platform]: url
    });
  };

  const handleAddBottomLink = () => {
    const newLinks = [...(data.bottomBarLinks || [])];
    newLinks.push({
      id: `bottom_${Date.now()}`,
      label: 'Nowy Link',
      url: '#',
      isExternal: false
    });
    onChange('bottomBarLinks', newLinks);
  };

  const handleDeleteBottomLink = (idx: number) => {
    const newLinks = [...(data.bottomBarLinks || [])];
    newLinks.splice(idx, 1);
    onChange('bottomBarLinks', newLinks);
  };

  const handleBottomLinkChange = (idx: number, field: keyof FooterLink, value: any) => {
    const newLinks = [...(data.bottomBarLinks || [])];
    newLinks[idx] = {
      ...newLinks[idx],
      [field]: value
    };
    onChange('bottomBarLinks', newLinks);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-1">Edytor Stopki (Footer)</h2>
          <p className="text-slate-400">Zarządzaj kolumnami, linkami i mediami społecznościowymi.</p>
        </div>
        <button 
          onClick={handleAddColumn}
          className="px-6 py-3 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black flex items-center gap-2 hover:bg-brand-blue/90 transition-all shadow-xl shadow-brand-blue/20"
        >
          <Plus size={20} />
          Dodaj Kolumnę
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolumny z linkami */}
        <div className="lg:col-span-2 space-y-6">
          {(data.columns || []).map((col, colIdx) => (
            <div key={col.id} className="bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-card)] p-6 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Tytuł Kolumny</label>
                  <input
                    type="text"
                    value={col.title}
                    onChange={(e) => handleColumnTitleChange(colIdx, e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-[var(--radius-brand-button)] py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue transition-colors font-bold"
                  />
                </div>
                <button 
                  onClick={() => handleDeleteColumn(colIdx)}
                  className="mt-5 p-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-[var(--radius-brand-button)] transition-colors"
                  title="Usuń kolumnę"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Linki w kolumnie</label>
                  <button 
                    onClick={() => handleAddLink(colIdx)}
                    className="text-xs font-bold text-brand-blue hover:text-brand-blue/80 flex items-center gap-1"
                  >
                    <Plus size={14} /> Dodaj link
                  </button>
                </div>

                {col.links.map((link, linkIdx) => (
                  <div key={link.id} className="flex flex-col md:flex-row items-start md:items-center gap-3 bg-slate-800/50 p-3 rounded-[var(--radius-brand-button)] border border-slate-700/50">
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => handleLinkChange(colIdx, linkIdx, 'label', e.target.value)}
                        placeholder="Etykieta linku"
                        className="w-full bg-slate-800 border border-slate-700 rounded-[var(--radius-brand-button)] py-2 px-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-colors"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <select
                        value={link.pageId || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) {
                            const page = pages.find(p => p.id === val);
                            handleLinkChange(colIdx, linkIdx, 'pageId', val);
                            handleLinkChange(colIdx, linkIdx, 'url', `/${page?.slug}`);
                          } else {
                            handleLinkChange(colIdx, linkIdx, 'pageId', undefined);
                          }
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-[var(--radius-brand-button)] py-2 px-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-colors"
                      >
                        <option value="">-- Zewnętrzny URL / Inny --</option>
                        {pages.map(p => (
                          <option key={p.id} value={p.id}>{p.title} (/{p.slug})</option>
                        ))}
                      </select>
                    </div>
                    {!link.pageId && (
                      <div className="flex-1 w-full">
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleLinkChange(colIdx, linkIdx, 'url', e.target.value)}
                          placeholder="Adres URL (np. /kontakt lub https://...)"
                          className="w-full bg-slate-800 border border-slate-700 rounded-[var(--radius-brand-button)] py-2 px-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-colors font-mono"
                        />
                      </div>
                    )}
                    <button 
                      onClick={() => handleDeleteLink(colIdx, linkIdx)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-[var(--radius-brand-button)] transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {col.links.length === 0 && (
                  <p className="text-xs text-slate-500 italic py-2">Brak linków w tej kolumnie.</p>
                )}
              </div>
            </div>
          ))}

          {(data.columns || []).length === 0 && (
            <div className="text-center py-12 bg-slate-900/50 rounded-[var(--radius-brand-card)] border border-slate-800 border-dashed">
              <p className="text-slate-500 font-medium">Nie masz jeszcze żadnych kolumn w stopce.</p>
            </div>
          )}
        </div>

        {/* General Settings */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-card)] p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Settings size={20} className="text-brand-blue" />
              Ustawienia Ogólne
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Opis Firmy (pod logo)</label>
                <textarea
                  value={data.brandDescription || ''}
                  onChange={(e) => onChange('brandDescription', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-[var(--radius-brand-button)] py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue transition-colors text-sm min-h-[100px] resize-y"
                  placeholder="Krótki opis firmy..."
                />
              </div>
            </div>

            <div className="p-6 bg-brand-blue/5 border border-brand-blue/10 rounded-[var(--radius-brand-button)] space-y-4">
              <div className="flex items-center gap-3 text-brand-blue">
                <Layout size={20} />
                <h4 className="font-bold">Dane Centralne</h4>
              </div>
              <p className="text-xs text-brand-blue/80 leading-relaxed">
                Adres siedziby, linki do mediów społecznościowych oraz nazwa do copyright są teraz zarządzane centralnie w sekcji <strong>Ustawienia Firmy</strong>.
              </p>
            </div>
          </div>

          {/* Bottom Bar Links Settings */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-card)] p-8 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layout size={20} className="text-brand-blue" />
                Dolny Pasek (Bottom Bar)
              </h3>
              <button 
                onClick={handleAddBottomLink}
                className="text-xs font-bold text-brand-blue hover:text-brand-blue/80 flex items-center gap-1"
              >
                <Plus size={14} /> Dodaj link
              </button>
            </div>

            <div className="space-y-4">
              {(data.bottomBarLinks || []).map((link, idx) => (
                <div key={link.id} className="space-y-3 bg-slate-800/30 p-4 rounded-[var(--radius-brand-button)] border border-slate-700/50">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => handleBottomLinkChange(idx, 'label', e.target.value)}
                      placeholder="Etykieta linku"
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-[var(--radius-brand-button)] py-2 px-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-colors"
                    />
                    <button 
                      onClick={() => handleDeleteBottomLink(idx)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-[var(--radius-brand-button)] transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <select
                      value={link.pageId || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          const page = pages.find(p => p.id === val);
                          handleBottomLinkChange(idx, 'pageId', val);
                          handleBottomLinkChange(idx, 'url', `/${page?.slug}`);
                        } else {
                          handleBottomLinkChange(idx, 'pageId', undefined);
                        }
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-[var(--radius-brand-button)] py-2 px-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-colors"
                    >
                      <option value="">-- Zewnętrzny URL / Inny --</option>
                      {pages.map(p => (
                        <option key={p.id} value={p.id}>{p.title} (/{p.slug})</option>
                      ))}
                    </select>
                    
                    {!link.pageId && (
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleBottomLinkChange(idx, 'url', e.target.value)}
                        placeholder="Adres URL (np. /kontakt lub https://...)"
                        className="w-full bg-slate-800 border border-slate-700 rounded-[var(--radius-brand-button)] py-2 px-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-colors font-mono"
                      />
                    )}
                  </div>
                </div>
              ))}
              
              {(data.bottomBarLinks || []).length === 0 && (
                <p className="text-center py-4 text-slate-500 text-sm italic border border-slate-800 border-dashed rounded-[var(--radius-brand-button)]">
                  Brak linków w dolnym pasku.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
