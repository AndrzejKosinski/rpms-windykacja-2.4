import { StateCreator } from 'zustand';
import { CMSState } from '../cmsStore';
import { CMSContent } from '../../types/cms';
import { logError, ErrorContext, ErrorSeverity } from '@/utils/errorLogger';

export interface ContentSlice {
  localContent: CMSContent;
  setLocalContent: (content: CMSContent) => void;
  handleFieldChange: (section: keyof CMSContent, field: string, value: any, subSection?: string) => void;
  confirmDeleteBlogPost: () => void;
  handleSave: (onSaveCallback: (content: CMSContent) => Promise<void> | void) => Promise<void>;
}

export const createContentSlice: StateCreator<CMSState, [], [], ContentSlice> = (set, get) => ({
  // ... (rest of the slice remains the same)
  localContent: {
    blog: [],
    pages: [],
    pageLayout: []
  } as CMSContent,

  setLocalContent: (content) => set({ localContent: content }),

  handleFieldChange: (section, field, value, subSection) => {
    const { localContent } = get();
    const updated = { ...localContent };
    
    if (!updated[section]) {
      if (['blog', 'pages', 'pageLayout'].includes(section as string)) {
        (updated as any)[section] = [];
      } else {
        (updated as any)[section] = {};
      }
    }

    const sectionData = updated[section] as Record<string, unknown>;

    if (subSection) {
      if (!sectionData[subSection]) {
        sectionData[subSection] = {};
      }
      (sectionData[subSection] as Record<string, unknown>)[field] = value;
    } else {
      sectionData[field] = value;
    }
    set({ localContent: updated });
  },

  confirmDeleteBlogPost: () => {
    const state = get();
    const { isBulkDelete, isBulkPageDelete, pageToDeleteIdx, postToDeleteIdx, localContent, selectedPosts, selectedPages } = state;
    
    if (isBulkDelete) {
      const updated = { ...localContent };
      updated.blog = (updated.blog || []).filter((_: any, i: number) => !selectedPosts.includes(i));
      set({ 
        localContent: updated,
        selectedPosts: [],
        showDeleteConfirm: false,
        isBulkDelete: false,
        saveStatus: 'success'
      });
      setTimeout(() => set({ saveStatus: 'idle' }), 3000);
      return;
    }

    if (isBulkPageDelete) {
      const updated = { ...localContent };
      if (updated.pages) {
        updated.pages = updated.pages.filter((_: any, i: number) => !selectedPages.includes(i));
        set({ localContent: updated });
      }
      set({ 
        selectedPages: [],
        showDeleteConfirm: false,
        isBulkPageDelete: false,
        saveStatus: 'success'
      });
      setTimeout(() => set({ saveStatus: 'idle' }), 3000);
      return;
    }

    if (pageToDeleteIdx !== null) {
      const updated = { ...localContent };
      if (updated.pages) {
        updated.pages = updated.pages.filter((_: any, i: number) => i !== pageToDeleteIdx);
        set({ localContent: updated });
      }
      set({ 
        activeSection: 'pages-list',
        showDeleteConfirm: false,
        pageToDeleteIdx: null,
        saveStatus: 'success'
      });
      setTimeout(() => set({ saveStatus: 'idle' }), 3000);
      return;
    }

    if (postToDeleteIdx === null) return;
    
    const updated = { ...localContent };
    updated.blog = (updated.blog || []).filter((_: any, i: number) => i !== postToDeleteIdx);
    set({ 
      localContent: updated,
      activeSection: 'blog-list',
      showDeleteConfirm: false,
      postToDeleteIdx: null,
      saveStatus: 'success'
    });
    setTimeout(() => set({ saveStatus: 'idle' }), 3000);
  },

  handleSave: async (onSaveCallback) => {
    set({ isSaving: true, saveStatus: 'idle' });
    try {
      await onSaveCallback(get().localContent);
      set({ isSaving: false, saveStatus: 'success' });
      setTimeout(() => set({ saveStatus: 'idle' }), 3000);
    } catch (error) {
      await logError({
        message: 'Failed to save CMS content from UI',
        context: ErrorContext.UI,
        severity: ErrorSeverity.ERROR,
        error
      });
      set({ isSaving: false, saveStatus: 'error' });
      setTimeout(() => set({ saveStatus: 'idle' }), 3000);
    }
  }
});
