import { z } from 'zod';

// Blog Post Schema
export const BlogPostSchema = z.object({
  id: z.string().optional(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string().nullable().optional(),
  content: z.string(),
  image_url: z.string().nullable().optional(),
  image_alt: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  status: z.enum(['published', 'draft']).default('draft'),
  published_at: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
  seo_keywords: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type SupabaseBlogPost = z.infer<typeof BlogPostSchema>;

// Page Schema
export const PageSchema = z.object({
  id: z.string().optional(),
  slug: z.string(),
  title: z.string(),
  content: z.string(),
  is_published: z.boolean().default(false),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
  seo_keywords: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type SupabasePage = z.infer<typeof PageSchema>;

// FAQ Schema
export const FaqSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});
export type SupabaseFaq = z.infer<typeof FaqSchema>;

// Modal Schema
export const ModalSchema = z.object({
  id: z.string(),
  internal_name: z.string(),
  title: z.string(),
  subtitle: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  benefit: z.string().nullable().optional(),
  standard: z.string().nullable().optional(),
  points: z.unknown().nullable().optional(), // JSON array
  is_visible_in_carousel: z.boolean().default(true),
});
export type SupabaseModal = z.infer<typeof ModalSchema>;

// Why Us Card Schema
export const WhyUsCardSchema = z.object({
  id: z.string(),
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  assigned_modal_id: z.string().nullable().optional(),
});
export type SupabaseWhyUsCard = z.infer<typeof WhyUsCardSchema>;

// Target Audience Industry Schema
export const TargetAudienceIndustrySchema = z.object({
  id: z.string(),
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  assigned_modal_id: z.string().nullable().optional(),
});
export type SupabaseTargetAudienceIndustry = z.infer<typeof TargetAudienceIndustrySchema>;
