import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Edit3 } from 'lucide-react';
import { QueueItem } from './types';

interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: QueueItem | null;
  onSave: (id: string, updatedData: any) => void;
}

const InvoiceDetailsModal: React.FC<InvoiceDetailsModalProps> = ({ isOpen, onClose, item, onSave }) => {
  const [formData, setFormData] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (item?.extractedData) {
      setFormData(item.extractedData);
      setIsEditing(false); // Reset to preview mode when a new item is opened
    } else {
      setFormData({});
      setIsEditing(true); // If no data, default to edit mode
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(item.id, formData);
    setIsEditing(false);
  };

  const InputOrText = ({ label, name, value }: { label: string, name: string, value: string }) => (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
      {isEditing ? (
        <input 
          type="text" 
          name={name}
          value={value || ''} 
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[var(--radius-brand-input)] text-sm font-medium text-brand-navy focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all"
        />
      ) : (
        <div className="w-full px-4 py-2.5 bg-slate-50/50 border border-transparent rounded-[var(--radius-brand-input)] text-sm font-medium text-brand-navy">
          {value || <span className="text-slate-300 italic">Brak danych</span>}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[var(--radius-brand-card)] shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 border border-slate-200 flex flex-col overflow-hidden">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[var(--radius-brand-button)] bg-brand-blue/10 flex items-center justify-center text-brand-blue">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-brand-navy tracking-tight leading-none mb-1">
                {isEditing ? 'Edycja danych faktury' : 'Podgląd danych faktury'}
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.file.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-brand-navy transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Dane podstawowe</h4>
              </div>
              
              <InputOrText label="Numer faktury" name="invoiceNumber" value={formData.invoiceNumber} />

              <div className="grid grid-cols-2 gap-3">
                <InputOrText label="Kwota brutto" name="amount" value={formData.amount} />
                <InputOrText label="Waluta" name="currency" value={formData.currency} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InputOrText label="Data wystawienia" name="issueDate" value={formData.issueDate} />
                <InputOrText label="Termin płatności" name="dueDate" value={formData.dueDate} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Dane dłużnika</h4>
              </div>
              
              <InputOrText label="NIP" name="nip" value={formData.nip || formData.debtorNip} />
              <InputOrText label="Nazwa dłużnika" name="debtorName" value={formData.debtorName} />
              <InputOrText label="Ulica i numer" name="street" value={formData.street} />

              <div className="grid grid-cols-2 gap-3">
                <InputOrText label="Kod pocztowy" name="zipCode" value={formData.zipCode} />
                <InputOrText label="Miejscowość" name="city" value={formData.city} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => {
                  setFormData(item.extractedData || {});
                  setIsEditing(false);
                }}
                className="px-6 py-2.5 rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-colors"
              >
                Anuluj
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:bg-brand-navy transition-all flex items-center gap-2"
              >
                <Save size={16} /> Zapisz zmiany
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-colors"
              >
                Zamknij
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-brand-navy rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-all flex items-center gap-2"
              >
                <Edit3 size={16} /> Edytuj dane
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsModal;
