import { ICMSService } from '../interfaces/ICMSService';
import { CMSContent, CMSUpdateResponse } from '../../../views/dashboard/types/cms';
import { SupabaseBlogRepository } from './supabase/SupabaseBlogRepository';
import { SupabasePagesRepository } from './supabase/SupabasePagesRepository';
import { SupabaseSettingsRepository } from './supabase/SupabaseSettingsRepository';

export class SupabaseCMSAdapter implements ICMSService {
  private blogRepo = new SupabaseBlogRepository();
  private pagesRepo = new SupabasePagesRepository();
  private settingsRepo = new SupabaseSettingsRepository();

  async getCMS(): Promise<CMSContent> {
    try {
      console.log('SupabaseCMSAdapter: getCMS called');
      
      const [blog, pages, settings] = await Promise.all([
        this.blogRepo.getBlogPosts(),
        this.pagesRepo.getPages(),
        this.settingsRepo.getSettings()
      ]);

      const fullContent = {
        ...settings.baseConfig,
        blog,
        pages,
        whyUs: settings.whyUs,
        targetAudience: settings.targetAudience,
        footer: settings.footer,
        pageLayout: settings.pageLayout
      };

      return {
        status: 'success',
        full_content: fullContent
      } as unknown as CMSContent; // The interface expects CMSContent, but the implementation was returning { status, full_content }
      // Note: The original implementation returned { status: 'success', full_content: fullContent } 
      // even though the return type was Promise<CMSContent>. We maintain this behavior for compatibility,
      // but it should be addressed in a future refactoring of the ICMSService interface.
    } catch (error) {
      console.error('SupabaseCMSAdapter getCMS error:', error);
      throw error;
    }
  }

  async updateCMS(payload: CMSContent | { data: CMSContent } | { full_content: CMSContent }): Promise<CMSUpdateResponse> {
    try {
      console.log('SupabaseCMSAdapter: updateCMS called');
      const content = ('data' in payload ? payload.data : ('full_content' in payload ? payload.full_content : payload)) as CMSContent;

      await Promise.all([
        content.blog ? this.blogRepo.updateBlogPosts(content.blog) : Promise.resolve(),
        content.pages ? this.pagesRepo.updatePages(content.pages) : Promise.resolve(),
        this.settingsRepo.updateSettings(content)
      ]);

      return { status: 'success' };
    } catch (error) {
      console.error('SupabaseCMSAdapter updateCMS error:', error);
      return { status: 'error', message: 'Failed to update CMS data in Supabase' };
    }
  }

  async initializeCMS(payload: CMSContent | { data: CMSContent } | { full_content: CMSContent }): Promise<CMSUpdateResponse> {
    console.log('SupabaseCMSAdapter: initializeCMS called');
    return this.updateCMS(payload);
  }
}
