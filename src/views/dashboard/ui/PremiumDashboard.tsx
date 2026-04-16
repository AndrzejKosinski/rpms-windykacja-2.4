import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import WorkspaceChat from '../../../widgets/marketing/ui/WorkspaceChat';
import { LoggedInUser } from '../../../context/AppContext';
import { useDebtors } from '../../../entities/debtor/model/useDebtors';
import { useInvoiceAnalysis } from '../../../features/upload-invoice/model/useInvoiceAnalysis';
import { fileApi } from '../../../shared/api/fileApi';
import Sidebar from '../../../widgets/Sidebar';
import DashboardHeader from '../../../widgets/DashboardHeader';
import DebtorProfileSidebar from '../../../widgets/DebtorProfileSidebar';
import VerificationBanner from './VerificationBanner';
import DashboardView from './DashboardView';
import DebtorsView from '../../clients/ui/DebtorsView';
import DocumentsView from '../../documents/ui/DocumentsView';
import SettingsView from '../../settings/ui/SettingsView';
import AddDebtWizard from '../../../features/add-debt/ui/AddDebtWizard';
import DeleteConfirmModal from '../../../shared/ui/modals/DeleteConfirmModal';
import { Debtor } from '../../../entities/debtor/model/types';
import { parseAddressParts } from '../../../shared/utils/address';

interface PremiumDashboardProps {
  onLogout: () => void;
  data: any;
  user: LoggedInUser | null;
}

