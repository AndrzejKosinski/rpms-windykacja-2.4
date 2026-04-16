import { StateCreator } from 'zustand';
import { CMSState } from '../cmsStore';

export interface UISlice {
  activeSection: string;
  isSaving: boolean;
  saveStatus: 'idle' | 'success' | 'error';
  previewMode: 'desktop' | 'mobile';
  editorTab: 'edit' | 'preview';
  showDeleteConfirm: boolean;
  
  setActiveSection: (section: string) => void;
  setIsSaving: (isSaving: boolean) => void;
  setSaveStatus: (status: 'idle' | 'success' | 'error') => void;
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  setEditorTab: (tab: 'edit' | 'preview') => void;
  setShowDeleteConfirm: (show: boolean) => void;
}

export const createUISlice: StateCreator<CMSState, [], [], UISlice> = (set) => ({
  activeSection: 'overview',
  isSaving: false,
  saveStatus: 'idle',
  previewMode: 'desktop',
  editorTab: 'edit',
  showDeleteConfirm: false,

  setActiveSection: (section) => set({ activeSection: section }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setSaveStatus: (status) => set({ saveStatus: status }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  setEditorTab: (tab) => set({ editorTab: tab }),
  setShowDeleteConfirm: (show) => set({ showDeleteConfirm: show }),
});
