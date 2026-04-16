import { create } from 'zustand';
import { UISlice, createUISlice } from './slices/uiSlice';
import { BlogSlice, createBlogSlice } from './slices/blogSlice';
import { PagesSlice, createPagesSlice } from './slices/pagesSlice';
import { ImageSlice, createImageSlice } from './slices/imageSlice';
import { AISlice, createAISlice } from './slices/aiSlice';
import { ContentSlice, createContentSlice } from './slices/contentSlice';

export type CMSState = UISlice & BlogSlice & PagesSlice & ImageSlice & AISlice & ContentSlice;

export const useCMSStore = create<CMSState>()((...a) => ({
  ...createUISlice(...a),
  ...createBlogSlice(...a),
  ...createPagesSlice(...a),
  ...createImageSlice(...a),
  ...createAISlice(...a),
  ...createContentSlice(...a),
}));