const PremiumDashboard: React.FC<PremiumDashboardProps> = ({ onLogout, data, user: loggedUser }) => {
  const user = loggedUser || data.auth.demoUser;
  
  const { 
    debtors, isLoading, isInitialLoad, isProcessingAction, 
    fetchDebtors, updateStatus, deleteCase, deleteInvoice, setDebtors 
  } = useDebtors(user?.email);

  const {
    isAnalyzing, isSyncing, extractedData, setExtractedData,
    analyzeInvoice, finalizeDebt, updateDebtData
  } = useInvoiceAnalysis(user?.email, fetchDebtors);

  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const downloadFile = (url: string, id: string) => fileApi.downloadFile(url, id, setIsDownloading);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAddingDebt, setIsAddingDebt] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editType, setEditType] = useState<'DEBTOR' | 'INVOICE' | undefined>();
  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [addDebtStep, setAddDebtStep] = useState(0); 
  const [showActivationBanner, setShowActivationBanner] = useState(true);
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [tempEmail, setTempEmail] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // Deletion state
  const [caseToDelete, setCaseToDelete] = useState<{ id: string, name: string } | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<{ caseId: string, invoiceId: string, num: string } | null>(null);

  const [portalRendered, setPortalRendered] = useState(true);

  useEffect(() => {
    if (!isInitialLoad) {
      setPortalRendered(false);
    }
  }, [isInitialLoad]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await analyzeInvoice(file);
      if (success) setAddDebtStep(2);
    }
  };

  const handleFinalize = async () => {
    if (isEditMode && editingCaseId) {
      const success = await updateDebtData(editingCaseId, extractedData!, editType, editingInvoiceId || undefined);
      if (success) {
        setIsAddingDebt(false);
        setIsEditMode(false);
        setEditingCaseId(null);
        setEditingInvoiceId(null);
        setEditType(undefined);
      }
    } else {
      const success = await finalizeDebt();
      if (success) setAddDebtStep(3);
    }
  };

  const handleInitiateNewCase = () => {
    setExtractedData(null); 
    setAddDebtStep(0);
    setEditType(undefined);
    setIsAddingDebt(true);
    setIsEditMode(false);
  };

  const handleInitiateInvoiceScan = () => {
    setExtractedData(null);
    setAddDebtStep(1);
    setEditType(undefined);
    setIsAddingDebt(true);
    setIsEditMode(false);
  };

  const handleInitiateManualEntry = () => {
    setExtractedData({ 
      debtorName: '', nip: '', krs: '', street: '', zipCode: '', city: '', address: '', 
      corrStreet: '', corrZipCode: '', corrCity: '', correspondenceAddress: '', 
      isForeign: false, invoiceNumber: '', issueDate: '', dueDate: '', 
      amount: '', netAmount: '', vatAmount: '', currency: 'PLN', description: '', isContested: 'NO' 
    });
    setAddDebtStep(2);
    setEditType(undefined);
    setIsAddingDebt(true);
    setIsEditMode(false);
  };

  const handleExcelImport = () => {
    // Placeholder dla przyszłej obsługi Excel/CSV
    alert("Funkcja importu masowego z pliku Excel/CSV zostanie udostępniona wkrótce. Prosimy o kontakt z opiekunem prawnym w celu przekazania większej liczby spraw.");
  };

  const handleAddInvoiceToDebtor = (debtor: Debtor) => {
    const mainAddr = parseAddressParts(debtor.address);
    const corrAddr = parseAddressParts(debtor.correspondenceAddress);
    setExtractedData({ 
      debtorName: debtor.debtorName, nip: debtor.nip, krs: debtor.krs || '',
      street: mainAddr.street, zipCode: mainAddr.zipCode, city: mainAddr.city, address: debtor.address || '',
      corrStreet: corrAddr.street, corrZipCode: corrAddr.zipCode, corrCity: corrAddr.city, correspondenceAddress: debtor.correspondenceAddress || '',
      isForeign: debtor.isForeign || false, invoiceNumber: '', issueDate: '', dueDate: '', amount: '', netAmount: '', vatAmount: '', currency: 'PLN', description: '', isContested: 'NO'
    });
    setAddDebtStep(1); 
    setEditType(undefined);
    setIsAddingDebt(true);
    setIsEditMode(false);
  };

  const handleEditCase = (debtor: Debtor) => {
    const mainAddr = parseAddressParts(debtor.address);
    const corrAddr = parseAddressParts(debtor.correspondenceAddress);
    setExtractedData({
      debtorName: debtor.debtorName, nip: debtor.nip, krs: debtor.krs || '',
      street: mainAddr.street, zipCode: mainAddr.zipCode, city: mainAddr.city, address: debtor.address || '',
      corrStreet: corrAddr.street, corrZipCode: corrAddr.zipCode, corrCity: corrAddr.city, correspondenceAddress: debtor.correspondenceAddress || '',
      isForeign: debtor.isForeign || false, invoiceNumber: debtor.invoices[0]?.invoiceNumber || '', issueDate: debtor.invoices[0]?.issueDate || '', dueDate: debtor.invoices[0]?.dueDate || '',
      amount: debtor.invoices[0]?.amount || '', netAmount: debtor.invoices[0]?.netAmount || '', vatAmount: debtor.invoices[0]?.vatAmount || '', currency: (debtor.invoices[0]?.currency as 'PLN' | 'EUR') || 'PLN',
      description: debtor.invoices[0]?.description || '', isContested: debtor.invoices[0]?.isContested || 'NO'
    });
    setEditingCaseId(debtor.caseId);
    setEditingInvoiceId(null);
    setEditType('DEBTOR');
    setIsEditMode(true);
    setAddDebtStep(2);
    setIsAddingDebt(true);
  };

  const handleEditInvoice = (debtor: Debtor, invoice: any) => {
    const mainAddr = parseAddressParts(debtor.address);
    const corrAddr = parseAddressParts(debtor.correspondenceAddress);
    setExtractedData({
      debtorName: debtor.debtorName, nip: debtor.nip, krs: debtor.krs || '',
      street: mainAddr.street, zipCode: mainAddr.zipCode, city: mainAddr.city, address: debtor.address || '',
      corrStreet: corrAddr.street, corrZipCode: corrAddr.zipCode, corrCity: corrAddr.city, correspondenceAddress: debtor.correspondenceAddress || '',
      isForeign: debtor.isForeign || false, invoiceNumber: invoice.invoiceNumber || '', issueDate: invoice.issueDate || '', dueDate: invoice.dueDate || '',
      amount: invoice.amount, netAmount: invoice.netAmount || '', vatAmount: invoice.vatAmount || '', currency: (invoice.currency as 'PLN' | 'EUR') || 'PLN',
      description: invoice.description || '', isContested: invoice.isContested || 'NO'
    });
    setEditingCaseId(debtor.caseId);
    setEditingInvoiceId(invoice.id);
    setEditType('INVOICE');
    setIsEditMode(true);
    setAddDebtStep(2);
    setIsAddingDebt(true);
  };

  const handleConfirmDeleteCase = async () => {
    if (!caseToDelete) return;
    const success = await deleteCase(caseToDelete.id);
    if (success) setCaseToDelete(null);
  };

  const handleConfirmDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    const success = await deleteInvoice(invoiceToDelete.caseId, invoiceToDelete.invoiceId);
    if (success) setInvoiceToDelete(null);
  };

  const handleOpenDeleteConfirm = (caseId: string) => {
    const debtor = debtors.find(d => String(d.caseId).trim() === String(caseId).trim());
    setCaseToDelete({ id: String(caseId), name: debtor?.debtorName || 'Sprawę' });
  };

  const handleOpenInvoiceDeleteConfirm = (caseId: string, invoiceId: string) => {
    const debtor = debtors.find(d => String(d.caseId) === String(caseId));
    const invoice = debtor?.invoices.find(i => String(i.id) === String(invoiceId));
    setInvoiceToDelete({ caseId, invoiceId, num: invoice?.invoiceNumber || 'tę fakturę' });
  };

  return (
    <div className="relative h-screen bg-slate-50 font-sans overflow-hidden">
      {portalRendered && (
        <div className={`fixed inset-0 z-[500] bg-brand-navy flex flex-col items-center justify-center text-white transition-all duration-300 ${!isInitialLoad ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue rounded-full blur-[120px] animate-pulse [animation-delay:1s]"></div>
          </div>
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[var(--radius-brand-card)] flex items-center justify-center mb-8 border border-white/20 shadow-2xl animate-in zoom-in duration-500">
               <ShieldCheck size={40} className="text-brand-blue" />
            </div>
            <h2 className="text-xl md:text-2xl font-black mb-1 tracking-tight italic text-white">Autoryzacja dostępu...</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[9px] mb-10">Inicjalizacja bezpiecznego połączenia RPMS</p>
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
               <div className="h-full bg-brand-blue animate-progress-fast"></div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE USUWANIA - WYPROWADZONE NA SZCZYT I ZAWSZE RENDEROWANE DLA PŁYNNOŚCI */}
      <DeleteConfirmModal 
        isOpen={!!caseToDelete}
        onClose={() => setCaseToDelete(null)}
        onConfirm={handleConfirmDeleteCase}
        isDeleting={isProcessingAction === caseToDelete?.id}
        title="Usuwanie całej sprawy"
        message={`Czy na pewno chcesz bezpowrotnie usunąć dłużnika ${caseToDelete?.name} wraz ze wszystkimi fakturami?`}
        confirmText="Tak, usuń wszystko"
      />

      <DeleteConfirmModal 
        isOpen={!!invoiceToDelete}
        onClose={() => setInvoiceToDelete(null)}
        onConfirm={handleConfirmDeleteInvoice}
        isDeleting={isProcessingAction === invoiceToDelete?.invoiceId}
        title="Usuwanie faktury"
        message={`Czy na pewno chcesz usunąć fakturę nr ${invoiceToDelete?.num} z tej sprawy?`}
        confirmText="Tak, usuń fakturę"
      />

      <div className="flex h-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto">
          <DashboardHeader 
            user={user}
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
            onInitiateNewCase={handleInitiateNewCase}
          />
          <VerificationBanner />

          <div className="p-10">
            {activeTab === 'dashboard' ? (
              <DashboardView 
                debtors={debtors} 
                isLoading={isLoading}
                isProcessingAction={isProcessingAction}
                isDownloading={isDownloading}
                onUpdateStatus={updateStatus}
                onAddDebt={handleInitiateNewCase}
                onAddInvoiceScan={handleInitiateInvoiceScan}
                onManualEntry={handleInitiateManualEntry}
                onExcelImport={handleExcelImport}
                onAddInvoiceToDebtor={handleAddInvoiceToDebtor}
                onDownload={downloadFile}
                onEditCase={handleEditCase}
                onEditInvoice={handleEditInvoice}
                onDeleteCase={handleOpenDeleteConfirm}
                onDeleteInvoice={handleOpenInvoiceDeleteConfirm}
                userName={user.name}
                isEmailVerified={user?.emailVerified}
              />
            ) : activeTab === 'clients' ? (
              <DebtorsView 
                debtors={debtors}
                isLoading={isLoading}
                onRefresh={fetchDebtors}
                onAddDebt={handleInitiateNewCase}
                onSelectDebtor={(d) => { setSelectedDebtor(d); setTempEmail(d.email || ''); }}
              />
            ) : activeTab === 'documents' ? (
              <DocumentsView 
                debtors={debtors}
                onAddDebt={handleInitiateNewCase}
                onDownload={downloadFile}
                isDownloading={isDownloading}
              />
            ) : activeTab === 'settings' ? (
              <SettingsView />
            ) : (
              <div className="py-20 text-center animate-pulse">
                 <h2 className="text-2xl font-black text-slate-300 uppercase tracking-[0.2em]">Widok w budowie...</h2>
              </div>
            )}
          </div>

          {isAddingDebt && (
            <AddDebtWizard 
              step={addDebtStep}
              setStep={setAddDebtStep}
              isAnalyzing={isAnalyzing}
              isSyncing={isSyncing}
              extractedData={extractedData}
              isEditMode={isEditMode}
              editType={editType}
              onClose={() => { setIsAddingDebt(false); setIsEditMode(false); setEditType(undefined); setEditingInvoiceId(null); }}
              onFileUpload={handleFileUpload}
              onFinalize={handleFinalize}
              onUpdateData={(newData) => setExtractedData(newData)}
            />
          )}

          {selectedDebtor && (
            <DebtorProfileSidebar 
              selectedDebtor={selectedDebtor}
              user={user}
              onClose={() => setSelectedDebtor(null)}
              onUpdateSuccess={() => fetchDebtors()}
            />
          )}
          <WorkspaceChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} userName={user.name} />
        </main>
      </div>

      <style>{`
        @keyframes progress-fast {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 70%; transform: translateX(0%); }
          100% { width: 100%; transform: translateX(100%); }
        }
        .animate-progress-fast {
          animation: progress-fast 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default PremiumDashboard;
