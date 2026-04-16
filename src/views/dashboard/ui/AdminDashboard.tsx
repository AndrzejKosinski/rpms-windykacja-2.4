
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  ShieldAlert, Database, Users, Settings, FileText, 
  Search, RefreshCw, BarChart3, 
  MessageSquare, Zap, HardDrive, ShieldCheck,
  Globe, Clock, TrendingUp, Layout as LayoutIcon, Palette,
  Handshake, Building2, Mail, LayoutDashboard, PanelTop
} from 'lucide-react';

// Dynamic imports for heavy components
const CMSManager = dynamic(() => import('./CMSManager'), {
  loading: () => <div className="h-40 flex items-center justify-center bg-slate-900/50 rounded-xl animate-pulse text-slate-500 font-bold">Ładowanie CMS...</div>
});
const LayoutManager = dynamic(() => import('./LayoutManager'), {
  loading: () => <div className="h-40 flex items-center justify-center bg-slate-900/50 rounded-xl animate-pulse text-slate-500 font-bold">Ładowanie Układu...</div>
});
const PartnersManager = dynamic(() => import('./PartnersManager'), {
  loading: () => <div className="h-40 flex items-center justify-center bg-slate-900/50 rounded-xl animate-pulse text-slate-500 font-bold">Ładowanie Partnerów...</div>
});
const ActivityLogViewer = dynamic(() => import('./ActivityLogViewer'), {
  loading: () => <div className="h-40 flex items-center justify-center bg-slate-900/50 rounded-xl animate-pulse text-slate-500 font-bold">Ładowanie Logów...</div>
});
const OnboardingDashboard = dynamic(() => import('../../../features/auth/ui/OnboardingDashboard'), {
  loading: () => <div className="h-40 flex items-center justify-center bg-slate-900/50 rounded-xl animate-pulse text-slate-500 font-bold">Ładowanie Statystyk...</div>
});
const RAGManager = dynamic(() => import('./RAGManager').then(mod => mod.RAGManager), {
  loading: () => <div className="h-40 flex items-center justify-center bg-slate-900/50 rounded-xl animate-pulse text-slate-500 font-bold">Ładowanie RAG...</div>
});
const DDSManager = dynamic(() => import('./DDSManager'), {
  loading: () => <div className="h-40 flex items-center justify-center bg-slate-900/50 rounded-xl animate-pulse text-slate-500 font-bold">Ładowanie DDS...</div>
});
const TemplatesManager = dynamic(() => import('./TemplatesManager'), {
  loading: () => <div className="h-40 flex items-center justify-center bg-slate-900/50 rounded-xl animate-pulse text-slate-500 font-bold">Ładowanie Szablonów...</div>
});
const StorageManager = dynamic(() => import('./admin/StorageManager'), {
  loading: () => <div className="h-40 flex items-center justify-center bg-slate-900/50 rounded-xl animate-pulse text-slate-500 font-bold">Ładowanie Storage...</div>
});
const MigrationManager = dynamic(() => import('./cms/MigrationManager'), {
  loading: () => <div className="h-40 flex items-center justify-center bg-slate-900/50 rounded-xl animate-pulse text-slate-500 font-bold">Ładowanie Migracji...</div>
});
const AdminSidebar = dynamic(() => import('./admin/AdminSidebar').then(mod => mod.AdminSidebar), {
  loading: () => <div className="w-64 bg-slate-950 animate-pulse" />
});
const AdminHeader = dynamic(() => import('./admin/AdminHeader').then(mod => mod.AdminHeader), {
  loading: () => <div className="h-20 bg-slate-950 animate-pulse" />
});
const AdminSettingsTab = dynamic(() => import('./admin/AdminSettingsTab').then(mod => mod.AdminSettingsTab), {
  loading: () => <div className="p-10 animate-pulse text-slate-500">Ładowanie ustawień...</div>
});
const AdminModals = dynamic(() => import('./admin/AdminModals').then(mod => mod.AdminModals), {
  ssr: false
});

import { cmsService } from '@/shared/api/apiClientFactory';
import { useCMSStore } from '../store/cmsStore';
import { ComponentRegistry } from '../../../widgets/marketing/registry';

