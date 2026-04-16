import React from 'react';
import { Plus, LayoutTemplate, Database } from 'lucide-react';
import { ModalList } from './ModalList';
import { ModalEditorDrawer } from './ModalEditorDrawer';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { TargetAudienceHeader } from './TargetAudienceHeader';
import { TargetAudienceIndustryItem } from './TargetAudienceIndustryItem';
import { TargetAudienceCTA } from './TargetAudienceCTA';
import { TargetAudienceData } from './TargetAudienceTypes';
import { defaultHeader, defaultTargetAudienceModals, defaultIndustries, defaultCTA, availableIcons } from './TargetAudienceDefaults';
import { useTargetAudienceHandlers } from './useTargetAudienceHandlers';

interface TargetAudienceSectionProps {
  data?: TargetAudienceData;
  onChange: (field: string, value: any) => void;
}

export const TargetAudienceSection: React.FC<TargetAudienceSectionProps> = ({ data, onChange }) => {
  const header = data?.header || defaultHeader;
  const industries = data?.industries || defaultIndustries;
  const cta = data?.cta || defaultCTA;
  const modals = data?.modals || defaultTargetAudienceModals;

  const handlers = useTargetAudienceHandlers(
    { header, industries, cta, modals },
    onChange
  );

  return (
    <div className="space-y-8 relative">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => handlers.setActiveTab('industries')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[var(--radius-brand-button)] font-bold text-sm transition-all ${
            handlers.activeTab === 'industries' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <LayoutTemplate size={16} />
          Branże (Karty)
        </button>
        <button
          onClick={() => handlers.setActiveTab('modals')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[var(--radius-brand-button)] font-bold text-sm transition-all ${
            handlers.activeTab === 'modals' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Database size={16} />
          Baza Modali ({modals.length})
        </button>
      </div>

      {handlers.activeTab === 'industries' ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Nagłówek Sekcji */}
          <TargetAudienceHeader 
            title={header.title}
            description={header.description}
            onChange={handlers.handleUpdateHeader}
          />

          {/* Branże (Karty) */}
          <div className="bg-[#0f172a] rounded-[var(--radius-brand-button)] p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Branże (Karty)</h3>
              <button
                onClick={handlers.handleAddIndustry}
                className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-bold text-sm hover:bg-brand-light-blue transition-colors"
              >
                <Plus size={16} /> Dodaj Branżę
              </button>
            </div>

            <div className="space-y-4">
              {industries.map((industry, index) => (
                <TargetAudienceIndustryItem 
                  key={industry.id}
                  industry={industry}
                  index={index}
                  totalCount={industries.length}
                  modals={modals}
                  availableIcons={availableIcons}
                  generatingModalIndex={handlers.generatingModalIndex}
                  onUpdate={(field, value) => handlers.handleUpdateIndustry(index, field, value)}
                  onDelete={() => handlers.handleDeleteIndustry(index)}
                  onMove={(direction) => handlers.handleMoveIndustry(index, direction)}
                  onGenerateAI={() => handlers.handleGenerateModalAI(index)}
                />
              ))}
            </div>
          </div>

          {/* Sekcja CTA */}
          <TargetAudienceCTA 
            title={cta.title}
            description={cta.description}
            buttonText={cta.buttonText}
            onChange={handlers.handleUpdateCTA}
          />
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          <ModalList 
            modals={modals}
            items={industries}
            onAddModal={handlers.handleAddModal}
            onEditModal={handlers.openModalEditor}
            onDeleteModal={handlers.handleDeleteModal}
            onToggleVisibility={handlers.handleToggleModalVisibility}
          />
        </div>
      )}

      {/* Modal Editor Drawer */}
      <ModalEditorDrawer 
        activeModalId={handlers.activeModalId}
        tempModalData={handlers.tempModalData}
        availableIcons={availableIcons}
        onClose={() => handlers.setActiveModalId(null)}
        onSave={handlers.saveModalContent}
        onChange={handlers.setTempModalData}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={!!handlers.modalToDeleteId}
        onClose={() => handlers.setModalToDeleteId(null)}
        onConfirm={handlers.confirmDeleteModal}
        title="Usuń modal"
        description="Czy na pewno chcesz usunąć ten modal? Zniknie on ze wszystkich kart, do których był przypisany. Tej operacji nie można cofnąć."
      />
    </div>
  );
};
