import { StateCreator } from 'zustand';
import { CMSState } from '../cmsStore';
import { SEOOptimizationResult } from '../../types/cms';
import { optimizeSEO } from '../../../../services/geminiService';
import { logError, ErrorContext, ErrorSeverity } from '@/utils/errorLogger';

export interface AISlice {
  aiReviewData: SEOOptimizationResult | null;
  showAIReview: boolean;
  selectedAIFields: Record<string, boolean>;
  isOptimizing: boolean;

  setAiReviewData: (data: SEOOptimizationResult | null) => void;
  setShowAIReview: (show: boolean) => void;
  setSelectedAIFields: (fields: Record<string, boolean>) => void;
  setIsOptimizing: (isOptimizing: boolean) => void;

  handleAIOptimize: (idx: number) => Promise<void>;
  applyAIChanges: () => void;
}

export const createAISlice: StateCreator<CMSState, [], [], AISlice> = (set, get) => ({
  // ... (rest of the slice remains the same)
  aiReviewData: null,
  showAIReview: false,
  selectedAIFields: {
    title: true,
    description: true,
    keywords: true,
    slug: true,
    imageAlt: true,
    excerpt: true,
    faqs: true
  },
  isOptimizing: false,

  setAiReviewData: (data) => set({ aiReviewData: data }),
  setShowAIReview: (show) => set({ showAIReview: show }),
  setSelectedAIFields: (fields) => set({ selectedAIFields: fields }),
  setIsOptimizing: (isOptimizing) => set({ isOptimizing }),

  handleAIOptimize: async (idx) => {
    const { localContent } = get();
    const post = localContent.blog?.[idx];
    if (!post || !post.content || post.content.length < 50) {
      // alert is discouraged in iframe, but this is a quick fix for now
      // ideally we should use a custom modal
      console.warn("Artykuł jest zbyt krótki, aby AI mogło go zoptymalizować.");
      return;
    }

    set({ isOptimizing: true, activePostIdx: idx });
    try {
      const result = await optimizeSEO(post.title, post.content);
      set({ aiReviewData: result, showAIReview: true });
    } catch (err) {
      await logError({
        message: 'AI SEO Optimization failed',
        context: ErrorContext.AI,
        severity: ErrorSeverity.ERROR,
        error: err,
        metadata: { postTitle: post.title }
      });
      // alert is discouraged, but keeping it for now as per original code
      // will be replaced by centralized UI notifications in the future
    } finally {
      set({ isOptimizing: false });
    }
  },

  applyAIChanges: () => {
    const { aiReviewData, activePostIdx, localContent, selectedAIFields } = get();
    if (!aiReviewData || activePostIdx === null) return;

    const updated = { ...localContent };
    const currentPost = updated.blog![activePostIdx];
    const result = aiReviewData;

    updated.blog![activePostIdx] = {
      ...currentPost,
      slug: selectedAIFields.slug ? result.slug : currentPost.slug,
      imageAlt: selectedAIFields.imageAlt ? result.imageAlt : currentPost.imageAlt,
      excerpt: selectedAIFields.excerpt ? result.excerpt : currentPost.excerpt,
      jsonLd: result.jsonLd,
      faqs: selectedAIFields.faqs ? result.faqs : currentPost.faqs,
      seo: {
        title: selectedAIFields.title ? result.title : currentPost.seo.title,
        description: selectedAIFields.description ? result.description : currentPost.seo.description,
        keywords: selectedAIFields.keywords ? result.keywords : currentPost.seo.keywords
      }
    };

    set({ 
      localContent: updated,
      showAIReview: false,
      aiReviewData: null,
      saveStatus: 'success'
    });
    setTimeout(() => set({ saveStatus: 'idle' }), 3000);
  },
});
