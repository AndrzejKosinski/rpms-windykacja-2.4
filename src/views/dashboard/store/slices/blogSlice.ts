import { StateCreator } from 'zustand';
import { CMSState } from '../cmsStore';
import { BlogPost } from '../../types/cms';

export interface BlogSlice {
  blogSearchQuery: string;
  blogStatusFilter: 'all' | 'published' | 'draft';
  selectedPosts: number[];
  isBulkDelete: boolean;
  postToDeleteIdx: number | null;

  setBlogSearchQuery: (query: string) => void;
  setBlogStatusFilter: (filter: 'all' | 'published' | 'draft') => void;
  setSelectedPosts: (posts: number[]) => void;
  setIsBulkDelete: (isBulk: boolean) => void;
  setPostToDeleteIdx: (idx: number | null) => void;

  handleBlogChange: (index: number, field: keyof BlogPost | keyof BlogPost['seo'], value: any, isSeo?: boolean) => void;
  handleAddBlogPost: () => void;
  handleDeleteBlogPost: (index: number) => void;
  handleBulkStatusChange: (status: 'published' | 'draft') => void;
  handleBulkDeleteClick: () => void;
}

export const createBlogSlice: StateCreator<CMSState, [], [], BlogSlice> = (set, get) => ({
  blogSearchQuery: '',
  blogStatusFilter: 'all',
  selectedPosts: [],
  isBulkDelete: false,
  postToDeleteIdx: null,

  setBlogSearchQuery: (query) => set({ blogSearchQuery: query }),
  setBlogStatusFilter: (filter) => set({ blogStatusFilter: filter }),
  setSelectedPosts: (posts) => set({ selectedPosts: posts }),
  setIsBulkDelete: (isBulk) => set({ isBulkDelete: isBulk }),
  setPostToDeleteIdx: (idx) => set({ postToDeleteIdx: idx }),

  handleBlogChange: (index, field, value, isSeo = false) => {
    const { localContent } = get();
    const updated = { ...localContent };
    const updatedBlog = [...(updated.blog || [])];
    const updatedPost = { ...updatedBlog[index] };

    if (isSeo) {
      updatedPost.seo = { ...updatedPost.seo, [field as keyof BlogPost['seo']]: value };
    } else {
      (updatedPost as unknown as Record<string, unknown>)[field] = value;
    }
    
    updatedBlog[index] = updatedPost;
    updated.blog = updatedBlog;
    set({ localContent: updated });
  },

  handleAddBlogPost: () => {
    const { localContent } = get();
    const newId = String(Date.now());
    const newTitle = "Nowy Artykuł";
    const newSlug = newTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const newPost: BlogPost = {
      id: newId,
      slug: newSlug,
      title: newTitle,
      excerpt: "Krótki opis artykułu...",
      content: "Treść artykułu...",
      category: "Porady Prawne",
      author: "Administrator",
      date: new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' }),
      publishedAt: new Date().toISOString().split('T')[0],
      status: 'draft',
      image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800",
      imageAlt: "Nowy artykuł RPMS",
      seo: {
        title: "Nowy Artykuł | RPMS Windykacja",
        description: "Opis SEO nowego artykułu...",
        keywords: "windykacja, prawo"
      }
    };
    
    const updated = { ...localContent };
    updated.blog = [newPost, ...(updated.blog || [])];
    set({ 
      localContent: updated,
      activeSection: 'blog-0',
      activePostIdx: 0
    });
  },

  handleDeleteBlogPost: (index) => {
    set({ postToDeleteIdx: index, showDeleteConfirm: true });
  },

  handleBulkStatusChange: (status) => {
    const { localContent, selectedPosts } = get();
    const updated = { ...localContent };
    selectedPosts.forEach(idx => {
      if (updated.blog && updated.blog[idx]) {
        updated.blog[idx].status = status;
      }
    });
    set({ localContent: updated, selectedPosts: [] });
  },

  handleBulkDeleteClick: () => {
    set({ isBulkDelete: true, showDeleteConfirm: true });
  },
});
