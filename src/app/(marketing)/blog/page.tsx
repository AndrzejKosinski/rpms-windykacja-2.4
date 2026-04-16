import React from 'react';
import { Metadata } from 'next';
import { getSettings, getPosts } from '../../../services/cmsRepository';
import BlogClient from './BlogClient';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  
  const title = settings?.seo?.blog?.title || "Blog - RPMS Windykacja";
  const description = settings?.seo?.blog?.description || "Baza wiedzy i artykuły eksperckie z zakresu windykacji B2B i prawa.";
  const keywords = settings?.seo?.blog?.keywords || "blog, windykacja, prawo, porady prawne, odzyskiwanie długów";

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: '/blog',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pl_PL',
      siteName: 'RPMS Windykacja',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BlogPage() {
  // Pobieramy wszystkie posty (limit = 1000, bo paginacja jest na razie obsługiwana po stronie klienta w BlogClient)
  // W przyszłości można przenieść paginację całkowicie na serwer (Server Components).
  const postsResponse = await getPosts(1, 1000);
  
  // Tworzymy obiekt kompatybilny z obecnym BlogClient
  const siteContent = {
    blog: postsResponse.data
  };
  
  return (
    <main>
      <BlogClient initialContent={siteContent} />
    </main>
  );
}
