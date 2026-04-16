import { useState } from 'react';
import { ModalDefinition } from './WhyUsTypes';
import { TargetAudienceData, TargetAudienceHeaderData, TargetAudienceIndustry, TargetAudienceCTAData } from './TargetAudienceTypes';
import { generateWhyUsModal } from '../../../../services/geminiService';

export const useTargetAudienceHandlers = (
  data: TargetAudienceData,
  onChange: (field: string, value: any) => void
) => {
  const [activeTab, setActiveTab] = useState<'industries' | 'modals'>('industries');
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [modalToDeleteId, setModalToDeleteId] = useState<string | null>(null);
  const [tempModalData, setTempModalData] = useState<Partial<ModalDefinition>>({});
  const [generatingModalIndex, setGeneratingModalIndex] = useState<number | null>(null);

  const handleUpdateHeader = (field: keyof TargetAudienceHeaderData, value: string) => {
    onChange('header', { ...data.header, [field]: value });
  };

  const handleUpdateCTA = (field: keyof TargetAudienceCTAData, value: string) => {
    onChange('cta', { ...data.cta, [field]: value });
  };

  const handleAddIndustry = () => {
    const newIndustries = [...(data.industries || []), { 
      id: `new_${Date.now()}`, 
      icon: 'Briefcase', 
      title: 'Nowa Branża', 
      subtitle: 'Podtytuł', 
      desc: 'Opis...', 
      tag: 'Tag' 
    }];
    onChange('industries', newIndustries);
  };

  const handleUpdateIndustry = (index: number, field: keyof TargetAudienceIndustry, value: string) => {
    const newIndustries = [...(data.industries || [])];
    newIndustries[index] = { ...newIndustries[index], [field]: value };
    onChange('industries', newIndustries);
  };

  const handleDeleteIndustry = (index: number) => {
    const newIndustries = (data.industries || []).filter((_, i) => i !== index);
    onChange('industries', newIndustries);
  };

  const handleMoveIndustry = (index: number, direction: 'up' | 'down') => {
    const industries = data.industries || [];
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === industries.length - 1) return;

    const newIndustries = [...industries];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newIndustries[index], newIndustries[targetIndex]] = [newIndustries[targetIndex], newIndustries[index]];
    onChange('industries', newIndustries);
  };

  const handleGenerateModalAI = async (index: number) => {
    const industries = data.industries || [];
    const industry = industries[index];
    if (!industry.title || !industry.desc) {
      alert('Proszę najpierw uzupełnić tytuł i opis branży.');
      return;
    }

    setGeneratingModalIndex(index);

    try {
      const generatedData = await generateWhyUsModal(industry.title, industry.desc);
      const modalId = `ai_modal_${Date.now()}`;
      
      const newModal: ModalDefinition = {
        id: modalId,
        internalName: `AI: ${industry.title}`,
        title: generatedData.title,
        subtitle: generatedData.subtitle,
        icon: industry.icon || 'Briefcase',
        benefit: generatedData.benefit,
        standard: generatedData.standard,
        points: generatedData.points,
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
        isVisibleInCarousel: true,
        sectionType: 'target_audience'
      };

      onChange('modals', [...(data.modals || []), newModal]);
      handleUpdateIndustry(index, 'assignedModalId', modalId);

      alert('Modal został wygenerowany i podłączony do branży!');
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
      icon: 'Briefcase',
      benefit: 'Główna korzyść...',
      standard: 'Standard operacyjny...',
      points: ['Punkt 1', 'Punkt 2'],
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
      isVisibleInCarousel: true,
      sectionType: 'target_audience'
    };
    onChange('modals', [...(data.modals || []), newModal]);
    setTempModalData(newModal);
    setActiveModalId(newModal.id);
  };

  const handleDeleteModal = (modalId: string) => {
    setModalToDeleteId(modalId);
  };

  const handleToggleModalVisibility = (modalId: string, isVisible: boolean) => {
    const updatedModals = (data.modals || []).map(m => 
      m.id === modalId ? { ...m, isVisibleInCarousel: isVisible } : m
    );
    onChange('modals', updatedModals);
  };

  const confirmDeleteModal = () => {
    if (modalToDeleteId) {
      onChange('modals', (data.modals || []).filter(m => m.id !== modalToDeleteId));
      const newIndustries = (data.industries || []).map(i => i.assignedModalId === modalToDeleteId ? { ...i, assignedModalId: "" } : i);
      onChange('industries', newIndustries);
      setModalToDeleteId(null);
    }
  };

  const openModalEditor = (modalId: string) => {
    const modals = data.modals || [];
    const modal = modals.find(m => m.id === modalId) || modals[0];
    if (modal) {
      setTempModalData(modal);
      setActiveModalId(modalId);
    }
  };

  const saveModalContent = () => {
    if (activeModalId) {
      const newModals = (data.modals || []).map(m => m.id === activeModalId ? { ...m, ...tempModalData } as ModalDefinition : m);
      onChange('modals', newModals);
      setActiveModalId(null);
    }
  };

  return {
    activeTab,
    setActiveTab,
    activeModalId,
    setActiveModalId,
    modalToDeleteId,
    setModalToDeleteId,
    tempModalData,
    setTempModalData,
    generatingModalIndex,
    handleUpdateHeader,
    handleUpdateCTA,
    handleAddIndustry,
    handleUpdateIndustry,
    handleDeleteIndustry,
    handleMoveIndustry,
    handleGenerateModalAI,
    handleAddModal,
    handleDeleteModal,
    handleToggleModalVisibility,
    confirmDeleteModal,
    openModalEditor,
    saveModalContent
  };
};
