import React, { useState, useEffect } from 'react';
import { Palette, Type, Square, LayoutTemplate, Save, RefreshCw, CheckCircle2 } from 'lucide-react';
import initialTheme from '../../../shared/config/theme.json';
import { ddsService } from '@/shared/api/apiClientFactory';
import { ThemeConfig } from '../../../shared/types/theme';

export default function DDSManager() {
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme as ThemeConfig);
  const [activeTab, setActiveTab] = useState('forms');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await ddsService.getThemeConfig();
        if (config && Object.keys(config).length > 0) {
          // Deep merge with initialTheme to ensure all properties exist
          setTheme(prev => ({
            ...prev,
            ...config,
            forms: {
              labels: { ...prev.forms?.labels, ...config.forms?.labels },
              inputs: { ...prev.forms?.inputs, ...config.forms?.inputs }
            },
            buttons: {
              primary: { ...prev.buttons?.primary, ...config.buttons?.primary }
            },
            typography: {
              headers: { ...prev.typography?.headers, ...config.typography?.headers },
              body: { ...prev.typography?.body, ...config.typography?.body }
            },
            colors: {
              brand: { ...prev.colors?.brand, ...config.colors?.brand },
              surface: { ...prev.colors?.surface, ...config.colors?.surface }
            }
          }));
        }
      } catch (error) {
        console.error('Błąd pobierania konfiguracji DDS:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await ddsService.updateThemeConfig(theme);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Błąd zapisu:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateNestedState = (path: string[], value: string) => {
    setTheme(prev => {
      const newState = { ...prev };
      let current: any = newState;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newState;
    });
  };

  const renderInput = (label: string, path: string[], type: string = 'text', placeholder: string = '') => {
    let value = theme as any;
    for (const key of path) {
      if (value) value = value[key];
    }
    value = value || '';

    return (
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
        <input
          type={type}
          value={value}
          onChange={(e) => updateNestedState(path, e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-[var(--radius-brand-button)] text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all font-mono text-sm"
        />
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-[var(--radius-brand-button)] flex items-center justify-center">
              <Palette size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">Dynamic Design System (DDS)</h3>
              <p className="text-slate-400 text-sm">Zarządzaj globalnymi stylami, typografią i komponentami.</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-3 rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 ${
              saveStatus === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
              saveStatus === 'error' ? 'bg-red-500 text-white shadow-red-500/20' :
              'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-brand-blue/20'
            }`}
          >
            {isSaving ? <RefreshCw size={16} className="animate-spin" /> :
             saveStatus === 'success' ? <CheckCircle2 size={16} /> :
             <Save size={16} />}
            {isSaving ? 'Zapisywanie...' :
             saveStatus === 'success' ? 'Zapisano!' :
             'Zapisz zmiany'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-800 pb-4 overflow-x-auto">
          {[
            { id: 'forms', label: 'Formularze', icon: <Square size={16} /> },
            { id: 'buttons', label: 'Przyciski', icon: <LayoutTemplate size={16} /> },
            { id: 'shapes', label: 'Kształty', icon: <Square size={16} /> },
            { id: 'typography', label: 'Typografia', icon: <Type size={16} /> },
            { id: 'colors', label: 'Kolory', icon: <Palette size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-[var(--radius-brand-button)] font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-8">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <RefreshCw size={48} className="text-brand-blue animate-spin mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Ładowanie konfiguracji z bazy...</p>
            </div>
          ) : activeTab === 'forms' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Etykiety */}
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-button)] space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Type className="text-brand-blue" size={20} />
                  <h4 className="text-lg font-black text-white">Etykiety (Labels)</h4>
                </div>
                <div className="space-y-4">
                  {renderInput('Rozmiar czcionki (np. 11px, 0.875rem)', ['forms', 'labels', 'fontSize'])}
                  {renderInput('Grubość czcionki (np. 400, 800, bold)', ['forms', 'labels', 'fontWeight'])}
                  {renderInput('Transformacja tekstu (np. uppercase, none)', ['forms', 'labels', 'textTransform'])}
                  {renderInput('Odstępy między literami (np. 0.025em, normal)', ['forms', 'labels', 'letterSpacing'])}
                  {renderInput('Kolor (np. #64748b, rgba(0,0,0,0.5))', ['forms', 'labels', 'color'])}
                </div>
              </div>

              {/* Pola tekstowe */}
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-button)] space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Square className="text-brand-blue" size={20} />
                  <h4 className="text-lg font-black text-white">Pola tekstowe (Inputs)</h4>
                </div>
                <div className="space-y-4">
                  {renderInput('Zaokrąglenie rogów (np. 12px) [Tailwind: --radius-brand-input]', ['forms', 'inputs', 'borderRadius'])}
                  {renderInput('Grubość obramowania (np. 1px, 2px)', ['forms', 'inputs', 'borderWidth'])}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'buttons' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Przyciski Główne */}
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-button)] space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <LayoutTemplate className="text-brand-blue" size={20} />
                  <h4 className="text-lg font-black text-white">Przyciski Główne (Primary)</h4>
                </div>
                <div className="space-y-4">
                  {renderInput('Zaokrąglenie rogów (np. 12px, 9999px) [Tailwind: --radius-brand-button]', ['buttons', 'primary', 'borderRadius'])}
                  {renderInput('Transformacja tekstu (np. uppercase, none)', ['buttons', 'primary', 'textTransform'])}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shapes' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Karty i Kontenery */}
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-button)] space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Square className="text-brand-blue" size={20} />
                  <h4 className="text-lg font-black text-white">Karty i Kontenery (Cards)</h4>
                </div>
                <div className="space-y-4">
                  {renderInput('Zaokrąglenie główne (np. 24px, 40px) [Tailwind: --radius-brand-card]', ['cards', 'borderRadius'])}
                </div>
              </div>

              {/* Szybki przegląd geometrii */}
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-button)] space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <RefreshCw className="text-brand-blue" size={20} />
                  <h4 className="text-lg font-black text-white">Pozostałe zaokrąglenia</h4>
                </div>
                <div className="space-y-4">
                  {renderInput('Zaokrąglenie przycisków', ['buttons', 'primary', 'borderRadius'])}
                  {renderInput('Zaokrąglenie pól formularzy', ['forms', 'inputs', 'borderRadius'])}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Nagłówki */}
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-button)] space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Type className="text-brand-blue" size={20} />
                  <h4 className="text-lg font-black text-white">Nagłówki (Headers)</h4>
                </div>
                <div className="space-y-4">
                  {renderInput('Font Family (np. Inter, sans-serif)', ['typography', 'headers', 'fontFamily'])}
                  {renderInput('Grubość czcionki H1 (np. 900, black)', ['typography', 'headers', 'h1Weight'])}
                  {renderInput('Grubość czcionki H2 (np. 800, extrabold)', ['typography', 'headers', 'h2Weight'])}
                  {renderInput('Kolor domyślny (np. #0f172a)', ['typography', 'headers', 'color'])}
                </div>
              </div>

              {/* Tekst główny */}
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-button)] space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Type className="text-brand-blue" size={20} />
                  <h4 className="text-lg font-black text-white">Tekst Główny (Body)</h4>
                </div>
                <div className="space-y-4">
                  {renderInput('Font Family (np. Inter, sans-serif)', ['typography', 'body', 'fontFamily'])}
                  {renderInput('Rozmiar bazowy (np. 16px, 1rem)', ['typography', 'body', 'fontSize'])}
                  {renderInput('Wysokość linii (np. 1.5, relaxed)', ['typography', 'body', 'lineHeight'])}
                  {renderInput('Kolor domyślny (np. #64748b)', ['typography', 'body', 'color'])}
                </div>
              </div>

              {/* Tekst w formularzach */}
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-button)] space-y-6 lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Type className="text-brand-blue" size={20} />
                  <h4 className="text-lg font-black text-white">Tekst w formularzach (Inputs)</h4>
                </div>
                <div className="space-y-4">
                  {renderInput('Grubość czcionki wpisywanego tekstu (np. 400, 700, 900)', ['forms', 'inputs', 'fontWeight'])}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Paleta Główna */}
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-button)] space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Palette className="text-brand-blue" size={20} />
                  <h4 className="text-lg font-black text-white">Paleta Główna (Brand)</h4>
                </div>
                <div className="space-y-4">
                  {renderInput('Primary / Brand Blue (np. #2563eb)', ['colors', 'brand', 'primary'])}
                  {renderInput('Secondary / Brand Navy (np. #0f172a)', ['colors', 'brand', 'secondary'])}
                  {renderInput('Accent (np. #38bdf8)', ['colors', 'brand', 'accent'])}
                </div>
              </div>

              {/* Tła i Powierzchnie */}
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[var(--radius-brand-button)] space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Square className="text-brand-blue" size={20} />
                  <h4 className="text-lg font-black text-white">Tła i Powierzchnie (Surfaces)</h4>
                </div>
                <div className="space-y-4">
                  {renderInput('Tło strony (np. #f8fafc)', ['colors', 'surface', 'background'])}
                  {renderInput('Tło kart/paneli (np. #ffffff)', ['colors', 'surface', 'card'])}
                  {renderInput('Obramowania (np. #e2e8f0)', ['colors', 'surface', 'border'])}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
