import { AppsScriptCMSAdapter } from '@/shared/api/adapters/AppsScriptCMSAdapter';
import { supabase } from '@/shared/api/supabaseClient';

export interface MigrationCallbacks {
  onLog: (message: string) => void;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

interface OldModal {
  id: string;
  internalName?: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  imageUrl?: string;
  image?: string;
  benefit?: string;
  standard?: string;
  points?: string[];
  isVisibleInCarousel?: boolean;
  section_type?: string;
}

interface OldCard {
  id: string;
  icon?: string;
  title?: string;
  desc?: string;
  description?: string;
  assignedModalId?: string;
  subtitle?: string;
  tag?: string;
}

interface OldFooterLink {
  id?: string;
  label?: string;
  url?: string;
  isExternal?: boolean;
}

interface OldFooterColumn {
  id?: string;
  title?: string;
  links?: OldFooterLink[];
}

interface OldFooter {
  columns?: OldFooterColumn[];
  socialMedia?: Record<string, string>;
  brandDescription?: string;
  copyrightText?: string;
  address?: string;
  bottomBarLinks?: OldFooterLink[];
}

interface OldBlogPost {
  id?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  imageUrl?: string;
  image?: string;
  date?: string;
  author?: string;
  category?: string;
  status?: string;
  imageAlt?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  faqs?: { question: string; answer: string }[];
}

interface OldPage {
  id?: string;
  slug?: string;
  title?: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export class MigrationService {
  private parsePolishDate(dateStr?: string): string {
    if (!dateStr) return new Date().toISOString();
    const months: Record<string, string> = {
      'Sty': '01', 'Lut': '02', 'Mar': '03', 'Kwi': '04', 'Maj': '05', 'Cze': '06',
      'Lip': '07', 'Sie': '08', 'Wrz': '09', 'Paź': '10', 'Lis': '11', 'Gru': '12'
    };
    try {
      const parts = dateStr.split(' ');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = months[parts[1]] || '01';
        const year = parts[2];
        const parsed = new Date(`${year}-${month}-${day}T00:00:00Z`);
        if (!isNaN(parsed.getTime())) return parsed.toISOString();
      }
      const fallback = new Date(dateStr);
      if (!isNaN(fallback.getTime())) return fallback.toISOString();
      return new Date().toISOString();
    } catch (e) {
      return new Date().toISOString();
    }
  }

  // Funkcja pomocnicza do pobierania sekcji niezależnie od wielkości liter i podkreślników
  private getSection(obj: Record<string, unknown>, key: string) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    const lowerKey = key.toLowerCase();
    return (obj[key] || obj[snakeKey] || obj[lowerKey] || {}) as Record<string, unknown>;
  }

