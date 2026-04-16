import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, FileText, Calendar, Clock, DollarSign, ExternalLink, Save, Loader2, Trash2, AlertCircle } from 'lucide-react';
import { Debtor } from '../entities/debtor/model/types';
import { debtorApi } from '../entities/debtor/api/debtorApi';
import { fileApi } from '../shared/api/fileApi';

interface DebtorProfileSidebarProps {
  selectedDebtor: Debtor;
  user: any;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

const DebtorProfileSidebar: React.FC<DebtorProfileSidebarProps> = ({ selectedDebtor, user, onClose, onUpdateSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [editedData, setEditedData] = useState({
    email: selectedDebtor.email || '',
    phone: selectedDebtor.phone || '',
    address: selectedDebtor.address || '',
    correspondenceAddress: selectedDebtor.correspondenceAddress || ''
  });

  useEffect(() => {
    setEditedData({
      email: selectedDebtor.email || '',
      phone: selectedDebtor.phone || '',
      address: selectedDebtor.address || '',
      correspondenceAddress: selectedDebtor.correspondenceAddress || ''
    });
  }, [selectedDebtor]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await debtorApi.updateDebtData(selectedDebtor.caseId, user.email, editedData);
      if (success) {
        setIsEditing(false);
        onUpdateSuccess();
      }
    } catch (error) {
      console.error("Error updating debtor data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = (url: string, id: string) => {
    fileApi.downloadFile(url, id, setIsDownloading);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-navy rounded-[var(--radius-brand-button)] flex items-center justify-center text-white shadow-lg">
            <User size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-brand-navy leading-tight">{selectedDebtor.debtorName}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profil Dłużnika • Sprawa #{selectedDebtor.caseId}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-brand-navy transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-10">
        {/* Status Badge */}
        <div className="flex items-center justify-between p-4 bg-brand-navy/5 rounded-[var(--radius-brand-button)] border border-brand-navy/10">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aktualny Status</span>
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            selectedDebtor.status === 'WINDYKACJA' ? 'bg-amber-100 text-amber-700' :
            selectedDebtor.status === 'SĄD' ? 'bg-brand-blue/10 text-brand-blue' :
            selectedDebtor.status === 'KOMORNIK' ? 'bg-purple-100 text-purple-700' :
            'bg-green-100 text-green-700'
          }`}>
            {selectedDebtor.status}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Dane Kontaktowe</h4>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={isSaving}
              className="text-xs font-black text-brand-blue hover:text-brand-navy transition-colors flex items-center gap-2 uppercase tracking-widest"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : isEditing ? <Save size={14} /> : 'Edytuj'}
              {isEditing ? 'Zapisz' : 'Edytuj'}
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Mail size={12} /> E-mail
              </label>
              {isEditing ? (
                <input 
                  type="email" 
                  value={editedData.email}
                  onChange={e => setEditedData({...editedData, email: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-[var(--radius-brand-button)] outline-none focus:border-brand-blue transition-all font-bold text-sm"
                />
              ) : (
                <p className="text-sm font-black text-brand-navy">{selectedDebtor.email || 'Brak adresu e-mail'}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Phone size={12} /> Telefon
              </label>
              {isEditing ? (
                <input 
                  type="tel" 
                  value={editedData.phone}
                  onChange={e => setEditedData({...editedData, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-[var(--radius-brand-button)] outline-none focus:border-brand-blue transition-all font-bold text-sm"
                />
              ) : (
                <p className="text-sm font-black text-brand-navy">{selectedDebtor.phone || 'Brak numeru telefonu'}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={12} /> Adres Siedziby
              </label>
              {isEditing ? (
                <textarea 
                  value={editedData.address}
                  onChange={e => setEditedData({...editedData, address: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-[var(--radius-brand-button)] outline-none focus:border-brand-blue transition-all font-bold text-sm resize-none"
                />
              ) : (
                <p className="text-sm font-black text-brand-navy">{selectedDebtor.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Invoices */}
        <div className="space-y-6">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Powiązane Dokumenty</h4>
          <div className="space-y-3">
            {selectedDebtor.invoices.map((inv, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-100 rounded-[var(--radius-brand-button)] shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-[var(--radius-brand-input)] flex items-center justify-center group-hover:bg-brand-blue/10 group-hover:text-brand-blue transition-colors">
                      <FileText size={18} />
                    </div>
                    <p className="text-sm font-black text-brand-navy">{inv.invoiceNumber}</p>
                  </div>
                  <p className="text-sm font-black text-brand-navy">{inv.amount} {inv.currency}</p>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Calendar size={10} /> {inv.dueDate}</span>
                  {inv.fileUrl && (
                    <button 
                      onClick={() => handleDownload(inv.fileUrl, inv.id)}
                      disabled={!!isDownloading}
                      className="text-brand-blue hover:text-brand-navy transition-colors flex items-center gap-1"
                    >
                      {isDownloading === inv.id ? <Loader2 size={10} className="animate-spin" /> : <ExternalLink size={10} />}
                      Pobierz PDF
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History / Logs */}
        <div className="space-y-6">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Historia Działań</h4>
          <div className="relative pl-6 space-y-8 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
            {selectedDebtor.history && selectedDebtor.history.length > 0 ? (
              [...selectedDebtor.history].reverse().map((event, idx) => (
                <div key={idx} className={`relative ${idx > 0 ? 'opacity-70' : ''}`}>
                  <div className={`absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${
                    event.type === 'STATUS_CHANGE' ? 'bg-brand-blue' :
                    event.type === 'FEE_ADDED' ? 'bg-amber-500' :
                    event.type === 'PAYMENT' ? 'bg-emerald-500' :
                    'bg-slate-300'
                  }`}></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {new Date(event.date).toLocaleString('pl-PL', { 
                      day: '2-digit', month: '2-digit', year: 'numeric', 
                      hour: '2-digit', minute: '2-digit' 
                    })}
                  </p>
                  <p className="text-xs font-black text-brand-navy">{event.label}</p>
                  {event.value && <p className="text-[10px] font-bold text-slate-500 mt-1">{event.value}</p>}
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Brak zarejestrowanych działań</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
        <button className="flex-1 py-4 bg-brand-navy text-white rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-navy/10 hover:bg-brand-blue transition-all">
          Generuj Raport
        </button>
        <button className="px-6 py-4 bg-white text-slate-400 border border-slate-200 rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default DebtorProfileSidebar;
