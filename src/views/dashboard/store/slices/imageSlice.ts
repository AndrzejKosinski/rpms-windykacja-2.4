import { StateCreator } from 'zustand';
import { CMSState } from '../cmsStore';

export interface ImageSlice {
  showImagePicker: boolean;
  activePostIdx: number | null;
  activePageIdx: number | null;
  unsplashQuery: string;
  unsplashResults: any[];
  isSearchingImages: boolean;

  setShowImagePicker: (show: boolean) => void;
  setActivePostIdx: (idx: number | null) => void;
  setActivePageIdx: (idx: number | null) => void;
  setUnsplashQuery: (query: string) => void;
  setUnsplashResults: (results: any[]) => void;
  setIsSearchingImages: (isSearching: boolean) => void;

  searchUnsplash: () => Promise<void>;
  selectUnsplashImage: (url: string) => void;
}

export const createImageSlice: StateCreator<CMSState, [], [], ImageSlice> = (set, get) => ({
  showImagePicker: false,
  activePostIdx: null,
  activePageIdx: null,
  unsplashQuery: 'business law',
  unsplashResults: [],
  isSearchingImages: false,

  setShowImagePicker: (show) => set({ showImagePicker: show }),
  setActivePostIdx: (idx) => set({ activePostIdx: idx }),
  setActivePageIdx: (idx) => set({ activePageIdx: idx }),
  setUnsplashQuery: (query) => set({ unsplashQuery: query }),
  setUnsplashResults: (results) => set({ unsplashResults: results }),
  setIsSearchingImages: (isSearching) => set({ isSearchingImages: isSearching }),

  searchUnsplash: async () => {
    const { unsplashQuery } = get();
    
    set({ isSearchingImages: true });
    try {
      const response = await fetch(`/api/unsplash?query=${encodeURIComponent(unsplashQuery)}&per_page=12`);
      const data = await response.json();
      
      if (data.error) {
        console.error("Unsplash Proxy Error:", data.error);
        set({ unsplashResults: [] });
        return;
      }
      
      set({ unsplashResults: data.results || [] });
    } catch (err) {
      console.error("Błąd połączenia z API Unsplash:", err);
    } finally {
      set({ isSearchingImages: false });
    }
  },

  selectUnsplashImage: (url) => {
    const { activePostIdx } = get();
    if (activePostIdx !== null) {
      get().handleBlogChange(activePostIdx, 'image', url);
      set({ showImagePicker: false });
    }
  },
});
