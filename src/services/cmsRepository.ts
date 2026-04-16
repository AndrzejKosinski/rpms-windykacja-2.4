import fs from 'fs';
import path from 'path';
import { cmsService } from '../shared/api/apiClientFactory';
import { FALLBACK_PAGE_LAYOUT } from '../config/fallbackLayout';
import { APPS_SCRIPT_URL, APPS_SCRIPT_API_KEY } from '../config';
import { CMSContent, BlogPost, Page, CMSUpdateResponse } from '../views/dashboard/types/cms';
import { logError, ErrorContext, ErrorSeverity } from '../utils/errorLogger';

export async function fetchContentFromCMS(view: 'full' | 'index' = 'full'): Promise<CMSContent | null> {
  try {
    const data = await cmsService.getCMS();
    
    // Jeśli API zwraca obiekt z polem full_content (jak w przypadku Apps Script i Supabase), zwróć to pole
    let content = data;
    if (data && data.full_content) {
      content = data.full_content;
    } else if (data && data.status === 'error') {
      throw new Error((data.message as string) || 'Error fetching CMS data');
    }
    
    return processView(content as CMSContent, view);
  } catch (error) {
    await logError({
      message: 'Failed to fetch content from CMS, using fallback',
      context: ErrorContext.CMS,
      severity: ErrorSeverity.WARN,
      error
    });
    const localData = await fetchLocalContent();
    return processView(localData as CMSContent, view);
  }
}

// ============================================================================
// WARSTWA ABSTRAKCJI DANYCH (PROPOZYCJA 2)
// Te funkcje "udają" zapytania do relacyjnej bazy danych (np. PostgreSQL).
// W przyszłości (Propozycja 3) podmienisz tylko ich wnętrze na zapytania SQL/ORM.
// ============================================================================

export async function getSettings(): Promise<Partial<CMSContent> | null> {
  // Pobieramy odchudzoną wersję, bo potrzebujemy tylko ustawień globalnych
  const content = await fetchContentFromCMS('index');
  if (!content) return null;
  
  // Zwracamy wszystko oprócz bloga (symulacja tabeli GlobalSettings)
  const { blog, ...settings } = content;
  return settings;
}

export async function getPosts(page: number = 1, limit: number = 9) {
  // Pobieramy odchudzoną wersję (tylko zajawki, bez treści)
  const content = await fetchContentFromCMS('index');
  const allPosts = content?.blog || [];
  
  // Filtrowanie tylko opublikowanych (symulacja: WHERE status = 'published')
  const publishedPosts = allPosts.filter((p: BlogPost) => p.status === 'published' || !p.status);
  
  // Sortowanie od najnowszych (symulacja: ORDER BY published_at DESC)
  // Zakładamy, że są już posortowane w CMS, ale można tu dodać logikę sortowania.
  
  // Paginacja (symulacja: LIMIT limit OFFSET offset)
  const startIndex = (page - 1) * limit;
  const paginatedPosts = publishedPosts.slice(startIndex, startIndex + limit);
  
  return {
    data: paginatedPosts,
    meta: {
      totalPosts: publishedPosts.length,
      totalPages: Math.ceil(publishedPosts.length / limit),
      currentPage: page,
      limit: limit
    }
  };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  // Pobieramy pełną wersję, bo potrzebujemy treści (content, faqs, seo)
  const content = await fetchContentFromCMS('full');
  const allPosts = content?.blog || [];
  
  const normalize = (s: string | null | undefined) => (s || '').toLowerCase().trim();
  const targetSlug = normalize(slug);
  
  // Wyszukiwanie (symulacja: SELECT * FROM Posts WHERE slug = targetSlug LIMIT 1)
  const post = allPosts.find((p: BlogPost) => normalize(p.slug || p.id) === targetSlug);
  
  return post || null;
}

export async function getRelatedPosts(currentSlug: string, category?: string, limit: number = 3): Promise<BlogPost[]> {
  const content = await fetchContentFromCMS('index');
  const allPosts = content?.blog || [];
  
  const normalize = (s: string | null | undefined) => (s || '').toLowerCase().trim();
  const targetSlug = normalize(currentSlug);
  
  // Filter out current post
  let related = allPosts.filter((p: BlogPost) => normalize(p.slug || p.id) !== targetSlug);
  
  // Try to find posts in the same category
  if (category) {
    const sameCategory = related.filter((p: BlogPost) => p.category === category);
    if (sameCategory.length > 0) {
      related = sameCategory;
    }
  }
  
  return related.slice(0, limit);
}

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  // Pobieramy odchudzoną wersję, bo potrzebujemy tylko slugów do generowania ścieżek
  const content = await fetchContentFromCMS('index');
  const allPosts = content?.blog || [];
  
  return allPosts.map((post: BlogPost) => ({
    slug: post.slug || post.id,
  }));
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const content = await fetchContentFromCMS('full');
  const allPages = content?.pages || [];
  
  const normalize = (s: string | null | undefined) => (s || '').toLowerCase().trim();
  const targetSlug = normalize(slug);
  
  const page = allPages.find((p: Page) => normalize(p.slug) === targetSlug);
  
  return page || null;
}

export async function getAllPageSlugs(): Promise<{ slug: string }[]> {
  const content = await fetchContentFromCMS('index');
  const allPages = content?.pages || [];
  
  return allPages.map((page: Page) => ({
    slug: page.slug,
  }));
}

// ============================================================================

// Funkcja pomocnicza do odchudzania danych (symulacja zachowania backendu)
function processView(data: CMSContent | null, view: 'full' | 'index'): CMSContent | null {
  if (!data || view === 'full') return data;
  
  // Tworzymy płytką kopię, aby nie modyfikować oryginału w pamięci
  const optimizedData = { ...data };
  
  if (optimizedData.blog && Array.isArray(optimizedData.blog)) {
    optimizedData.blog = optimizedData.blog.map((post: BlogPost) => {
      // Zwracamy tylko lekkie pola (zajawki)
      const { content, faqs, seo, ...lightPost } = post;
      return lightPost as BlogPost;
    });
  }
  
  return optimizedData;
}

export async function saveContentToCMS(data: CMSContent): Promise<CMSUpdateResponse> {
  try {
    const result = await cmsService.updateCMS({ data: data });
    return result as CMSUpdateResponse;
  } catch (error) {
    await logError({
      message: 'Error saving content to CMS',
      context: ErrorContext.CMS,
      severity: ErrorSeverity.ERROR,
      error
    });
    throw error;
  }
}

export async function initializeCMSInCloud(data: CMSContent): Promise<CMSUpdateResponse> {
  try {
    const result = await cmsService.initializeCMS({ data: data });
    return result as CMSUpdateResponse;
  } catch (error) {
    await logError({
      message: 'Error initializing CMS in cloud',
      context: ErrorContext.CMS,
      severity: ErrorSeverity.CRITICAL,
      error
    });
    throw error;
  }
}

async function fetchLocalContent() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'content.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return {
      ...data,
      pageLayout: data.pageLayout || FALLBACK_PAGE_LAYOUT
    };
  } catch (error) {
    console.error('Error reading local content.json:', error);
    return null;
  }
}
