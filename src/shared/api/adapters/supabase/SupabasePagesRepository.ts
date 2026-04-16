import { supabase } from '../../supabaseClient';
import { Page } from '../../../../views/dashboard/types/cms';

export class SupabasePagesRepository {
  async getPages() {
    const { data: pages } = await supabase.from('pages').select('*');

    return (pages || []).map(p => ({
      id: p.slug,
      slug: p.slug,
      title: p.title,
      content: p.content,
      isPublished: p.is_published || false,
      createdAt: p.created_at,
      seo: {
        title: p.seo_title || '',
        description: p.seo_description || '',
        keywords: p.seo_keywords || ''
      }
    }));
  }

  async updatePages(pages: Page[]) {
    for (const p of pages) {
      const { error } = await supabase.from('pages').upsert({
        slug: p.slug || p.id,
        title: p.title,
        content: p.content,
        seo_title: p.seo?.title || '',
        seo_description: p.seo?.description || ''
      }, { onConflict: 'slug' });
      if (error) console.error('Error saving page:', error);
    }
  }
}
