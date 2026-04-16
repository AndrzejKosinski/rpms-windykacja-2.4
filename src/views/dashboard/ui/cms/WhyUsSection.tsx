import React, { useState } from 'react';
import { Plus, LayoutTemplate, Database } from 'lucide-react';
import { WhyUsData, WhyUsHeader, WhyUsCard, ModalDefinition } from './WhyUsTypes';
import { defaultHeader, defaultCards, defaultModals, availableIcons } from './WhyUsDefaults';
import { CardEditor } from './CardEditor';
import { ModalList } from './ModalList';
import { ModalEditorDrawer } from './ModalEditorDrawer';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { generateWhyUsModal } from '../../../../services/geminiService';

interface WhyUsSectionProps {
  data: WhyUsData;
  onChange: (field: string, value: any) => void;
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({ data, onChange }) => {
  const header = data?.header || defaultHeader;
  const cards = data?.cards || defaultCards;
  const modals = data?.modals || defaultModals;

  const [activeTab, setActiveTab] = useState<'cards' | 'modals'>('cards');
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [modalToDeleteId, setModalToDeleteId] = useState<string | null>(null);
  const [tempModalData, setTempModalData] = useState<Partial<ModalDefinition>>({});
  const [generatingModalIndex, setGeneratingModalIndex] = useState<number | null>(null);

  const handleUpdateHeader = (field: keyof WhyUsHeader, value: string) => {
    onChange('header', { ...header, [field]: value });
  };

  const handleAddCard = () => {
    const newCards = [...cards, { id: `new_${Date.now()}`, icon: 'CheckCircle', title: 'Nowa zaleta', desc: 'Opis nowej zalety...', assignedModalId: '' }];
    onChange('cards', newCards);
  };

  const handleUpdateCard = (index: number, field: keyof WhyUsCard, value: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    onChange('cards', newCards);
  };

  const handleDeleteCard = (index: number) => {
    const newCards = cards.filter((_, i) => i !== index);
    onChange('cards', newCards);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newCards = [...cards];
    const temp = newCards[index];
    newCards[index] = newCards[index - 1];
    newCards[index - 1] = temp;
    onChange('cards', newCards);
  };

  const handleMoveDown = (index: number) => {
    if (index === cards.length - 1) return;
    const newCards = [...cards];
    const temp = newCards[index];
    newCards[index] = newCards[index + 1];
    newCards[index + 1] = temp;
    onChange('cards', newCards);
  };

  const handleGenerateModalAI = async (index: number) => {
    const card = cards[index];
    if (!card.title || !card.desc) {
      alert('Proszę najpierw uzupełnić tytuł i opis karty.');
      return;
    }

    setGeneratingModalIndex(index);

    try {
      const generatedData = await generateWhyUsModal(card.title, card.desc);
      const modalId = `ai_modal_${Date.now()}`;
      
      const newModal: ModalDefinition = {
        id: modalId,
        internalName: `AI: ${card.title}`,
        title: generatedData.title,
        subtitle: generatedData.subtitle,
        icon: card.icon || 'CheckCircle',
        benefit: generatedData.benefit,
        standard: generatedData.standard,
        points: generatedData.points,
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
        isVisibleInCarousel: true,
        sectionType: 'why_us'
      };

      onChange('modals', [...modals, newModal]);
      handleUpdateCard(index, 'assignedModalId', modalId);

      alert('Modal został wygenerowany i podłączony do karty!');
    } catch (error) {
      console.error('Błąd generowania modala:', error);
      alert('Wystąpił błąd podczas generowania treści przez AI.');
    } finally {
      setGeneratingModalIndex(null);
    }
  };

  const handleAddModal = () => {
    const newModal: ModalDefinition = {
      id: `modal_${Date.now()}`,
      internalName: 'Nowy Modal',
      title: 'Tytuł',
      subtitle: 'Podtytuł',
      icon: 'CheckCircle',
      benefit: 'Główna korzyść...',
      standard: 'Standard operacyjny...',
      points: ['Punkt 1', 'Punkt 2'],
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
      isVisibleInCarousel: true,
      sectionType: 'why_us'
    };
    onChange('modals', [...modals, newModal]);
    setTempModalData(newModal);
    setActiveModalId(newModal.id);
  };

  const handleDeleteModal = (modalId: string) => {
    setModalToDeleteId(modalId);
  };

  const handleToggleModalVisibility = (modalId: string, isVisible: boolean) => {
    const updatedModals = modals.map(m => 
      m.id === modalId ? { ...m, isVisibleInCarousel: isVisible } : m
    );
    onChange('modals', updatedModals);
  };

  const confirmDeleteModal = () => {
    if (modalToDeleteId) {
      onChange('modals', modals.filter(m => m.id !== modalToDeleteId));
      const newCards = cards.map(c => c.assignedModalId === modalToDeleteId ? { ...c, assignedModalId: "" } : c);
      onChange('cards', newCards);
      setModalToDeleteId(null);
    }
  };

  const openModalEditor = (modalId: string) => {
    const modal = modals.find(m => m.id === modalId) || modals[0];
    if (modal) {
      setTempModalData(modal);
      setActiveModalId(modalId);
    }
  };

  const saveModalContent = () => {
    if (activeModalId) {
      const newModals = modals.map(m => m.id === activeModalId ? { ...m, ...tempModalData } as ModalDefinition : m);
      onChange('modals', newModals);
      setActiveModalId(null);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Zakładki */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('cards')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'cards' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-400 hover:text-white hover:border-slate-700'}`}
        >
          <LayoutTemplate size={18} />
          Karty i Nagłówek
        </button>
        <button
          onClick={() => setActiveTab('modals')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'modals' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-400 hover:text-white hover:border-slate-700'}`}
        >
          <Database size={18} />
          Baza Modali
        </button>
      </div>

      {activeTab === 'cards' && (
        <div className="space-y-8">
          {/* Nagłówek Sekcji */}
          <div className="bg-[#0f172a] rounded-[var(--radius-brand-button)] p-6 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-6">Nagłówek Sekcji</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Główny Tytuł (H2)</label>
                <p className="text-xs text-slate-400 px-1 mb-2">Użyj znaczników <code className="text-brand-blue bg-brand-blue/10 px-1 rounded-[var(--radius-brand-button)]">[blue]tekst[/blue]</code> dla niebieskiego koloru z podkreśleniem oraz <code className="text-brand-blue bg-brand-blue/10 px-1 rounded-[var(--radius-brand-button)]">[br]</code> dla nowej linii.</p>
                <textarea
                  value={header.title}
                  onChange={(e) => handleUpdateHeader('title', e.target.value)}
                  className="w-full bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-input)] px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Opis</label>
                <textarea
                  value={header.description}
                  onChange={(e) => handleUpdateHeader('description', e.target.value)}
                  className="w-full bg-[#020617] border border-slate-800 rounded-[var(--radius-brand-input)] px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-[var(--radius-brand-card)] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-white">Dlaczego My (Karty)</h3>
                <p className="text-slate-400 text-sm">Zarządzaj kartami w sekcji "Dlaczego My". Zmieniaj kolejność, edytuj treść i ikony.</p>
              </div>
              <button
                onClick={handleAddCard}
                className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-bold text-sm hover:bg-brand-light-blue transition-colors"
              >
                <Plus size={16} /> Dodaj Kartę
              </button>
            </div>

            <div className="space-y-4">
              {cards.map((card, index) => (
                <CardEditor
                  key={card.id || index}
                  card={card}
                  index={index}
                  totalCards={cards.length}
                  modals={modals}
                  generatingModalIndex={generatingModalIndex}
                  availableIcons={availableIcons}
                  onUpdate={handleUpdateCard}
                  onDelete={handleDeleteCard}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onGenerateAI={handleGenerateModalAI}
                  onEditModal={(modalId) => {
                    setActiveTab('modals');
                    openModalEditor(modalId);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'modals' && (
        <ModalList
          modals={modals}
          items={cards}
          onAddModal={handleAddModal}
          onEditModal={openModalEditor}
          onDeleteModal={handleDeleteModal}
          onToggleVisibility={handleToggleModalVisibility}
        />
      )}

      <ModalEditorDrawer
        activeModalId={activeModalId}
        tempModalData={tempModalData}
        availableIcons={availableIcons}
        onClose={() => setActiveModalId(null)}
        onSave={saveModalContent}
        onChange={setTempModalData}
      />

      <DeleteConfirmModal
        isOpen={modalToDeleteId !== null}
        onClose={() => setModalToDeleteId(null)}
        onConfirm={confirmDeleteModal}
        title={modals.find(m => m.id === modalToDeleteId)?.internalName || 'Ten modal'}
      />
    </div>
  );
};