  async runMigration(callbacks: MigrationCallbacks): Promise<void> {
    const { onLog, onSuccess, onError } = callbacks;

    try {
      const gasCms = new AppsScriptCMSAdapter();
      onLog('Pobieranie danych z Google Sheets...');
      const data = await gasCms.getCMS();
      
      if ((data as unknown as { status: string }).status === 'CMS_NOT_INITIALIZED') {
        throw new Error('Baza GAS nie jest zainicjalizowana.');
      }

      // The adapter returns CMSContent, but the old code expected { full_content: ... }
      // We need to handle both cases depending on how AppsScriptCMSAdapter is currently implemented.
      const content = ('full_content' in data ? data.full_content : data) as Record<string, unknown>;
      console.log('[DEBUG] Pełna treść z GAS:', content);
      onLog('Dane pobrane pomyślnie. Znalezione klucze: ' + Object.keys(content).join(', '));

      const whyUsData = this.getSection(content, 'whyUs');
      const targetAudienceData = this.getSection(content, 'targetAudience');

      // Normalizacja nagłówków
      const whyUsHeader = {
        title: (whyUsData.header as Record<string, unknown>)?.title || whyUsData.title || "Dlaczego firmy wybierają nas,[br]gdy liczy się [blue]efekt[/blue]?",
        description: (whyUsData.header as Record<string, unknown>)?.description || whyUsData.description || "Zapewniamy wsparcie, które łączy dynamikę biznesową z najwyższym standardem obsługi prawnej."
      };

      const taHeader = {
        title: (targetAudienceData.header as Record<string, unknown>)?.title || targetAudienceData.title || "Płynność finansowa[br]nie jest [blue]przypadkiem[/blue]",
        description: (targetAudienceData.header as Record<string, unknown>)?.description || targetAudienceData.description || "W Polsce sektor MŚP to serce gospodarki, ale też obszar najbardziej narażony na zatory."
      };

      // 1. Migracja Modali
      const whyUsModals = ((whyUsData.modals as OldModal[]) || []).map((m) => ({ ...m, section_type: 'why_us' }));
      const taModals = ((targetAudienceData.modals as OldModal[]) || []).map((m) => ({ 
        ...m, 
        id: m.id.startsWith('ta_') ? m.id : `ta_${m.id}`,
        section_type: 'target_audience' 
      }));
      const globalModals = ((content.modals as OldModal[]) || []).map((m) => ({ ...m, section_type: 'why_us' }));
      
      const allModals = [...whyUsModals, ...taModals, ...globalModals];
      
      if (allModals.length > 0) {
        onLog(`Czyszczenie i migracja ${allModals.length} modali (z podziałem na sekcje)...`);
        await supabase.from('modals').delete().neq('id', '_none_');
        
        let modalErrors = 0;
        for (const m of allModals) {
          const { error } = await supabase.from('modals').upsert(
            {
              id: m.id,
              section_type: m.section_type,
              internal_name: m.internalName || m.id || 'unknown',
              title: m.title || '',
              subtitle: m.subtitle || '',
              icon: m.icon || '',
              image_url: m.imageUrl || m.image || '',
              benefit: m.benefit || '',
              standard: m.standard || '',
              points: m.points || [],
              is_visible_in_carousel: m.isVisibleInCarousel || false
            },
            { onConflict: 'id' }
          );
          if (error) {
            console.error('Modal error:', error.message, error.details, error.hint);
            modalErrors++;
          }
        }
        onLog(`Modale zmigrowane (Błędy: ${modalErrors}).`);
      }

      // 1.5 Migracja Why Us Cards
      const whyUsCards = (whyUsData.cards || whyUsData.industries) as OldCard[];
      if (whyUsCards && Array.isArray(whyUsCards)) {
        onLog(`Czyszczenie i migracja ${whyUsCards.length} kart Why Us...`);
        await supabase.from('why_us_cards').delete().neq('id', '_none_');
        
        let whyUsErrors = 0;
        for (const c of whyUsCards) {
          const { error } = await supabase.from('why_us_cards').upsert(
            {
              id: c.id,
              icon: c.icon || '',
              title: c.title || '',
              description: c.desc || c.description || '',
              assigned_modal_id: c.assignedModalId || null
            },
            { onConflict: 'id' }
          );
          if (error) {
            console.error('Why Us Card error:', error.message, error.details, error.hint);
            whyUsErrors++;
          }
        }
        onLog(`Karty Why Us zmigrowane (Błędy: ${whyUsErrors}).`);
      }

      // 1.6 Migracja Target Audience Industries
      let taIndustries = (targetAudienceData.industries || targetAudienceData.cards || targetAudienceData.items) as OldCard[];
      
      if (!taIndustries && Array.isArray(targetAudienceData)) {
        taIndustries = targetAudienceData as OldCard[];
      }

      if (taIndustries && Array.isArray(taIndustries)) {
        onLog(`Czyszczenie i migracja ${taIndustries.length} branż Target Audience...`);
        await supabase.from('target_audience_industries').delete().neq('id', '_none_');
        
        let taErrors = 0;
        for (const ind of taIndustries) {
          const modalId = ind.assignedModalId;
          const normalizedModalId = modalId ? (modalId.startsWith('ta_') ? modalId : `ta_${modalId}`) : null;

          const { error } = await supabase.from('target_audience_industries').upsert(
            {
              id: ind.id || `ta_${Math.random().toString(36).substr(2, 9)}`,
              icon: ind.icon || '',
              title: ind.title || '',
              subtitle: ind.subtitle || '',
              description: ind.desc || ind.description || '',
              tag: ind.tag || '',
              assigned_modal_id: normalizedModalId
            },
            { onConflict: 'id' }
          );
          if (error) {
            console.error('Target Audience error:', error.message, error.details, error.hint);
            taErrors++;
          }
        }
        onLog(`Branże Target Audience zmigrowane (Błędy: ${taErrors}).`);
      } else {
        onLog('UWAGA: Nie znaleziono branż w Target Audience.');
      }

      // 2. Migracja Global Settings
      if (content) {
        onLog('Migracja globalnych ustawień (w tym Partnerzy i CTA)...');
        const { 
          blog, pages, 
          whyUs, why_us, whyus,
          targetAudience, target_audience, targetaudience,
          footer, pageLayout, modals, faq, 
          ...restConfig 
        } = content;
        
        const restConfigRec = restConfig as Record<string, unknown>;
        const configToSave = {
          ...restConfig,
          trustBar: content.trustBar || content.trust_bar || restConfigRec.trustBar,
          whyUs: { 
            ...(restConfigRec.whyUs as Record<string, unknown> || {}), 
            header: whyUsHeader,
            modalsHeader: whyUsData.modalsHeader
          },
          targetAudience: { 
            ...(restConfigRec.targetAudience as Record<string, unknown> || {}), 
            header: taHeader,
            cta: targetAudienceData.cta || (restConfigRec.targetAudience as Record<string, unknown>)?.cta,
            modalsHeader: targetAudienceData.modalsHeader
          },
          footer: { 
            ...(restConfigRec.footer as Record<string, unknown> || {}),
            socialMedia: (content.footer as OldFooter)?.socialMedia,
            brandDescription: (content.footer as OldFooter)?.brandDescription,
            copyrightText: (content.footer as OldFooter)?.copyrightText,
            address: (content.footer as OldFooter)?.address,
            bottomBarLinks: (content.footer as OldFooter)?.bottomBarLinks
          }
        };

        if ((configToSave.trustBar as Record<string, unknown>)?.logos) {
          onLog(`Synchronizacja ${((configToSave.trustBar as Record<string, unknown>).logos as unknown[]).length} partnerów w trustBar.`);
        }

        const { error } = await supabase.from('global_settings').upsert(
          { id: 1, config: configToSave },
          { onConflict: 'id' }
        );
        if (error) onLog(`Błąd ustawień: ${error.message}`);
        else onLog('Ustawienia globalne zmigrowane.');
      }

      // 2.5 Migracja DDS Config
      if (content.pageLayout) {
        onLog('Migracja konfiguracji DDS...');
        const { error } = await supabase.from('dds_config').upsert(
          { id: '1', version: 1, theme_data: content.pageLayout, is_active: true },
          { onConflict: 'id' }
        );
        if (error) onLog(`Błąd DDS: ${error.message}`);
        else onLog('DDS zmigrowane.');
      }

      // 3. Migracja Blog Posts
      if (content.blog && Array.isArray(content.blog)) {
        onLog(`Czyszczenie i migracja ${content.blog.length} artykułów bloga...`);
        await supabase.from('blog_posts').delete().neq('slug', '_none_');
        await supabase.from('blog_faqs').delete().neq('id', '_none_');
        
        let blogErrors = 0;
        let faqErrors = 0;
        let faqCount = 0;
        for (const p of (content.blog as OldBlogPost[])) {
          const { error } = await supabase.from('blog_posts').upsert(
            {
              slug: p.slug || p.id || 'unknown',
              title: p.title || '',
              excerpt: p.excerpt || '',
              content: p.content || '',
              image_url: p.imageUrl || p.image || '',
              published_at: this.parsePolishDate(p.date),
              author: p.author || 'Admin',
              category: p.category || '',
              status: p.status || 'published',
              image_alt: p.imageAlt || '',
              seo_title: p.seo?.title || '',
              seo_description: p.seo?.description || '',
              seo_keywords: p.seo?.keywords || ''
            },
            { onConflict: 'slug' }
          );
          if (error) {
            console.error('Blog error:', error);
            blogErrors++;
          }

          // 4. Migracja FAQ z bloga
          if (p.faqs && Array.isArray(p.faqs)) {
            faqCount += p.faqs.length;
            for (let i = 0; i < p.faqs.length; i++) {
              const f = p.faqs[i];
              const { error: faqError } = await supabase.from('blog_faqs').upsert(
                {
                  id: `${p.slug}-faq-${i}`,
                  question: f.question || '',
                  answer: f.answer || ''
                },
                { onConflict: 'id' }
              );
              if (faqError) {
                console.error('FAQ error:', faqError);
                faqErrors++;
              }
            }
          }
        }
        onLog(`Blog zmigrowany (Błędy: ${blogErrors}).`);
        if (faqCount > 0) {
          onLog(`FAQ zmigrowane: ${faqCount} (Błędy: ${faqErrors}).`);
        }
      }

      // 5. Migracja Pages
      if (content.pages && Array.isArray(content.pages)) {
        onLog(`Czyszczenie i migracja ${content.pages.length} podstron...`);
        await supabase.from('pages').delete().neq('slug', '_none_');
        
        let pagesErrors = 0;
        for (const p of (content.pages as OldPage[])) {
          const { error } = await supabase.from('pages').upsert(
            {
              slug: p.slug || p.id || 'unknown',
              title: p.title || '',
              content: p.content || '',
              seo_title: p.seo?.title || p.seoTitle || '',
              seo_description: p.seo?.description || p.seoDescription || '',
              seo_keywords: p.seo?.keywords || '',
              is_published: p.isPublished !== undefined ? p.isPublished : true,
              created_at: p.createdAt || new Date().toISOString(),
              updated_at: p.updatedAt || new Date().toISOString()
            },
            { onConflict: 'slug' }
          );
          if (error) {
            console.error('Pages error:', error);
            pagesErrors++;
          }
        }
        onLog(`Podstrony zmigrowane (Błędy: ${pagesErrors}).`);
      }

      // 6. Migracja Footer
      if (content.footer && (content.footer as OldFooter).columns) {
        const footerCols = (content.footer as OldFooter).columns || [];
        onLog(`Czyszczenie i migracja stopki (${footerCols.length} kolumn)...`);
        await supabase.from('footer_links').delete().neq('id', '_none_');
        await supabase.from('footer_columns').delete().neq('id', '_none_');
        
        let footerErrors = 0;
        for (const col of footerCols) {
          const colId = col.id || `col_${Date.now()}_${Math.random()}`;
          const { error: colError } = await supabase.from('footer_columns').upsert(
            {
              id: colId,
              title: col.title || ''
            },
            { onConflict: 'id' }
          );
          if (colError) {
            console.error('Footer column error:', colError);
            footerErrors++;
          } else if (col.links && Array.isArray(col.links)) {
            for (const link of col.links) {
              const { error: linkError } = await supabase.from('footer_links').upsert(
                {
                  id: link.id || `link_${Date.now()}_${Math.random()}`,
                  column_id: colId,
                  label: link.label || '',
                  url: link.url || '',
                  is_external: link.isExternal || false
                },
                { onConflict: 'id' }
              );
              if (linkError) {
                console.error('Footer link error:', linkError);
                footerErrors++;
              }
            }
          }
        }
        onLog(`Stopka zmigrowana (Błędy: ${footerErrors}).`);
      }

      onLog('Migracja zakończona pomyślnie!');
      onSuccess();
    } catch (err: unknown) {
      console.error(err);
      const error = err instanceof Error ? err : new Error(String(err));
      onError(error);
    }
  }
}

export const migrationService = new MigrationService();