interface AdminDashboardProps {
  onLogout: () => void;
  siteContent: any;
  onUpdateContent: (newContent: any) => void;
  cmsStatus: 'READY' | 'NOT_INITIALIZED' | 'ERROR';
  onInitializeCMS: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, siteContent, onUpdateContent, cmsStatus, onInitializeCMS 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showInitModal, setShowInitModal] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const availableComponents = Object.keys(ComponentRegistry);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [componentToAdd, setComponentToAdd] = useState(availableComponents[0]);
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const cmsLogic = useCMSStore();

  React.useEffect(() => {
    if (siteContent) {
      cmsLogic.setLocalContent(siteContent);
    }
  }, [siteContent]);

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'test', data: {} }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Sukces: E-mail testowy został wysłany pomyślnie. Sprawdź skrzynkę odbiorczą.');
      } else {
        alert(`Błąd wysyłki: ${result.error || 'Nieznany błąd serwera'}`);
      }
    } catch (error) {
      console.error('Test email error:', error);
      alert('Błąd: Nie udało się połączyć z serwerem.');
    } finally {
      setIsTestingEmail(false);
    }
  };

  // Synchronizacja modala z statusem CMS
  React.useEffect(() => {
    if (cmsStatus === 'NOT_INITIALIZED') {
      setShowInitModal(true);
    }
  }, [cmsStatus]);

  const handleCheckStatus = async () => {
    setIsCheckingStatus(true);
    try {
      // Wykorzystujemy istniejący mechanizm GET_CMS do sprawdzenia statusu
      const data = await cmsService.getCMS();
      if (data.status === 'CMS_NOT_INITIALIZED') {
        alert("Status: Baza CMS nie została jeszcze utworzona na Google Drive.");
      } else if (data.full_content) {
        alert("Status: Baza CMS jest aktywna i zawiera dane.");
      } else {
        alert("Status: Nieznany stan bazy CMS.");
      }
    } catch (err) {
      alert("Błąd połączenia: Nie udało się skontaktować z Google Apps Script.");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleInitConfirm = async () => {
    setIsInitializing(true);
    try {
      await onInitializeCMS();
      setShowInitModal(false);
      alert("Sukces: Baza RPMS_CMS_DATABASE została zainicjalizowana pomyślnie.");
    } catch (err) {
      alert("Błąd: Nie udało się zainicjalizować bazy.");
    } finally {
      setIsInitializing(false);
    }
  };

  const menuGroups = [
    {
      label: 'PULPIT',
      items: [
        { id: 'overview', label: 'Przegląd', icon: <LayoutDashboard size={20} /> }
      ]
    },
    {
      label: 'TREŚĆ',
      items: [
        { id: 'blog-list', label: 'Artykuły (Blog)', icon: <FileText size={20} /> },
        { id: 'pages-list', label: 'Podstrony', icon: <FileText size={20} /> },
        { id: 'rag', label: 'Baza Wiedzy RAG', icon: <Database size={20} /> }
      ]
    },
    {
      label: 'WYGLĄD',
      items: [
        { id: 'layout', label: 'Układ Strony', icon: <LayoutIcon size={20} /> },
        { id: 'home-page', label: 'Strona Główna', icon: <LayoutIcon size={20} /> },
        { id: 'nav-footer', label: 'Nawigacja i Stopka', icon: <PanelTop size={20} /> },
        { id: 'partners', label: 'Partnerzy / Logotypy', icon: <Handshake size={20} /> },
        { id: 'dds', label: 'Design System (DDS)', icon: <Palette size={20} /> }
      ]
    },
    {
      label: 'MARKETING',
      items: [
        { id: 'seo-settings', label: 'Ustawienia SEO', icon: <Search size={20} /> }
      ]
    },
    {
      label: 'KOMUNIKACJA',
      items: [
        { id: 'templates', label: 'Szablony E-mail', icon: <Mail size={20} /> }
      ]
    },
    {
      label: 'ANALITYKA',
      items: [
        { id: 'onboarding_stats', label: 'Analiza Onboardingu', icon: <TrendingUp size={20} /> },
        { id: 'activity', label: 'Dziennik Aktywności', icon: <Clock size={20} /> }
      ]
    },
    {
      label: 'ADMINISTRACJA',
      items: [
        { id: 'company-info', label: 'Ustawienia Firmy', icon: <Building2 size={20} /> },
        { id: 'settings', label: 'Ustawienia Systemu', icon: <Settings size={20} /> },
        { id: 'migration', label: 'Migracja CMS', icon: <Database size={20} /> },
        { id: 'storage', label: 'Konfiguracja Storage', icon: <HardDrive size={20} /> }
      ]
    }
  ];

  const handleMenuClick = (id: string) => {
    setActiveTab(id);
    if (['overview', 'blog-list', 'pages-list', 'home-page', 'nav-footer', 'seo-settings', 'company-info'].includes(id)) {
      cmsLogic.setActiveSection(id);
    }
  };

  const isCmsTab = ['overview', 'blog-list', 'pages-list', 'home-page', 'nav-footer', 'seo-settings', 'company-info'].includes(activeTab);

  const executeAddSection = () => {
    if (componentToAdd && availableComponents.includes(componentToAdd)) {
      const id = `${componentToAdd.toLowerCase()}_${Date.now()}`;
      const currentLayout = Array.isArray(cmsLogic.localContent.pageLayout) ? cmsLogic.localContent.pageLayout : [];
      const newLayout = [...currentLayout, { id, component: componentToAdd, visible: true }];
      cmsLogic.setLocalContent({ ...cmsLogic.localContent, pageLayout: newLayout });
      setShowAddSectionModal(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 font-sans">
      <AdminSidebar 
        activeTab={activeTab}
        menuGroups={menuGroups}
        blogCount={cmsLogic.localContent.blog?.length || 0}
        onMenuClick={handleMenuClick}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#020617] relative">
        <AdminHeader 
          activeTab={activeTab}
          isCmsTab={isCmsTab}
          title={isCmsTab ? 'System Zarządzania Treścią' :
                 activeTab === 'layout' ? 'Układ Strony Głównej' :
                 activeTab === 'dds' ? 'Dynamic Design System' :
                 menuGroups.flatMap(g => g.items).find(m => m.id === activeTab)?.label || 'Panel Zarządzania RPMS'}
          subtitle={isCmsTab ? `Sekcja: ${menuGroups.flatMap(g => g.items).find(s => s.id === activeTab)?.label || 'Edycja'}` :
                    activeTab === 'dds' ? 'Zarządzaj globalnymi stylami i komponentami' :
                    'Witaj w centrum dowodzenia RPMS Windykacja'}
          isSaving={cmsLogic.isSaving}
          saveStatus={cmsLogic.saveStatus}
          onSave={() => cmsLogic.handleSave(onUpdateContent)}
          onDownloadFallbackJSON={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cmsLogic.localContent, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "cms_fallback.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
          }}
          onDownloadFallbackTS={() => {
            const fileContent = `// Plik: src/config/fallbackLayout.ts\n// UWAGA: Ten plik jest generowany automatycznie przez Panel Administratora RPMS CMS.\n// Służy jako twardy fallback (układ awaryjny) w przypadku braku połączenia z chmurą.\n\nexport interface LayoutSection {\n  id: string;\n  component: string;\n  visible: boolean;\n}\n\nexport const FALLBACK_PAGE_LAYOUT: LayoutSection[] = ${JSON.stringify(cmsLogic.localContent.pageLayout || [], null, 2)};\n`;
            const blob = new Blob([fileContent], { type: 'text/typescript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fallbackLayout.ts';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          onAddSection={() => setShowAddSectionModal(true)}
        />

        <div className="p-10 w-full max-w-[1600px] mx-auto">
          {isCmsTab ? (
            <div className="animate-in fade-in duration-500">
              {(cmsStatus === 'NOT_INITIALIZED' || cmsStatus === 'ERROR') && (
                <div className={`mb-8 p-6 ${cmsStatus === 'ERROR' ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'} border rounded-[var(--radius-brand-card)] flex items-center justify-between animate-in fade-in slide-in-from-top duration-700`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${cmsStatus === 'ERROR' ? 'bg-red-500' : 'bg-amber-500'} rounded-[var(--radius-brand-button)] flex items-center justify-center text-white shadow-lg`}>
                      <ShieldAlert size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white">
                        {cmsStatus === 'ERROR' ? 'Błąd połączenia z Cloud CMS' : 'Baza CMS nie została zainicjalizowana'}
                      </h4>
                      <p className="text-slate-400 text-sm font-medium">
                        {cmsStatus === 'ERROR' 
                          ? 'Nie udało się połączyć z Google Apps Script. Sprawdź czy URL w config.ts jest poprawny i czy skrypt jest opublikowany.' 
                          : 'Twoje zmiany są obecnie zapisywane tylko lokalnie. Zainicjalizuj bazę w chmurze Google, aby umożliwić trwałą edycję.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={handleCheckStatus}
                      disabled={isCheckingStatus}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest transition-all border border-slate-700 flex items-center gap-2"
                    >
                      {isCheckingStatus ? <RefreshCw size={14} className="animate-spin" /> : <Database size={14} />}
                      Sprawdź status bazy
                    </button>
                    <button 
                      onClick={() => setShowInitModal(true)}
                      className={`px-6 py-3 ${cmsStatus === 'ERROR' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'} text-white rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest transition-all shadow-lg`}
                    >
                      {cmsStatus === 'ERROR' ? 'Spróbuj zainicjalizować' : 'Inicjalizuj teraz'}
                    </button>
                  </div>
                </div>
              )}
              <CMSManager />
            </div>
          ) : activeTab === 'layout' ? (
            <div className="animate-in fade-in duration-500">
              <LayoutManager />
            </div>
          ) : activeTab === 'partners' ? (
            <PartnersManager />
          ) : activeTab === 'dds' ? (
            <DDSManager />
          ) : activeTab === 'templates' ? (
            <TemplatesManager />
          ) : activeTab === 'settings' ? (
            <AdminSettingsTab 
              settings={cmsLogic.localContent.settings}
              isSaving={cmsLogic.isSaving}
              saveStatus={cmsLogic.saveStatus}
              isTestingEmail={isTestingEmail}
              onUpdateSettings={(newSettings) => cmsLogic.setLocalContent({ ...cmsLogic.localContent, settings: newSettings })}
              onTestEmail={handleTestEmail}
              onSave={() => cmsLogic.handleSave(onUpdateContent)}
            />
          ) : activeTab === 'migration' ? (
            <div className="animate-in fade-in duration-500">
              <MigrationManager />
            </div>
          ) : activeTab === 'storage' ? (
            <div className="animate-in fade-in duration-500">
              <StorageManager />
            </div>
          ) : activeTab === 'onboarding_stats' ? (
            <OnboardingDashboard />
          ) : activeTab === 'activity' ? (
            <ActivityLogViewer />
          ) : activeTab === 'rag' ? (
            <RAGManager />
          ) : (
            <div className="py-32 flex flex-col items-center justify-center text-center animate-pulse">
              <h2 className="text-4xl font-black text-slate-700 uppercase tracking-[0.2em] mb-4 italic">Moduł w budowie</h2>
              <p className="text-slate-500 max-w-sm">Trwają prace nad globalnym widokiem spraw i analityką predykcyjną RPMS.</p>
            </div>
          )}
        </div>
      </main>

      <AdminModals 
        showInitModal={showInitModal}
        isInitializing={isInitializing}
        onCloseInitModal={() => setShowInitModal(false)}
        onConfirmInit={handleInitConfirm}
        showAddSectionModal={showAddSectionModal}
        availableComponents={availableComponents}
        componentToAdd={componentToAdd}
        onCloseAddSectionModal={() => setShowAddSectionModal(false)}
        onSetComponentToAdd={setComponentToAdd}
        onExecuteAddSection={executeAddSection}
      />
    </div>
  );
};

export default AdminDashboard;
