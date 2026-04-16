import { MetadataRoute } from 'next';
import { fetchContentFromCMS } from '../services/cmsRepository';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://rpms-windykacja.pl';
  
  const rawContent = await fetchContentFromCMS();
  const siteContent = rawContent?.full_content || rawContent;
  const posts = siteContent?.blog || [];
  const pages = siteContent?.pages || [];

  const blogUrls = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug || post.id}`,
    lastModified: new Date(post.publishedAt || post.date || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const pageUrls = pages.map((page: any) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...pageUrls,
    ...blogUrls,
  ];
}
