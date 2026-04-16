import { StateCreator } from 'zustand';
import { CMSState } from '../cmsStore';
import { Page } from '../../types/cms';

export interface PagesSlice {
  pageSearchQuery: string;
  pageStatusFilter: 'all' | 'published' | 'draft';
  selectedPages: number[];
  isBulkPageDelete: boolean;
  pageToDeleteIdx: number | null;

  setPageSearchQuery: (query: string) => void;
  setPageStatusFilter: (filter: 'all' | 'published' | 'draft') => void;
  setSelectedPages: (pages: number[]) => void;
  setIsBulkPageDelete: (isBulk: boolean) => void;
  setPageToDeleteIdx: (idx: number | null) => void;

  handleAddPage: () => void;
  handlePageChange: (index: number, field: keyof Page | keyof Page['seo'], value: any, isSeo?: boolean) => void;
  handleDeletePage: (index: number) => void;
  handleBulkPageStatusChange: (status: boolean) => void;
  handleBulkPageDeleteClick: () => void;
}

export const createPagesSlice: StateCreator<CMSState, [], [], PagesSlice> = (set, get) => ({
  pageSearchQuery: '',
  pageStatusFilter: 'all',
  selectedPages: [],
  isBulkPageDelete: false,
  pageToDeleteIdx: null,

  setPageSearchQuery: (query) => set({ pageSearchQuery: query }),
  setPageStatusFilter: (filter) => set({ pageStatusFilter: filter }),
  setSelectedPages: (pages) => set({ selectedPages: pages }),
  setIsBulkPageDelete: (isBulk) => set({ isBulkPageDelete: isBulk }),
  setPageToDeleteIdx: (idx) => set({ pageToDeleteIdx: idx }),

  handleAddPage: () => {
    const { localContent } = get();
    const newId = `page_${Date.now()}`;
    const newTitle = "Nowa Podstrona";
    const newSlug = newTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const newPage: Page = {
      id: newId,
      slug: newSlug,
      title: newTitle,
      content: "Treść nowej podstrony...",
      seo: {
        title: newTitle,
        description: "",
        keywords: ""
      },
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updated = { ...localContent };
    if (!updated.pages) updated.pages = [];
    updated.pages = [newPage, ...updated.pages];
    set({ 
      localContent: updated,
      activeSection: 'page-0',
      activePageIdx: 0
    });
  },

  handlePageChange: (index, field, value, isSeo = false) => {
    const { localContent } = get();
    const updated = { ...localContent };
    if (!updated.pages) return;
    
    const updatedPages = [...updated.pages];
    const updatedPage = { ...updatedPages[index] };

    if (isSeo) {
      updatedPage.seo = { ...updatedPage.seo, [field as keyof Page['seo']]: value };
    } else {
      (updatedPage as unknown as Record<string, unknown>)[field] = value;
    }
    
    updatedPage.updatedAt = new Date().toISOString();
    updatedPages[index] = updatedPage;
    updated.pages = updatedPages;
    set({ localContent: updated });
  },

  handleDeletePage: (index) => {
    set({ 
      pageToDeleteIdx: index,
      isBulkPageDelete: false,
      showDeleteConfirm: true
    });
  },

  handleBulkPageStatusChange: (status) => {
    const { localContent, selectedPages } = get();
    const updated = { ...localContent };
    if (!updated.pages) return;
    selectedPages.forEach(idx => {
      if (updated.pages![idx]) {
        updated.pages![idx].isPublished = status;
      }
    });
    set({ localContent: updated, selectedPages: [] });
  },

  handleBulkPageDeleteClick: () => {
    set({ isBulkPageDelete: true, showDeleteConfirm: true });
  },
});
